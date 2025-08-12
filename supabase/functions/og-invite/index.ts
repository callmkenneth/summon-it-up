import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const pathSegments = url.pathname.split('/');
    const eventId = pathSegments[pathSegments.length - 1];

    if (!eventId) {
      return new Response('Event ID required', { status: 400 });
    }

    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch event data
    const { data: event, error } = await supabase
      .from('events')
      .select('title, description, image_url')
      .eq('id', eventId)
      .single();

    if (error || !event) {
      console.error('Error fetching event:', error);
      // Redirect to React app for error handling
      return Response.redirect(`${url.origin}/invite/${eventId}`, 302);
    }

    // Check if this is a social media crawler
    const userAgent = req.headers.get('user-agent') || '';
    console.log('User Agent:', userAgent);
    const isCrawler = /facebookexternalhit|twitterbot|linkedinbot|slackbot|whatsapp|telegram|discordbot/i.test(userAgent);
    console.log('Is Crawler:', isCrawler);

    // For regular users, redirect to React app
    if (!isCrawler) {
      console.log('Redirecting regular user to React app');
      return Response.redirect(`https://lsbaijtsrkvrnkjyioza.supabase.co/invite/${eventId}`, 302);
    }

    // For crawlers, serve HTML with meta tags
    console.log('Serving HTML for crawler');
    const title = event.title || 'You\'re Invited!';
    const description = event.description || 'Join us for an amazing event';
    const imageUrl = event.image_url || `https://lsbaijtsrkvrnkjyioza.supabase.co/Summons-logo.png`;
    const canonicalUrl = `https://lsbaijtsrkvrnkjyioza.supabase.co/invite/${eventId}`;
    
    console.log('Event data:', { title, description, imageUrl, canonicalUrl });

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    
    <!-- Open Graph Meta Tags -->
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${description}">
    <meta property="og:image" content="${imageUrl}">
    <meta property="og:url" content="${canonicalUrl}">
    <meta property="og:type" content="website">
    <meta property="og:site_name" content="Summons">
    
    <!-- Twitter Card Meta Tags -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${title}">
    <meta name="twitter:description" content="${description}">
    <meta name="twitter:image" content="${imageUrl}">
    
    <!-- Additional Meta Tags -->
    <meta name="description" content="${description}">
    <link rel="canonical" href="${canonicalUrl}">
    
    <!-- Immediate redirect for any non-crawler that gets here -->
    <script>
        window.location.replace('${canonicalUrl}');
    </script>
</head>
<body>
    <h1>${title}</h1>
    <p>${description}</p>
    <a href="${canonicalUrl}">View Event</a>
</body>
</html>`;

    return new Response(html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
        ...corsHeaders,
      },
    });

  } catch (error) {
    console.error('Error in og-invite function:', error);
    
    // Fallback redirect to React app
    const url = new URL(req.url);
    const pathSegments = url.pathname.split('/');
    const eventId = pathSegments[pathSegments.length - 1];
    
    return Response.redirect(`https://lsbaijtsrkvrnkjyioza.supabase.co/invite/${eventId || ''}`, 302);
  }
});