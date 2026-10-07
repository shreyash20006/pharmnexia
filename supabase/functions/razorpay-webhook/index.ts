// Supabase Edge Function: razorpay-webhook
// Secure server-side payment confirmation & live access activation

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-razorpay-signature",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const signature = req.headers.get("x-razorpay-signature");
    const secret = Deno.env.get("RAZORPAY_WEBHOOK_SECRET");
    const bodyText = await req.text();

    if (!signature || !secret) {
      return new Response(JSON.stringify({ error: "Missing signature or webhook secret" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // 1. Cryptographic HMAC SHA-256 Signature Verification
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );
    const signatureBuffer = await crypto.subtle.sign(
      "HMAC",
      key,
      encoder.encode(bodyText)
    );
    const expectedSignature = Array.from(new Uint8Array(signatureBuffer))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    if (expectedSignature !== signature) {
      return new Response(JSON.stringify({ error: "Invalid webhook signature" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    const payload = JSON.parse(bodyText);
    const event = payload.event;
    const paymentEntity = payload.payload?.payment?.entity;

    // 2. Process Successful Payment Event
    if (event === "payment.captured" || event === "order.paid") {
      const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
      const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
      const supabase = createClient(supabaseUrl, supabaseServiceKey);

      const orderId = paymentEntity.order_id;
      const paymentId = paymentEntity.id;
      const amountPaid = paymentEntity.amount / 100; // Razorpay sends in paise
      const currency = paymentEntity.currency;
      const bookingCode = paymentEntity.notes?.booking_code;
      const registrationCode = paymentEntity.notes?.registration_code;
      const programId = paymentEntity.notes?.program_id;

      // 3. Prevent Duplicate Processing
      const { data: existingPayment } = await supabase
        .from("payments")
        .select("id, status")
        .eq("gateway_payment_id", paymentId)
        .maybeSingle();

      if (existingPayment && existingPayment.status === "SUCCESS") {
        return new Response(JSON.stringify({ message: "Already processed" }), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }

      // 4. Update Payment Record to SUCCESS
      await supabase.from("payments").insert({
        booking_code: bookingCode || null,
        program_id: programId || null,
        gateway_payment_id: paymentId,
        gateway_order_id: orderId,
        amount: amountPaid,
        currency: currency,
        status: "SUCCESS",
        gateway_name: "RAZORPAY",
        gateway_signature_verified: true,
        paid_at: new Date().toISOString()
      });

      // 5. Update Mentorship Booking State to CONFIRMED
      if (bookingCode) {
        await supabase
          .from("bookings")
          .update({
            status: "CONFIRMED",
            payment_status: "SUCCESS",
            payment_id: paymentId,
            calendar_sync_status: "CONFIRMED"
          })
          .eq("booking_code", bookingCode);
      }

      // 6. Update Program Registration State to CONFIRMED
      if (registrationCode) {
        await supabase
          .from("program_registrations")
          .update({
            payment_status: "PAID",
            payment_id: paymentId,
            calendar_status: "CONFIRMED"
          })
          .eq("registration_code", registrationCode);
      }

      // 6. Record Funnel Analytics Event
      if (programId) {
        await supabase.from("program_analytics_events").insert({
          program_id: programId,
          event_type: "PAYMENT_SUCCESS",
          metadata: {
            order_id: orderId,
            payment_id: paymentId,
            amount: amountPaid,
            currency: currency
          }
        });
      }
    }

    return new Response(JSON.stringify({ status: "success", received: true }), {
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
