/**
 * Cloudflare Worker: Gemini AI Assistant Proxy for Portfolio
 * Enhanced with Gemini Function Calling, 200k Token Ceiling Guard & 10 req/min Rate Limiting
 * Author: Tong Nha Vy Portfolio Assistant
 */

import localPortfolioData from "../../src/data/portfolioData.json";
import localDocsBundle from "./docsBundle.json";

// List of allowed origins for CORS
const ALLOWED_ORIGINS = [
  "https://vytong.pages.dev",
  "https://vztong.github.io"
];

// Default GitHub Raw URL for dynamic live data fetching
const DEFAULT_DATA_URL =
  "https://raw.githubusercontent.com/vztong/vztong.github.io/main/src/data/portfolioData.json";

// Default GitHub Raw Base URL for repository documentation
const DEFAULT_DOCS_BASE_URL =
  "https://raw.githubusercontent.com/vztong/vztong.github.io/main";

// In-memory cache for ultra-fast Edge response (TTL: 5 minutes for data, 10 minutes for docs)
let cachedPortfolioData = null;
let lastCacheTimestamp = 0;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

const docCache = new Map();
const DOC_CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

// In-memory sliding window rate limiter per client IP
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute window

/**
 * Checks sliding window rate limit (Max 10 requests per minute by default)
 * @param {string} clientIp
 * @param {number} maxRequests
 * @returns {{ allowed: boolean, retryAfterSeconds?: number }}
 */
function checkRateLimit(clientIp, maxRequests = 10) {
  const now = Date.now();
  const timestamps = rateLimitMap.get(clientIp) || [];
  const validTimestamps = timestamps.filter((ts) => now - ts < RATE_LIMIT_WINDOW_MS);

  if (validTimestamps.length >= maxRequests) {
    const oldest = validTimestamps[0];
    const retryAfterSeconds = Math.max(1, Math.ceil((oldest + RATE_LIMIT_WINDOW_MS - now) / 1000));
    return {
      allowed: false,
      retryAfterSeconds,
    };
  }

  validTimestamps.push(now);
  rateLimitMap.set(clientIp, validTimestamps);

  // Periodic memory cleanup to prevent memory leaks in long-running isolates
  if (rateLimitMap.size > 500) {
    for (const [ip, list] of rateLimitMap.entries()) {
      if (list.every((ts) => now - ts >= RATE_LIMIT_WINDOW_MS)) {
        rateLimitMap.delete(ip);
      }
    }
  }

  return { allowed: true };
}

/**
 * Conservative token count estimation based on character length
 * (Assumes ~3 characters per token for mixed Vietnamese, English, and Code)
 * @param {string} text
 * @returns {number}
 */
function estimateTokenCount(text) {
  if (!text || typeof text !== "string") return 0;
  return Math.ceil(text.length / 3);
}

/**
 * Estimates total tokens for system instructions and content turns
 * @param {Array<object>} contents
 * @param {string} systemInstruction
 * @returns {number}
 */
function estimateTotalTokens(contents, systemInstruction = "") {
  let totalChars = systemInstruction.length;
  for (const turn of contents) {
    if (Array.isArray(turn.parts)) {
      for (const part of turn.parts) {
        if (part.text) totalChars += part.text.length;
        if (part.functionCall) totalChars += JSON.stringify(part.functionCall).length;
        if (part.functionResponse) totalChars += JSON.stringify(part.functionResponse).length;
      }
    }
  }
  return Math.ceil(totalChars / 3);
}

/**
 * Sanitizes repository document path to prevent directory traversal
 * @param {string} rawPath
 * @returns {string | null}
 */
function sanitizeDocPath(rawPath) {
  if (!rawPath || typeof rawPath !== "string") return null;
  const normalized = rawPath.trim().replace(/^(\.\/|\/)+/, "");

  // Block path traversal and protocols
  if (
    normalized.includes("..") ||
    normalized.includes("://") ||
    normalized.includes("\\") ||
    normalized.startsWith("/")
  ) {
    return null;
  }

  // Restrict to safe documentation formats
  if (
    !normalized.endsWith(".md") &&
    !normalized.endsWith(".txt") &&
    !normalized.endsWith(".json")
  ) {
    return null;
  }

  return normalized;
}

// Map common aliases or fuzzy paths to actual documentation files
const DOC_ALIASES = {
  "docs/projects/doc-forge-design.md": "docs/projects/doc-forge-design.md",
  "docs/projects/doc-forge-readme.md": "docs/projects/doc-forge-readme.md",
  "docs/projects/booking-hotels-readme.md": "docs/projects/booking-hotels-readme.md",
  "docs/projects/moviepj-readme.md": "docs/projects/moviepj-readme.md",
  "docs/projects/lung-dx-readme.md": "docs/projects/lung-dx-readme.md"
};

/**
 * Fetches technical documentation dynamically from GitHub Raw URL with caching & safeguards
 * Falls back to bundled local docs if remote returns 404 (essential for local dev before git push)
 * @param {string} docPath
 * @param {Record<string, string>} env
 * @returns {Promise<string>}
 */
async function fetchRepositoryDocument(docPath, env) {
  const cleanPath = sanitizeDocPath(docPath);
  if (!cleanPath) {
    return `Error: Invalid or restricted file path '${docPath}'. Only relative markdown documents (.md) within the repository are permitted.`;
  }

  const resolvedPath = DOC_ALIASES[cleanPath] || cleanPath;

  const now = Date.now();
  const cached = docCache.get(resolvedPath);
  if (cached && now - cached.timestamp < DOC_CACHE_TTL_MS) {
    return cached.content;
  }

  const baseUrl = env.GITHUB_DOCS_BASE_URL || DEFAULT_DOCS_BASE_URL;
  const targetUrl = `${baseUrl}/${resolvedPath}`;

  try {
    const response = await fetch(targetUrl, {
      headers: {
        "User-Agent": "Cloudflare-Worker-Portfolio-AI",
        "Accept": "text/plain, text/markdown, */*",
      },
      cf: {
        cacheTtl: 600,
        cacheEverything: true,
      },
      signal: AbortSignal.timeout(6000), // 6s timeout
    });

    if (response.ok) {
      let content = await response.text();

      // Guard: Truncate single doc if it exceeds 30,000 characters (~7.5k tokens) to prevent 503 overload
      const MAX_DOC_CHARS = 30000;
      if (content.length > MAX_DOC_CHARS) {
        content =
          content.slice(0, MAX_DOC_CHARS) +
          "\n\n[Note: Document truncated to maintain safety token ceiling]";
      }

      docCache.set(resolvedPath, { content, timestamp: now });
      return content;
    }
  } catch (err) {
    console.warn(`Failed to fetch document '${resolvedPath}' from GitHub Raw:`, err);
  }

  // Local fallback from bundled docs (ensures zero downtime in local dev and offline tests)
  if (localDocsBundle && (localDocsBundle[resolvedPath] || localDocsBundle[cleanPath])) {
    let content = localDocsBundle[resolvedPath] || localDocsBundle[cleanPath];
    const MAX_DOC_CHARS = 30000;
    if (content.length > MAX_DOC_CHARS) {
      content =
        content.slice(0, MAX_DOC_CHARS) +
        "\n\n[Note: Document truncated to maintain safety token ceiling]";
    }
    docCache.set(resolvedPath, { content, timestamp: now });
    return content;
  }

  return `Notice: Document '${resolvedPath}' is currently unavailable. Please answer based on the portfolio data overview.`;
}

/**
 * Fetches latest portfolio data dynamically from GitHub Raw URL with caching & local fallback
 * @param {Record<string, string>} env
 * @returns {Promise<object>}
 */
async function getLatestPortfolioData(env) {
  const now = Date.now();
  const dataUrl = env.PORTFOLIO_DATA_URL || DEFAULT_DATA_URL;

  // 1. Return in-memory cached data if still fresh
  if (cachedPortfolioData && now - lastCacheTimestamp < CACHE_TTL_MS) {
    return cachedPortfolioData;
  }

  // 2. Fetch live data from GitHub Raw URL
  try {
    const response = await fetch(dataUrl, {
      headers: {
        "User-Agent": "Cloudflare-Worker-Portfolio-AI",
        "Accept": "application/json",
      },
      cf: {
        cacheTtl: 300,
        cacheEverything: true,
      },
      signal: AbortSignal.timeout(4000), // 4s timeout
    });

    if (response.ok) {
      const freshData = await response.json();
      if (freshData && typeof freshData === "object") {
        cachedPortfolioData = freshData;
        lastCacheTimestamp = now;
        return cachedPortfolioData;
      }
    }
  } catch (err) {
    console.warn("Failed to fetch fresh data from GitHub Raw, falling back to local/cached data:", err);
  }

  // 3. Fallback to existing cache or bundled local data
  return cachedPortfolioData || localPortfolioData;
}

/**
 * Builds system prompt emphasizing backend technical decisions, architecture, and strict grounding
 * @param {object} data
 * @returns {string}
 */
function buildSystemInstruction(data) {
  const effectiveData = data || localPortfolioData;
  const portfolioContext = JSON.stringify(effectiveData, null, 2);
  const email = effectiveData?.contact?.email || "vzz95559@gmail.com";
  const github = effectiveData?.contact?.github || "https://github.com/vztong";

  return `You are the AI Assistant representing Tong Nha Vy's Portfolio (Software Engineer).

[ROLE & PERSONA]
- You represent Vy, a Software Engineer / Fullstack Developer with strong core expertise in Backend engineering (C#, .NET, ASP.NET Core, Python, Microservices, Clean Architecture, High Concurrency) alongside modern Frontend engineering (Vue.js).
- Your tone is professional, technical, clear, and engineering-oriented, tailored for conversations with Tech Leads, Engineering Managers, and Technical Recruiters.

[AVAILABLE TECHNICAL REPOSITORY DOCUMENTS & TOOL USE]
You have access to a tool named 'fetchRepositoryDocument' that can read full technical documentation files from the repository.
Available documents in repository:
- docs/projects/doc-forge-design.md: Design Specification for DocForge Project, including architecture, database schema, and engineering trade-offs.
- docs/projects/doc-forge-readme.md: README for DocForge Project, detailing features, architecture, and usage.
- docs/projects/booking-hotels-readme.md: README for Booking Hotels Project, including architecture and database design.
- docs/projects/moviepj-readme.md: README for MoviePJ Project, including architecture and database design.
- Portfolio_Architecture_Spec.md: Master Architecture Specification for this Portfolio, Edge AI Assistant, and CI/CD.

RULE FOR TOOL USE:
- When a user asks deep architectural questions, payment processing, database schemas, trade-offs, or detailed system designs, INVOKE the 'fetchRepositoryDocument' tool with the matching docPath from the list above.
- For general questions (skills overview, contact, summary), do NOT invoke the tool; answer immediately from [PORTFOLIO DATA].

[CORE EMPHASIS - TECHNICAL DECISIONS & ARCHITECTURE]
When answering questions regarding Vy's projects, experience, or skills, proactively prioritize and highlight:
1. Architecture & Design Patterns:
   - Identify architectural styles (e.g., Clean Architecture, Modular Monolith, Microservices, CQRS, Repository Pattern, Layered Architecture).
   - Explain why specific patterns were selected and how components interact.
2. Database, Indexing & Caching Strategies:
   - Detail database choices (e.g., SQL Server, MongoDB, Oracle, PostgreSQL).
   - Explain caching mechanisms (e.g., Redis Cache-Aside, TTL strategies, session stores, sliding expiration).
   - Highlight query optimization, indexing, or view-based reporting where mentioned.
3. Engineering Challenges, Trade-offs & Solutions:
   - Detail how challenging technical problems were resolved (e.g., rate limiting, refresh token rotation, race conditions, concurrency handling, event-driven sync).
   - Emphasize engineering trade-offs mentioned in the project specs.
4. Security & Performance:
   - Highlight authentication & authorization mechanisms (e.g., JWT rotation, RBAC, Claims, Guard/Middleware security).
   - Emphasize response time reductions, high test coverage (e.g., xUnit), and scalability considerations.

[STRICT GROUNDING & ANTI-HALLUCINATION RULES]
1. Answer ONLY using facts directly documented in the [PORTFOLIO DATA] or retrieved via 'fetchRepositoryDocument'.
2. NEVER invent, extrapolate, or fabricate unlisted metrics, libraries, or architectural components.
3. If asked about information not in the data (e.g., private phone number, unlisted technologies, unrelated personal info), politely state that this information is not covered in the Portfolio and direct them to contact Thuan directly via Email (${email}) or GitHub (${github}).
4. Language & Presentation:
   - ALWAYS respond in the SAME language as the user's inquiry (respond in Vietnamese if the user asks in Vietnamese; respond in English if the user asks in English).
   - Use clean Markdown formatting: bullet points, bold key technical terms, and concise paragraphs for readability.

[PORTFOLIO DATA]:
${portfolioContext}`;
}

// Tool definitions for Gemini Function Calling
const GEMINI_TOOLS = [
  {
    functionDeclarations: [
      {
        name: "fetchRepositoryDocument",
        description:
          "Fetches comprehensive technical documentation, architecture specifications, or project deep-dive markdown files from the portfolio repository.",
        parameters: {
          type: "object",
          properties: {
            docPath: {
              type: "string",
              description:
                "Relative file path of the technical document in the repository (e.g., 'docs/projects/shorter-link.md', 'docs/projects/quickbite.md', 'Portfolio_Architecture_Spec.md').",
            },
          },
          required: ["docPath"],
        },
      },
    ],
  },
];

/**
 * Helper to build CORS headers based on request origin
 * Supports GitHub Pages, Cloudflare Pages (*.pages.dev), and local development
 * @param {string | null} requestOrigin
 * @returns {Record<string, string>}
 */
function getCorsHeaders(requestOrigin) {
  let isPagesDev = false;
  if (requestOrigin) {
    try {
      const hostname = new URL(requestOrigin).hostname;
      isPagesDev = hostname.endsWith(".pages.dev");
    } catch {
      isPagesDev = false;
    }
  }

  const isAllowed =
    requestOrigin &&
    (ALLOWED_ORIGINS.includes(requestOrigin) ||
      isPagesDev ||
      requestOrigin.startsWith("http://localhost:") ||
      requestOrigin.startsWith("http://127.0.0.1:"));
  const allowOriginHeader = isAllowed ? requestOrigin : ALLOWED_ORIGINS[0];

  return {
    "Access-Control-Allow-Origin": allowOriginHeader,
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Max-Age": "86400",
  };
}

/**
 * Lightweight User-Agent parser for device, browser, and OS
 * @param {string | null} ua
 * @returns {{ device: string, browser: string, os: string }}
 */
function parseUserAgent(ua) {
  if (!ua) return { device: "unknown", browser: "unknown", os: "unknown" };

  // Device
  let device = "desktop";
  if (/mobile|android|iphone|ipod|blackberry|iemobile|opera mini/i.test(ua)) {
    device = "mobile";
  } else if (/ipad|tablet|(android(?!.*mobile))/i.test(ua)) {
    device = "tablet";
  }

  // OS
  let os = "Other";
  if (/windows/i.test(ua)) os = "Windows";
  else if (/macintosh|mac os x/i.test(ua)) os = "macOS";
  else if (/iphone|ipad|ipod/i.test(ua)) os = "iOS";
  else if (/android/i.test(ua)) os = "Android";
  else if (/linux/i.test(ua)) os = "Linux";

  // Browser
  let browser = "Other";
  if (/edg/i.test(ua)) browser = "Edge";
  else if (/chrome|crios/i.test(ua) && !/opr|opera/i.test(ua)) browser = "Chrome";
  else if (/safari/i.test(ua) && !/chrome|crios/i.test(ua)) browser = "Safari";
  else if (/firefox|fxios/i.test(ua)) browser = "Firefox";
  else if (/opr|opera/i.test(ua)) browser = "Opera";

  return { device, browser, os };
}

/**
 * Detects whether the tracking request originates from an automated bot, crawler, or cloud datacenter.
 * @param {string} userAgent
 * @param {string} asnOrg
 * @param {object} cf
 * @returns {boolean}
 */
function isEdgeBot(userAgent, asnOrg, cf = {}) {
  const ua = (userAgent || "").toLowerCase();

  // 1. Crawler / Bot signature tokens in User-Agent
  const botKeywords = [
    "bot", "spider", "crawl", "slurp", "headless", "phantom",
    "bingpreview", "facebookexternalhit", "whatsapp", "telegrambot",
    "twitterbot", "linkedinbot", "discordbot", "curl", "wget", "python",
    "postman", "go-http-client", "apache-httpclient", "java/", "node-fetch",
    "axios", "lighthouse", "google-inspectiontool", "bytespider", "petalbot",
    "semrush", "ahrefs", "screaming frog", "dotbot"
  ];
  if (botKeywords.some((kw) => ua.includes(kw))) {
    return true;
  }

  // 2. Known Datacenter / Cloud Hosting ASNs (Real visitors browse from residential or mobile ISPs)
  const org = (asnOrg || "").toLowerCase();
  const datacenterKeywords = [
    "microsoft", "amazon", "google llc", "digitalocean", "hetzner",
    "ovh", "linode", "oracle", "alibaba", "tencent", "vultr",
    "leaseweb", "choopa", "m247", "fastly", "cloudflare"
  ];
  if (datacenterKeywords.some((dc) => org.includes(dc))) {
    return true;
  }

  // 3. Cloudflare verified bot or low bot score (if enabled on zone)
  if (
    cf?.botManagement?.verifiedBot ||
    (typeof cf?.botManagement?.score === "number" && cf.botManagement.score < 30)
  ) {
    return true;
  }

  return false;
}

/**
 * Handles visitor tracking endpoint (POST /api/track)
 * Persists rich edge analytics into Cloudflare D1 (portfolio_access_history)
 * @param {Request} request
 * @param {Record<string, any>} env
 * @param {Record<string, string>} corsHeaders
 * @returns {Promise<Response>}
 */
async function handleTrack(request, env, corsHeaders) {
  if (request.method !== "POST") {
    return createJsonResponse({ error: "Method Not Allowed. Use POST." }, 405, corsHeaders);
  }

  try {
    let payload = {};
    try {
      payload = await request.json();
    } catch {
      // payload may be empty or plain text in sendBeacon
    }

    const ip =
      request.headers.get("CF-Connecting-IP") ||
      request.headers.get("x-real-ip") ||
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      "Unknown";

    const cf = request.cf || {};
    const country = cf.country || request.headers.get("cf-ipcountry") || "Unknown";
    const city = cf.city || "Unknown";
    const region = cf.region || cf.regionCode || "Unknown";
    const asnOrg = cf.asOrganization || "Unknown";

    const userAgent = request.headers.get("User-Agent") || "";
    const { device, browser, os } = parseUserAgent(userAgent);

    // Relaxed Logging: Tag bot visits as 'bot' without dropping any traffic
    const isBot = isEdgeBot(userAgent, asnOrg, cf) || payload.is_bot;
    const recordedDevice = isBot ? "bot" : device;

    const path = payload.path || "/";
    const referrer = payload.referrer || request.headers.get("Referer") || "Direct";
    const screenRes = payload.screen || "Unknown";
    const language = payload.lang || request.headers.get("Accept-Language")?.split(",")[0]?.trim() || "Unknown";

    // Insert record into Cloudflare D1 table portfolio_access_history
    if (env.DB) {
      await env.DB.prepare(`
        INSERT INTO portfolio_access_history (
          ip, country, city, region, asn_org, user_agent,
          device_type, browser, os, path, referrer, screen_resolution, language
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        ip, country, city, region, asnOrg, userAgent,
        recordedDevice, browser, os, path, referrer, screenRes, language
      ).run();
    } else {
      console.warn("D1 Database binding 'DB' not detected in environment.");
    }

    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  } catch (err) {
    console.error("Failed to record access log in D1:", err);
    return createJsonResponse({ error: "Failed to record log" }, 500, corsHeaders);
  }
}

/**
 * Handles protected log retrieval endpoint (GET /api/logs)
 * @param {Request} request
 * @param {Record<string, any>} env
 * @param {Record<string, string>} corsHeaders
 * @returns {Promise<Response>}
 */
async function handleLogs(request, env, corsHeaders) {
  if (request.method !== "GET") {
    return createJsonResponse({ error: "Method Not Allowed. Use GET." }, 405, corsHeaders);
  }

  const url = new URL(request.url);
  const authHeader = request.headers.get("Authorization");
  const providedKey =
    url.searchParams.get("key") ||
    (authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null);

  // Validate admin key strictly from Cloudflare Worker Secret / env
  const adminSecret = env.LOGS_ADMIN_SECRET;
  if (!adminSecret || !providedKey || providedKey !== adminSecret) {
    return createJsonResponse({ error: "Unauthorized. Valid admin key required." }, 401, corsHeaders);
  }

  if (!env.DB) {
    return createJsonResponse({ error: "D1 Database is not bound." }, 500, corsHeaders);
  }

  try {
    const limit = Math.min(parseInt(url.searchParams.get("limit") || "50", 10), 200);

    // Fetch latest entries
    const latestLogsQuery = await env.DB.prepare(`
      SELECT id, ip, country, city, region, asn_org, device_type, browser, os, path, referrer, screen_resolution, language, created_at
      FROM portfolio_access_history
      ORDER BY id DESC
      LIMIT ?
    `).bind(limit).all();

    // Fetch summary statistics
    const statsTotal = await env.DB.prepare(`
      SELECT
        COUNT(*) as total_visits,
        COUNT(DISTINCT ip) as unique_ips
      FROM portfolio_access_history
    `).first();

    const topCountries = await env.DB.prepare(`
      SELECT country, COUNT(*) as count
      FROM portfolio_access_history
      GROUP BY country
      ORDER BY count DESC
      LIMIT 5
    `).all();

    const topDevices = await env.DB.prepare(`
      SELECT device_type, COUNT(*) as count
      FROM portfolio_access_history
      GROUP BY device_type
      ORDER BY count DESC
    `).all();

    return createJsonResponse({
      success: true,
      stats: {
        total_visits: statsTotal?.total_visits || 0,
        unique_ips: statsTotal?.unique_ips || 0,
        top_countries: topCountries?.results || [],
        top_devices: topDevices?.results || [],
      },
      count: latestLogsQuery?.results?.length || 0,
      logs: latestLogsQuery?.results || [],
    }, 200, corsHeaders);
  } catch (err) {
    console.error("Failed to query access logs from D1:", err);
    return createJsonResponse({ error: "Failed to query database." }, 500, corsHeaders);
  }
}

/**
 * Standard JSON response helper
 * @param {object} body
 * @param {number} status
 * @param {Record<string, string>} corsHeaders
 * @param {Record<string, string>} extraHeaders
 * @returns {Response}
 */
function createJsonResponse(body, status, corsHeaders, extraHeaders = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      ...corsHeaders,
      ...extraHeaders,
    },
  });
}

export default {
  /**
   * Main fetch handler for Cloudflare Worker
   * @param {Request} request
   * @param {Record<string, any>} env
   * @param {ExecutionContext} ctx
   * @returns {Promise<Response>}
   */
  async fetch(request, env, ctx) {
    const origin = request.headers.get("Origin");
    const corsHeaders = getCorsHeaders(origin);
    const url = new URL(request.url);

    // 1. Handle CORS Preflight (OPTIONS) request
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: corsHeaders,
      });
    }

    // 2. Routing: Visitor Tracking (POST /api/track)
    if (url.pathname === "/api/track") {
      return handleTrack(request, env, corsHeaders);
    }

    // 3. Routing: Protected Log Inspection (GET /api/logs)
    if (url.pathname === "/api/logs") {
      return handleLogs(request, env, corsHeaders);
    }

    // 4. Validate endpoint and HTTP method for Chat
    if (url.pathname !== "/api/chat" && url.pathname !== "/") {
      return createJsonResponse(
        { error: "Not Found. Available endpoints: POST /api/chat, POST /api/track, GET /api/logs" },
        404,
        corsHeaders
      );
    }

    if (request.method !== "POST") {
      return createJsonResponse(
        { error: "Method Not Allowed. Please use POST." },
        405,
        corsHeaders
      );
    }

    // 3. Sliding Window Rate Limiting (Max 10 requests / minute per client IP)
    const clientIp =
      request.headers.get("CF-Connecting-IP") ||
      request.headers.get("x-real-ip") ||
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      "127.0.0.1";

    const maxRequestsPerMin = parseInt(env.MAX_REQUESTS_PER_MINUTE, 10) || 10;
    const rateLimitCheck = checkRateLimit(clientIp, maxRequestsPerMin);

    if (!rateLimitCheck.allowed) {
      return createJsonResponse(
        {
          error: "Rate limit exceeded (Max 10 requests per minute).",
          reply:
            "Bạn đã gửi quá nhiều yêu cầu (tối đa 10 yêu cầu/phút). Vui lòng đợi vài giây trước khi tiếp tục trò chuyện nhé!",
        },
        429,
        corsHeaders,
        { "Retry-After": String(rateLimitCheck.retryAfterSeconds || 60) }
      );
    }

    // 4. Check if GEMINI_API_KEY secret is configured
    if (!env.GEMINI_API_KEY) {
      return createJsonResponse(
        { error: "GEMINI_API_KEY is not configured in Worker environment." },
        500,
        corsHeaders
      );
    }

    try {
      // 5. Parse and validate JSON request body
      let payload;
      try {
        payload = await request.json();
      } catch (err) {
        return createJsonResponse(
          { error: "Invalid JSON in request body." },
          400,
          corsHeaders
        );
      }

      const userMessage = payload?.message?.trim();
      if (!userMessage) {
        return createJsonResponse(
          { error: "Field 'message' is required and cannot be empty." },
          400,
          corsHeaders
        );
      }

      // Guard: Limit user message length to prevent spam (max 4,000 characters)
      if (userMessage.length > 4000) {
        return createJsonResponse(
          { error: "Message too long. Please limit your query to under 4,000 characters." },
          400,
          corsHeaders
        );
      }

      // 6. Fetch fresh portfolio data dynamically from GitHub Raw (with cache & local fallback)
      const latestData = await getLatestPortfolioData(env);
      const systemInstruction = buildSystemInstruction(latestData);

      // 7. Check 200k Token Ceiling Guard
      const maxAllowedTokens = parseInt(env.MAX_TOKENS_PER_REQUEST, 10) || 200000;
      const initialContents = [
        {
          role: "user",
          parts: [{ text: userMessage }],
        },
      ];

      const initialEstimatedTokens = estimateTotalTokens(initialContents, systemInstruction);
      if (initialEstimatedTokens > maxAllowedTokens) {
        return createJsonResponse(
          { error: "Context size exceeded maximum safety limit of 200,000 tokens." },
          400,
          corsHeaders
        );
      }

      // 8. Build Turn 1 payload for Google Gemini REST API with Function Calling
      const model = env.GEMINI_MODEL || "gemini-3.1-flash-lite";
      const geminiEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${env.GEMINI_API_KEY}`;

      const geminiRequestBody = {
        system_instruction: {
          parts: [{ text: systemInstruction }],
        },
        contents: initialContents,
        tools: GEMINI_TOOLS,
        toolConfig: {
          functionCallingConfig: {
            mode: "AUTO",
          },
        },
        generationConfig: {
          temperature: 0.3,
          topP: 0.8,
          maxOutputTokens: 2048,
        },
      };

      // 9. Send Turn 1 request to Gemini API (20-second timeout with 503 retry)
      let geminiResponse;
      try {
        geminiResponse = await fetch(geminiEndpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(geminiRequestBody),
          signal: AbortSignal.timeout(20000),
        });

        // Auto retry once if temporary 503 high demand occurs
        if (geminiResponse.status === 503) {
          console.warn("Gemini 503 on Turn 1, retrying after 1s...");
          await new Promise((resolve) => setTimeout(resolve, 1000));
          geminiResponse = await fetch(geminiEndpoint, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(geminiRequestBody),
            signal: AbortSignal.timeout(20000),
          });
        }
      } catch (fetchErr) {
        console.error("Fetch Gemini API failed or timed out:", fetchErr);
        const isTimeout = fetchErr.name === "TimeoutError" || fetchErr.name === "AbortError";
        return createJsonResponse(
          {
            error: isTimeout ? "Request to AI service timed out." : "Network error connecting to AI service.",
            reply: isTimeout
              ? "Hệ thống AI phản hồi quá lâu (Timeout). Vui lòng thử lại sau giây lát."
              : "Không thể kết nối đến máy chủ AI. Vui lòng kiểm tra lại đường truyền.",
          },
          isTimeout ? 504 : 502,
          corsHeaders
        );
      }

      // 10. Handle non-200 HTTP responses from Gemini API
      if (!geminiResponse.ok) {
        let errorData = null;
        let errorMessage = "Unknown error from Gemini API";
        try {
          errorData = await geminiResponse.json();
          errorMessage = errorData?.error?.message || errorMessage;
        } catch {
          errorMessage = await geminiResponse.text().catch(() => "Unknown error");
        }

        console.error(`Gemini API Error [Status ${geminiResponse.status}]:`, errorMessage);

        if (geminiResponse.status === 429) {
          return createJsonResponse(
            {
              error: "Rate limit exceeded.",
              reply: "Hệ thống AI đang nhận được quá nhiều yêu cầu cùng lúc. Vui lòng chờ vài giây rồi thử lại nhé!",
            },
            429,
            corsHeaders
          );
        }

        if (geminiResponse.status === 503) {
          return createJsonResponse(
            {
              reply: "Máy chủ AI của Google đang chịu tải cao tạm thời. Vui lòng gửi lại câu hỏi sau vài giây nhé!",
            },
            200,
            corsHeaders
          );
        }

        return createJsonResponse(
          {
            error: errorMessage,
            reply: "Đã xảy ra lỗi khi trao đổi với AI. Vui lòng thử lại sau.",
          },
          geminiResponse.status,
          corsHeaders
        );
      }

      // 11. Parse response & check for functionCall
      const geminiData = await geminiResponse.json();
      const candidate = geminiData?.candidates?.[0];

      if (geminiData?.promptFeedback?.blockReason) {
        return createJsonResponse(
          {
            error: `Prompt blocked: ${geminiData.promptFeedback.blockReason}`,
            reply: "Câu hỏi bị từ chối do chính sách an toàn nội dung. Vui lòng đặt câu hỏi khác liên quan đến kỹ năng và dự án của Vy.",
          },
          400,
          corsHeaders
        );
      }

      // Check if model returned a functionCall
      const functionCallPart = candidate?.content?.parts?.find((p) => p.functionCall);

      if (functionCallPart && functionCallPart.functionCall) {
        const { name, args, id: callId } = functionCallPart.functionCall;
        console.log(`Gemini invoked tool '${name}' with args:`, args);

        if (name === "fetchRepositoryDocument") {
          const docPath = args?.docPath;
          const docContent = await fetchRepositoryDocument(docPath, env);

          // Build Turn 2 contents with functionResponse preserving model content and thought_signature
          const followUpContents = [
            ...initialContents,
            candidate.content, // includes functionCall and thoughtSignature parts
            {
              role: "user",
              parts: [
                {
                  functionResponse: {
                    name,
                    response: {
                      content: docContent,
                    },
                    ...(callId ? { id: callId } : {}),
                  },
                },
              ],
            },
          ];

          // Re-verify 200k Token Ceiling before Turn 2
          const followUpEstimatedTokens = estimateTotalTokens(followUpContents, systemInstruction);
          if (followUpEstimatedTokens > maxAllowedTokens) {
            console.warn(`Follow-up context exceeded ${maxAllowedTokens} tokens, truncating document content...`);
            followUpContents[2].parts[0].functionResponse.response.content =
              docContent.slice(0, 30000) + "\n\n[Truncated to guarantee safety token ceiling]";
          }

          // In Gemini API, Turn 2 request MUST retain tools and toolConfig declarations
          const followUpRequestBody = {
            system_instruction: geminiRequestBody.system_instruction,
            contents: followUpContents,
            tools: GEMINI_TOOLS,
            toolConfig: geminiRequestBody.toolConfig,
            generationConfig: geminiRequestBody.generationConfig,
          };

          // Send Turn 2 request to Gemini API (25-second timeout with 503 retry)
          try {
            let secondResponse = await fetch(geminiEndpoint, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(followUpRequestBody),
              signal: AbortSignal.timeout(25000),
            });

            // Auto retry once if 503 high demand occurs on Turn 2
            if (secondResponse.status === 503) {
              console.warn("Gemini 503 on Turn 2, retrying after 1s...");
              await new Promise((resolve) => setTimeout(resolve, 1000));
              secondResponse = await fetch(geminiEndpoint, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(followUpRequestBody),
                signal: AbortSignal.timeout(25000),
              });
            }

            if (secondResponse.ok) {
              const secondData = await secondResponse.json();
              const secondCandidate = secondData?.candidates?.[0];
              const finalReplyText =
                secondCandidate?.content?.parts?.find((p) => p.text)?.text?.trim() ||
                "Đã tải tài liệu kỹ thuật thành công nhưng không có câu trả lời phù hợp.";
              return createJsonResponse({ reply: finalReplyText }, 200, corsHeaders);
            } else {
              const secondErrData = await secondResponse.json().catch(() => ({}));
              console.error(`Gemini Turn 2 error [Status ${secondResponse.status}]:`, secondErrData);
              if (secondResponse.status === 503) {
                return createJsonResponse(
                  {
                    reply: "Máy chủ AI của Google đang chịu tải cao tạm thời khi phân tích tài liệu chuyên sâu. Bạn vui lòng thử lại sau vài giây nhé!",
                  },
                  200,
                  corsHeaders
                );
              }
            }
          } catch (followUpErr) {
            console.error("Follow-up Gemini API call failed:", followUpErr);
            const isTimeout = followUpErr.name === "TimeoutError" || followUpErr.name === "AbortError";
            if (isTimeout) {
              return createJsonResponse(
                {
                  reply: "Quá trình đọc tài liệu kỹ thuật và tổng hợp mất nhiều thời gian hơn dự kiến. Bạn vui lòng thử lại nhé!",
                },
                200,
                corsHeaders
              );
            }
          }
        }
      }

      // 12. Standard text response (Turn 1 single response)
      const replyText =
        candidate?.content?.parts?.find((p) => p.text)?.text?.trim() ||
        "Xin lỗi, hiện tại tôi không thể tìm thấy câu trả lời phù hợp trong Portfolio của Vy.";

      return createJsonResponse({ reply: replyText }, 200, corsHeaders);
    } catch (error) {
      console.error("Unhandled Worker Exception:", error);
      return createJsonResponse(
        {
          error: "Internal Server Error.",
          reply: "Đã xảy ra sự cố nội bộ trong hệ thống trợ lý. Vui lòng thử lại sau.",
        },
        500,
        corsHeaders
      );
    }
  },
};
