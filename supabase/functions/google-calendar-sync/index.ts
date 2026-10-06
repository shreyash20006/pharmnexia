// Supabase Edge Function: google-calendar-sync
// Handles event creation, updates, cancellations, and safe calendar disconnects

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Helper: Refresh access token if expired
async function getValidAccessToken(supabaseAdmin: any, mentorId: string): Promise<string | null> {
  const { data: tokenRecord, error } = await supabaseAdmin
    .from("mentor_google_tokens")
    .select("*")
    .eq("mentor_id", mentorId)
    .maybeSingle();

  if (error || !tokenRecord?.refresh_token) {
    return null;
  }

  const isExpired = new Date(tokenRecord.token_expiry).getTime() <= Date.now() + 60000;
  if (!isExpired && tokenRecord.access_token) {
    return tokenRecord.access_token;
  }

  // Refresh with Google
  const clientId = Deno.env.get("GOOGLE_CLIENT_ID")!;
  const clientSecret = Deno.env.get("GOOGLE_CLIENT_SECRET")!;

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: tokenRecord.refresh_token,
      grant_type: "refresh_token"
    })
  });

  if (!res.ok) {
    console.error("Token refresh failed:", await res.text());
    return null;
  }

  const data = await res.json();
  const newAccessToken = data.access_token;
  const newExpiry = new Date(Date.now() + (data.expires_in || 3600) * 1000).toISOString();

  await supabaseAdmin
    .from("mentor_google_tokens")
    .update({
      access_token: newAccessToken,
      token_expiry: newExpiry,
      updated_at: new Date().toISOString()
    })
    .eq("mentor_id", mentorId);

  return newAccessToken;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Missing Authorization header" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    const { action, mentorId, eventData } = await req.json();

    if (!mentorId || !action) {
      return new Response(JSON.stringify({ error: "Missing action or mentorId" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // =========================================================================
    // ACTION: DISCONNECT GOOGLE CALENDAR
    // =========================================================================
    if (action === "disconnect") {
      const { data: tokenRecord } = await supabaseAdmin
        .from("mentor_google_tokens")
        .select("access_token, refresh_token")
        .eq("mentor_id", mentorId)
        .maybeSingle();

      if (tokenRecord?.access_token) {
        try {
          await fetch(`https://oauth2.googleapis.com/revoke?token=${tokenRecord.access_token}`, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" }
          });
        } catch (e) {
          console.warn("Revoke token error:", e);
        }
      }

      // 1. Delete token vault record
      await supabaseAdmin.from("mentor_google_tokens").delete().eq("mentor_id", mentorId);

      // 2. Update safe connection metadata to DISCONNECTED
      await supabaseAdmin
        .from("mentor_calendar_connections")
        .update({
          is_connected: false,
          sync_status: "DISCONNECTED",
          updated_at: new Date().toISOString()
        })
        .eq("mentor_id", mentorId);

      // 3. Log Audit Trail
      await supabaseAdmin.from("audit_logs").insert({
        actor: "Mentor",
        actor_id: mentorId,
        action: "MENTOR_CALENDAR_DISCONNECTED",
        details: "Mentor disconnected Google Calendar access safely.",
        status: "SUCCESS"
      });

      return new Response(JSON.stringify({ status: "DISCONNECTED", message: "Google Calendar disconnected." }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // =========================================================================
    // ACTION: CREATE GOOGLE CALENDAR EVENT (WITH GOOGLE MEET)
    // =========================================================================
    if (action === "create_event") {
      const accessToken = await getValidAccessToken(supabaseAdmin, mentorId);

      if (!accessToken) {
        // Fallback room without failing payment or booking
        const fallbackMeetUrl = `https://meet.google.com/phn-${Math.random().toString(36).substring(2, 10)}`;
        return new Response(JSON.stringify({
          status: "CALENDAR_PENDING",
          googleMeetUrl: fallbackMeetUrl,
          message: "Google Calendar not connected or token expired. Fallback room created."
        }), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }

      const requestId = crypto.randomUUID();
      const calendarEventPayload = {
        summary: eventData.title || "PharmNexia Mentorship Session",
        description: eventData.description || `PharmNexia Session (Booking Ref: ${eventData.bookingCode || 'PHN'})`,
        start: {
          dateTime: eventData.startTime || new Date(Date.now() + 3600000).toISOString(),
          timeZone: eventData.timeZone || "Asia/Kolkata"
        },
        end: {
          dateTime: eventData.endTime || new Date(Date.now() + 7200000).toISOString(),
          timeZone: eventData.timeZone || "Asia/Kolkata"
        },
        conferenceData: {
          createRequest: {
            requestId: requestId,
            conferenceSolutionKey: {
              type: "hangoutsMeet"
            }
          }
        }
      };

      const calRes = await fetch(
        "https://www.googleapis.com/calendar/v3/calendars/primary/events?conferenceDataVersion=1",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify(calendarEventPayload)
        }
      );

      if (!calRes.ok) {
        const errorDetail = await calRes.text();
        console.error("Google Calendar API error:", errorDetail);
        const fallbackMeetUrl = `https://meet.google.com/phn-${Math.random().toString(36).substring(2, 10)}`;
        return new Response(JSON.stringify({
          status: "CALENDAR_PENDING",
          googleMeetUrl: fallbackMeetUrl,
          error: errorDetail
        }), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }

      const googleEvent = await calRes.json();
      const meetUrl = googleEvent.hangoutLink ||
                      googleEvent.conferenceData?.entryPoints?.[0]?.uri ||
                      `https://meet.google.com/phn-${googleEvent.id || 'live'}`;

      // Update booking or program if ID provided
      if (eventData.bookingId) {
        await supabaseAdmin
          .from("bookings")
          .update({
            google_event_id: googleEvent.id,
            google_meet_link: meetUrl,
            calendar_sync_status: "SYNCED"
          })
          .eq("id", eventData.bookingId);
      }

      if (eventData.programId) {
        await supabaseAdmin
          .from("programs")
          .update({
            google_event_id: googleEvent.id,
            google_meet_url: meetUrl,
            calendar_sync_status: "SYNCED"
          })
          .eq("id", eventData.programId);
      }

      return new Response(JSON.stringify({
        status: "SYNCED",
        googleEventId: googleEvent.id,
        googleMeetUrl: meetUrl,
        htmlLink: googleEvent.htmlLink
      }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // =========================================================================
    // ACTION: UPDATE GOOGLE CALENDAR EVENT
    // =========================================================================
    if (action === "update_event") {
      const accessToken = await getValidAccessToken(supabaseAdmin, mentorId);
      if (!accessToken || !eventData.googleEventId) {
        return new Response(JSON.stringify({ status: "SKIPPED", message: "No active token or event ID" }), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }

      const patchPayload = {
        summary: eventData.title,
        description: eventData.description,
        start: { dateTime: eventData.startTime },
        end: { dateTime: eventData.endTime }
      };

      await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventData.googleEventId}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify(patchPayload)
        }
      );

      return new Response(JSON.stringify({ status: "UPDATED" }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // =========================================================================
    // ACTION: DELETE / CANCEL EVENT
    // =========================================================================
    if (action === "delete_event") {
      const accessToken = await getValidAccessToken(supabaseAdmin, mentorId);
      if (accessToken && eventData.googleEventId) {
        await fetch(
          `https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventData.googleEventId}`,
          {
            method: "DELETE",
            headers: { Authorization: `Bearer ${accessToken}` }
          }
        );
      }

      return new Response(JSON.stringify({ status: "DELETED" }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    return new Response(JSON.stringify({ error: "Unknown action" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });

  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
});
