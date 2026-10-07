/**
 * Edge Bot Shield Middleware for Cloudflare Pages.
 * 
 * Intercepts incoming requests before serving static assets.
 * Blocks automated scrapers, crawlers, and AI bots with HTTP 403 Forbidden.
 */

export async function onRequest(context) {
  const { request, next } = context;
  const ua = (request.headers.get("user-agent") || "").toLowerCase();

  // 1. Block automated scrapers, CLI downloaders, and AI crawlers
  const blockedAgents = [
    "curl", "python", "wget", "httpclient", "java/", "postman",
    "gptbot", "chatgpt-user", "claudebot", "anthropic-ai",
    "bytespider", "ccbot", "perplexitybot", "semrush", "ahrefs",
    "dotbot", "screaming frog", "headlesschrome", "phantomjs"
  ];

  if (blockedAgents.some((agent) => ua.includes(agent))) {
    return new Response("403 Forbidden: Automated scraper or AI bot access is blocked by Cloudflare Edge Shield.", {
      status: 403,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "X-Robots-Tag": "noindex, nofollow, noarchive",
      },
    });
  }

  // 2. Pass real users through to the web application
  return next();
}
