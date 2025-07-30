import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

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

    const inviteLink = `${Deno.env.get('SITE_URL')}/invite/${eventId}`;
    const manageLink = `${Deno.env.get('SITE_URL')}/manage/${eventId}`;

    const emailResponse = await resend.emails.send({
      from: "Summons <onboarding@resend.dev>",
      to: [email],
      subject: "Your Event Links - Summons",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #661D98;">Your Event is Ready!</h1>
          
          <p>Your event has been created successfully. Here are your important links:</p>
          
          <div style="background: #FFF2FE; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #661D98; margin-top: 0;">📤 Invitation Link</h3>
            <p>Share this link with your guests:</p>
            <a href="${inviteLink}" style="color: #B12F83; text-decoration: none; font-weight: bold;">${inviteLink}</a>
          </div>
          
          <div style="background: #FFD5FF; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #661D98; margin-top: 0;">⚙️ Management Link</h3>
            <p>Use this link to manage your event and view RSVPs:</p>
            <a href="${manageLink}" style="color: #B12F83; text-decoration: none; font-weight: bold;">${manageLink}</a>
          </div>
          
          <p style="color: #666; font-size: 14px; margin-top: 30px;">
            Keep these links safe! You'll need them to manage your event.
          </p>
          
          <p style="color: #666; font-size: 14px;">
            Best regards,<br>
            The Summons Team
          </p>
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