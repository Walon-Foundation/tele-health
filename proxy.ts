import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define protected routes
const isProtectedRoute = createRouteMatcher([
  '/counselor/dashboard(.*)',
  '/counselor/chat(.*)',
]);

// Rate limiting store (in-memory for development, use Redis in production)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Rate limiting configuration
const RATE_LIMIT = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 100, // max requests per window
  apiWindowMs: 60 * 1000, // 1 minute for API routes
  apiMaxRequests: 30, // max API requests per minute
};

function rateLimit(identifier: string, isApi: boolean = false): boolean {
  const now = Date.now();
  const limit = isApi ? RATE_LIMIT.apiMaxRequests : RATE_LIMIT.maxRequests;
  const window = isApi ? RATE_LIMIT.apiWindowMs : RATE_LIMIT.windowMs;
  
  const record = rateLimitStore.get(identifier);
  
  if (!record || now > record.resetTime) {
    rateLimitStore.set(identifier, {
      count: 1,
      resetTime: now + window,
    });
    return true;
  }
  
  if (record.count >= limit) {
    return false;
  }
  
  record.count++;
  return true;
}

// Security headers
function getSecurityHeaders() {
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64');
  
  return {
    // Content Security Policy
    'Content-Security-Policy': [
      "default-src 'self'",
      `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' https://challenges.cloudflare.com`,
      `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com`,
      "img-src 'self' data: https: blob:",
      "font-src 'self' https://fonts.gstatic.com",
      "connect-src 'self' https://*.clerk.accounts.dev https://*.neon.tech wss://*.neon.tech",
      "media-src 'self' blob:",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      "upgrade-insecure-requests",
    ].join('; '),
    
    // Prevent clickjacking
    'X-Frame-Options': 'DENY',
    
    // Prevent MIME type sniffing
    'X-Content-Type-Options': 'nosniff',
    
    // Enable XSS protection
    'X-XSS-Protection': '1; mode=block',
    
    // Referrer policy
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    
    // Permissions policy
    'Permissions-Policy': [
      'camera=(self)',
      'microphone=(self)',
      'geolocation=()',
      'interest-cohort=()',
    ].join(', '),
    
    // Strict Transport Security (HSTS)
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
    
    // Remove server header
    'X-Powered-By': '',
  };
}

// CORS configuration
const ALLOWED_ORIGINS = [
  'http://localhost:3000',
  'https://safespace-salone.vercel.app',
  // Add your production domains here
];

function handleCORS(request: NextRequest) {
  const origin = request.headers.get('origin');
  const isAllowedOrigin = origin && ALLOWED_ORIGINS.includes(origin);
  
  const headers = new Headers();
  
  if (isAllowedOrigin) {
    headers.set('Access-Control-Allow-Origin', origin);
    headers.set('Access-Control-Allow-Credentials', 'true');
  }
  
  headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-CSRF-Token');
  headers.set('Access-Control-Max-Age', '86400'); // 24 hours
  
  return headers;
}

export default clerkMiddleware(async (auth, request: NextRequest) => {
  const { pathname } = request.nextUrl;
  const isApiRoute = pathname.startsWith('/api');
  
  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    const corsHeaders = handleCORS(request);
    return new NextResponse(null, { status: 204, headers: corsHeaders });
  }
  
  // Get client identifier for rate limiting
  const clientIp = request.headers.get('x-forwarded-for') || 
                   request.headers.get('x-real-ip') || 
                   'unknown';
  const identifier = `${clientIp}-${pathname}`;
  
  // Apply rate limiting
  if (!rateLimit(identifier, isApiRoute)) {
    return new NextResponse(
      JSON.stringify({ 
        error: 'Too many requests. Please try again later.',
        retryAfter: RATE_LIMIT.windowMs / 1000,
      }),
      { 
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': String(RATE_LIMIT.windowMs / 1000),
        },
      }
    );
  }
  
  // Protect counselor routes
  if (isProtectedRoute(request)) {
    await auth.protect();
  }
  
  // Get response
  const response = NextResponse.next();
  
  // Apply security headers
  const securityHeaders = getSecurityHeaders();
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  
  // Apply CORS headers
  const corsHeaders = handleCORS(request);
  corsHeaders.forEach((value, key) => {
    response.headers.set(key, value);
  });
  
  // Add custom security headers for API routes
  if (isApiRoute) {
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-DNS-Prefetch-Control', 'off');
    response.headers.set('X-Download-Options', 'noopen');
  }
  
  return response;
});

export const config = {
  matcher: [
    // Skip Next.js internals and static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
