import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Input validation utilities
export function validateInput(input: unknown, schema: any): boolean {
  try {
    schema.parse(input);
    return true;
  } catch {
    return false;
  }
}

// Sanitize user input to prevent XSS
export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '') // Remove < and >
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim()
    .slice(0, 1000); // Limit length
}

// Generate CSRF token
export function generateCSRFToken(): string {
  return Buffer.from(crypto.randomUUID()).toString('base64');
}

// Validate CSRF token
export function validateCSRFToken(token: string, storedToken: string): boolean {
  return token === storedToken;
}

// SQL injection prevention (for raw queries - Drizzle handles this)
export function escapeSQLInput(input: string): string {
  return input.replace(/['";\\]/g, '\\$&');
}

// Validate file uploads
export function validateFileUpload(file: File, options: {
  maxSize?: number;
  allowedTypes?: string[];
}): { valid: boolean; error?: string } {
  const maxSize = options.maxSize || 5 * 1024 * 1024; // 5MB default
  const allowedTypes = options.allowedTypes || ['audio/webm', 'audio/wav', 'audio/mp3'];
  
  if (file.size > maxSize) {
    return { valid: false, error: `File too large. Max size: ${maxSize / 1024 / 1024}MB` };
  }
  
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: `Invalid file type. Allowed: ${allowedTypes.join(', ')}` };
  }
  
  return { valid: true };
}

// Secure random string generation
export function generateSecureToken(length: number = 32): string {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Buffer.from(array).toString('base64url').slice(0, length);
}

// Password hashing (for future use if needed)
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Buffer.from(hash).toString('hex');
}

// Verify password hash
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const passwordHash = await hashPassword(password);
  return passwordHash === hash;
}

// Check for common attack patterns
export function detectAttackPatterns(input: string): boolean {
  const patterns = [
    /<script/i,
    /javascript:/i,
    /on\w+=/i,
    /eval\(/i,
    /expression\(/i,
    /<iframe/i,
    /document\./i,
    /window\./i,
  ];
  
  return patterns.some(pattern => pattern.test(input));
}

// Validate email format
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
}

// Validate PIN format
export function isValidPIN(pin: string): boolean {
  return /^\d{4,6}$/.test(pin);
}

// Validate username (no special characters, reasonable length)
export function isValidUsername(username: string): boolean {
  return /^[a-zA-Z0-9_-]{3,20}$/.test(username);
}

// Rate limit check helper
export class RateLimiter {
  private store: Map<string, { count: number; resetTime: number }>;
  private maxRequests: number;
  private windowMs: number;
  
  constructor(maxRequests: number = 10, windowMs: number = 60000) {
    this.store = new Map();
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }
  
  check(identifier: string): boolean {
    const now = Date.now();
    const record = this.store.get(identifier);
    
    if (!record || now > record.resetTime) {
      this.store.set(identifier, {
        count: 1,
        resetTime: now + this.windowMs,
      });
      return true;
    }
    
    if (record.count >= this.maxRequests) {
      return false;
    }
    
    record.count++;
    return true;
  }
  
  reset(identifier: string): void {
    this.store.delete(identifier);
  }
}

// Secure response helper
export function secureJSONResponse(data: any, status: number = 200): NextResponse {
  return NextResponse.json(data, {
    status,
    headers: {
      'Content-Type': 'application/json',
      'X-Content-Type-Options': 'nosniff',
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    },
  });
}

// Error response helper (don't leak sensitive info)
export function secureErrorResponse(message: string, status: number = 500): NextResponse {
  const safeMessage = process.env.NODE_ENV === 'production' 
    ? 'An error occurred' 
    : message;
    
  return secureJSONResponse({ error: safeMessage }, status);
}
