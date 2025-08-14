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

interface EmailRequest {
  eventId: string;
  email: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { eventId, email }: EmailRequest = await req.json();

    // Fetch event details from database
    const { data: event, error: eventError } = await supabase
      .from('events')
      .select('*')
      .eq('id', eventId)
      .single();

    if (eventError || !event) {
      throw new Error('Event not found');
    }

    const inviteLink = `${Deno.env.get('SITE_URL')}/invite/${eventId}`;
    const manageLink = `${Deno.env.get('SITE_URL')}/manage/${eventId}`;

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

    // Format guest limit
    const guestLimitText = event.unlimited_guests ? 'Unlimited' : `${event.guest_limit} guests`;

    const emailResponse = await resend.emails.send({
      from: "Summons <onboarding@resend.dev>",
      to: [email],
      subject: `Your Event "${event.title}" is Ready! - Summons`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
          <div style="background: linear-gradient(135deg, #661D98, #B12F83); padding: 40px 20px; text-align: center; border-radius: 12px 12px 0 0;">
            <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">🎉 Your Event is Ready!</h1>
            <p style="color: #ffffff; margin: 10px 0 0 0; font-size: 16px;">Everything you need to manage "${event.title}"</p>
          </div>
          
          <div style="padding: 30px 20px;">
            <div style="background: #F8F4FF; padding: 25px; border-radius: 12px; margin-bottom: 25px; border-left: 4px solid #661D98;">
              <h2 style="color: #661D98; margin: 0 0 15px 0; font-size: 22px;">📅 Event Details</h2>
              <div style="line-height: 1.6; color: #333;">
                <p style="margin: 8px 0;"><strong>Title:</strong> ${event.title}</p>
                <p style="margin: 8px 0;"><strong>Date:</strong> ${eventDate}</p>
                <p style="margin: 8px 0;"><strong>Time:</strong> ${startTime} - ${endTime}</p>
                <p style="margin: 8px 0;"><strong>Location:</strong> ${event.location}</p>
                <p style="margin: 8px 0;"><strong>Guest Limit:</strong> ${guestLimitText}</p>
                <p style="margin: 8px 0;"><strong>RSVP Deadline:</strong> ${rsvpDeadlineText}</p>
                ${event.description ? `<p style="margin: 15px 0 8px 0;"><strong>Description:</strong></p><p style="margin: 0; font-style: italic;">${event.description}</p>` : ''}
              </div>
            </div>
            
            <div style="background: #FFF2FE; padding: 25px; border-radius: 12px; margin: 25px 0; border: 2px solid #FFD5FF;">
              <h3 style="color: #661D98; margin: 0 0 15px 0; font-size: 18px;">📤 Invitation Link</h3>
              <p style="color: #666; margin: 0 0 10px 0; font-size: 14px;">Share this link with your guests so they can RSVP:</p>
              <div style="background: #ffffff; padding: 12px; border-radius: 8px; border: 1px solid #ddd; word-break: break-all;">
                <a href="${inviteLink}" style="color: #B12F83; text-decoration: none; font-weight: bold; font-size: 14px;">${inviteLink}</a>
              </div>
            </div>
            
            <div style="background: #FFD5FF; padding: 25px; border-radius: 12px; margin: 25px 0; border: 2px solid #B12F83;">
              <h3 style="color: #661D98; margin: 0 0 15px 0; font-size: 18px;">⚙️ Management Link</h3>
              <p style="color: #666; margin: 0 0 10px 0; font-size: 14px;">Use this link to view RSVPs, edit your event, or cancel it:</p>
              <div style="background: #ffffff; padding: 12px; border-radius: 8px; border: 1px solid #ddd; word-break: break-all;">
                <a href="${manageLink}" style="color: #B12F83; text-decoration: none; font-weight: bold; font-size: 14px;">${manageLink}</a>
              </div>
            </div>
            
            <div style="background: #E8F5E8; padding: 20px; border-radius: 12px; margin: 25px 0; border-left: 4px solid #4CAF50;">
              <h4 style="color: #2E7D32; margin: 0 0 10px 0; font-size: 16px;">💡 Quick Tips</h4>
              <ul style="color: #666; margin: 0; padding-left: 20px; font-size: 14px;">
                <li>Save both links in a safe place</li>
                <li>Share the invitation link with all your guests</li>
                <li>Check the management page regularly to see who's coming</li>
                <li>You can edit event details anytime using the management link</li>
              </ul>
            </div>
          </div>
          
          <div style="background: #f9f9f9; padding: 20px; text-align: center; border-radius: 0 0 12px 12px;">
            <p style="color: #666; font-size: 14px; margin: 0;">
              Best regards,<br>
              <strong>The Summons Team</strong>
            </p>
            <p style="color: #999; font-size: 12px; margin: 10px 0 0 0;">
              Keep your event organized and your guests informed ✨
            </p>
          </div>
        </div>
      `,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-event-details function:", error);
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