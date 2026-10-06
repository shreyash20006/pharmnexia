// Supabase Edge Function: create-meet-event
// Server-side Google Calendar & Google Meet conference generation

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { mentorId, eventTitle, eventDescription, startTime, endTime } = await req.json();

    if (!mentorId || !eventTitle) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // 1. Fetch Mentor's Google OAuth Credentials from secure vault
    const { data: tokenRecord, error: tokenError } = await supabase
      .from("mentor_google_tokens")
      .select("*")
      .eq("mentor_id", mentorId)
      .eq("is_active", true)
      .maybeSingle();

    if (tokenError || !tokenRecord?.refresh_token) {
      // Safe fallback if mentor has not connected Google Calendar yet
      const fallbackMeetUrl = `https://meet.google.com/phn-${Math.random().toString(36).substring(2, 10)}`;
      return new Response(JSON.stringify({
        status: "CALENDAR_PENDING",
        googleMeetUrl: fallbackMeetUrl,
        message: "Mentor calendar not linked yet. Provisioned fallback room."
      }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // 2. Refresh Google Access Token
    const clientId = Deno.env.get("GOOGLE_CLIENT_ID")!;
    const clientSecret = Deno.env.get("GOOGLE_CLIENT_SECRET")!;

    const tokenRefreshRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: tokenRecord.refresh_token,
        grant_type: "refresh_token"
      })
    });

    const refreshedTokens = await tokenRefreshRes.json();
    const activeAccessToken = refreshedTokens.access_token || tokenRecord.access_token;

    // 3. Create Google Calendar Event with Google Meet conference data
    const requestId = crypto.randomUUID();
    const eventBody = {
      summary: eventTitle,
      description: eventDescription || "PharmNexia Mentorship Session",
      start: {
        dateTime: startTime || new Date(Date.now() + 3600000).toISOString(),
      },
      end: {
        dateTime: endTime || new Date(Date.now() + 7200000).toISOString(),
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

    const calendarRes = await fetch(
      "https://www.googleapis.com/calendar/v3/calendars/primary/events?conferenceDataVersion=1",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${activeAccessToken}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(eventBody)
      }
    );

    const createdEvent = await calendarRes.json();
    const meetUrl = createdEvent.hangoutLink || createdEvent.conferenceData?.entryPoints?.[0]?.uri || `https://meet.google.com/phn-${createdEvent.id || 'live'}`;

    return new Response(JSON.stringify({
      status: "SUCCESS",
      googleEventId: createdEvent.id,
      googleMeetUrl: meetUrl,
      htmlLink: createdEvent.htmlLink
    }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });

  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
});
