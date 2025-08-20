import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface RSVPConfirmationRequest {
  eventId: string;
  email: string;
  attendeeName: string;
  status: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { eventId, email, attendeeName, status }: RSVPConfirmationRequest = body;

    // Input validation
    if (!eventId || typeof eventId !== 'string' || eventId.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: "Invalid or missing eventId" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return new Response(
        JSON.stringify({ error: "Invalid or missing email address" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    if (!attendeeName || typeof attendeeName !== 'string' || attendeeName.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: "Invalid or missing attendee name" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    if (!status || !['yes', 'no', 'waitlist'].includes(status)) {
      return new Response(
        JSON.stringify({ error: "Invalid status. Must be 'yes', 'no', or 'waitlist'" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Sanitize inputs
    const sanitizedEventId = eventId.trim();
    const sanitizedEmail = email.trim();
    const sanitizedAttendeeName = attendeeName.trim().substring(0, 100); // Limit name length

    // Fetch event details from database
    const { data: event, error: eventError } = await supabase
      .from('events')
      .select('*')
      .eq('id', sanitizedEventId)
      .single();

    if (eventError || !event) {
      throw new Error('Event not found');
    }

    const inviteLink = `${Deno.env.get('SITE_URL')}/invite/${sanitizedEventId}`;

    // Format date and time for display
    const eventDate = new Date(event.event_date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const startTime = new Date(`2000-01-01T${event.start_time}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });

    const endTime = new Date(`2000-01-01T${event.end_time}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });

    // Format RSVP deadline if it exists
    const rsvpDeadlineText = event.rsvp_deadline 
      ? new Date(event.rsvp_deadline).toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        })
      : 'No deadline set';

    // Determine status message and color
    const getStatusInfo = (status: string) => {
      switch (status) {
        case 'yes':
          return {
            message: "You're attending! 🎉",
            color: "#4CAF50",
            backgroundColor: "#E8F5E8"
          };
        case 'waitlist':
          return {
            message: "You're on the waitlist 📋",
            color: "#FF9800",
            backgroundColor: "#FFF3E0"
          };
        default:
          return {
            message: "RSVP Confirmed",
            color: "#661D98",
            backgroundColor: "#F8F4FF"
          };
      }
    };

    const statusInfo = getStatusInfo(status);

    const emailResponse = await resend.emails.send({
      from: "Summons <onboarding@resend.dev>",
      to: [sanitizedEmail],
      subject: `RSVP Confirmed for "${event.title}" - Summons`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
          <div style="background: linear-gradient(135deg, #661D98, #B12F83); padding: 40px 20px; text-align: center; border-radius: 12px 12px 0 0;">
            <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">RSVP Confirmed!</h1>
            <p style="color: #ffffff; margin: 10px 0 0 0; font-size: 16px;">Thanks for responding, ${sanitizedAttendeeName}!</p>
          </div>
          
          <div style="padding: 30px 20px;">
            <div style="background: ${statusInfo.backgroundColor}; padding: 25px; border-radius: 12px; margin-bottom: 25px; border-left: 4px solid ${statusInfo.color}; text-align: center;">
              <h2 style="color: ${statusInfo.color}; margin: 0; font-size: 24px;">${statusInfo.message}</h2>
            </div>

            <div style="background: #F8F4FF; padding: 25px; border-radius: 12px; margin-bottom: 25px; border-left: 4px solid #661D98;">
              <h2 style="color: #661D98; margin: 0 0 15px 0; font-size: 22px;">📅 Event Details</h2>
              <div style="line-height: 1.6; color: #333;">
                <p style="margin: 8px 0;"><strong>Event:</strong> ${event.title}</p>
                <p style="margin: 8px 0;"><strong>Date:</strong> ${eventDate}</p>
                <p style="margin: 8px 0;"><strong>Time:</strong> ${startTime} - ${endTime}</p>
                ${!event.hide_location_until_rsvp || status === 'yes' ? `<p style="margin: 8px 0;"><strong>Location:</strong> ${event.location}</p>` : ''}
                ${event.rsvp_deadline ? `<p style="margin: 8px 0;"><strong>RSVP Deadline:</strong> ${rsvpDeadlineText}</p>` : ''}
                ${event.description ? `<p style="margin: 15px 0 8px 0;"><strong>Description:</strong></p><p style="margin: 0; font-style: italic;">${event.description}</p>` : ''}
              </div>
            </div>
            
            ${status === 'yes' && event.hide_location_until_rsvp ? `
            <div style="background: #E8F5E8; padding: 20px; border-radius: 12px; margin: 25px 0; border-left: 4px solid #4CAF50;">
              <h4 style="color: #2E7D32; margin: 0 0 10px 0; font-size: 16px;">📍 Location Details</h4>
              <p style="color: #666; margin: 0; font-size: 14px;">Since you're attending, here's the location: <strong>${event.location}</strong></p>
            </div>
            ` : ''}
            
            <div style="background: #FFF2FE; padding: 25px; border-radius: 12px; margin: 25px 0; border: 2px solid #FFD5FF;">
              <h3 style="color: #661D98; margin: 0 0 15px 0; font-size: 18px;">🔗 Need to Update Your RSVP?</h3>
              <p style="color: #666; margin: 0 0 15px 0; font-size: 14px;">Use this link to change your response or check event updates:</p>
              <div style="text-align: center;">
                <a href="${inviteLink}" style="background: #B12F83; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">View Event & Update RSVP</a>
              </div>
            </div>

            ${event.host_email ? `
            <div style="background: #F0F8FF; padding: 20px; border-radius: 12px; margin: 25px 0; border-left: 4px solid #2196F3;">
              <h4 style="color: #1976D2; margin: 0 0 10px 0; font-size: 16px;">📧 Questions?</h4>
              <p style="color: #666; margin: 0; font-size: 14px;">Contact the host at: <a href="mailto:${event.host_email}" style="color: #1976D2; text-decoration: none;">${event.host_email}</a></p>
            </div>
            ` : ''}
            
            ${status === 'yes' ? `
            <div style="background: #FFFBF0; padding: 20px; border-radius: 12px; margin: 25px 0; border-left: 4px solid #FF9800;">
              <h4 style="color: #F57C00; margin: 0 0 10px 0; font-size: 16px;">📱 Add to Calendar</h4>
              <p style="color: #666; margin: 0; font-size: 14px;">Don't forget to add this event to your calendar so you don't miss it!</p>
            </div>
            ` : ''}
          </div>
          
          <div style="background: #f9f9f9; padding: 20px; text-align: center; border-radius: 0 0 12px 12px;">
            <p style="color: #666; font-size: 14px; margin: 0;">
              Thanks for using Summons!<br>
              <strong>The Summons Team</strong>
            </p>
            <p style="color: #999; font-size: 12px; margin: 10px 0 0 0;">
              Making event planning simple and beautiful ✨
            </p>
          </div>
        </div>
      `,
    });

    console.log("RSVP confirmation email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-rsvp-confirmation function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);