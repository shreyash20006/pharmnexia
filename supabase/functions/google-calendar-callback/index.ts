// Supabase Edge Function: google-calendar-callback
// Exchanges authorization code for Google tokens & stores them in secure vault

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const errorParam = url.searchParams.get("error");

  const frontendUrl = Deno.env.get("FRONTEND_URL") || "https://pharmnexia.in";

  // 1. Handle user denied or Google error
  if (errorParam || !code || !state) {
    const errorMsg = encodeURIComponent(errorParam || "Missing OAuth authorization code");
    return Response.redirect(`${frontendUrl}/dashboard?calendar=error&reason=${errorMsg}`, 302);
  }

  try {
    // 2. Decode and verify state parameter
    let stateData: { userId: string; timestamp: number };
    try {
      stateData = JSON.parse(atob(state));
    } catch {
      return Response.redirect(`${frontendUrl}/dashboard?calendar=error&reason=invalid_state`, 302);
    }

    const mentorId = stateData.userId;
    if (!mentorId) {
      return Response.redirect(`${frontendUrl}/dashboard?calendar=error&reason=invalid_mentor_identity`, 302);
    }

    // 3. Exchange authorization code with Google OAuth token endpoint
    const clientId = Deno.env.get("GOOGLE_CLIENT_ID")!;
    const clientSecret = Deno.env.get("GOOGLE_CLIENT_SECRET")!;
    const redirectUri = Deno.env.get("GOOGLE_REDIRECT_URI") || `${url.origin}/functions/v1/google-calendar-callback`;

    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code"
      })
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error("Google token exchange error:", errorText);
      return Response.redirect(`${frontendUrl}/dashboard?calendar=error&reason=token_exchange_failed`, 302);
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;
    const refreshToken = tokenData.refresh_token;
    const expiresIn = tokenData.expires_in || 3600;
    const tokenExpiry = new Date(Date.now() + expiresIn * 1000).toISOString();

    // 4. Fetch Connected Google Account Email (Minimal Identity Scope)
    let connectedEmail = "mentor@gmail.com";
    try {
      const userInfoRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      if (userInfoRes.ok) {
        const userInfo = await userInfoRes.json();
        connectedEmail = userInfo.email || connectedEmail;
      }
    } catch (e) {
      console.warn("Could not fetch user info:", e);
    }

    // 5. Initialize Supabase Admin Client using service_role key
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    // 6. SECURITY CRITICAL: Store tokens in mentor_google_tokens (ZERO mentor frontend read access)
    await supabaseAdmin
      .from("mentor_google_tokens")
      .upsert({
        mentor_id: mentorId,
        access_token: accessToken,
        refresh_token: refreshToken || "",
        token_expiry: tokenExpiry,
        scopes: ["https://www.googleapis.com/auth/calendar.events", "https://www.googleapis.com/auth/userinfo.email"],
        updated_at: new Date().toISOString()
      }, { onConflict: "mentor_id" });

    // 7. Store ONLY Safe Non-Sensitive Connection Metadata in mentor_calendar_connections
    await supabaseAdmin
      .from("mentor_calendar_connections")
      .upsert({
        mentor_id: mentorId,
        google_account_email: connectedEmail,
        calendar_id: "primary",
        is_connected: true,
        sync_status: "SYNCED",
        connected_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }, { onConflict: "mentor_id" });

    // 8. Log Administrative Audit Trail
    await supabaseAdmin.from("audit_logs").insert({
      actor: connectedEmail,
      actor_id: mentorId,
      action: "MENTOR_CALENDAR_CONNECTED",
      target_type: "MENTOR_CALENDAR",
      target_id: mentorId,
      details: `Mentor connected Google Calendar (${connectedEmail})`,
      status: "SUCCESS"
    });

    // 9. Redirect mentor back to PharmNexia Dashboard with success query param
    return Response.redirect(`${frontendUrl}/dashboard?calendar=connected&email=${encodeURIComponent(connectedEmail)}`, 302);

  } catch (err: any) {
    console.error("Callback exception:", err);
    return Response.redirect(`${frontendUrl}/dashboard?calendar=error&reason=${encodeURIComponent(err.message)}`, 302);
  }
});
