# 🔒 Security Implementation - SafeSpace Salone

## ✅ Security Features Implemented

### 1. **Content Security Policy (CSP)**
Prevents XSS attacks by controlling which resources can be loaded.

```typescript
Content-Security-Policy:
  - default-src 'self'
  - script-src 'self' 'nonce-{random}' 'strict-dynamic'
  - style-src 'self' 'unsafe-inline'
  - img-src 'self' data: https: blob:
  - connect-src 'self' https://*.clerk.accounts.dev https://*.neon.tech
  - frame-ancestors 'none'
```

### 2. **Rate Limiting**
Prevents abuse and DDoS attacks.

**Limits:**
- General routes: 100 requests per 15 minutes
- API routes: 30 requests per minute
- Per IP address + route combination

**Implementation:** In-memory store (use Redis in production)

### 3. **CORS (Cross-Origin Resource Sharing)**
Controls which domains can access the API.

**Allowed Origins:**
- `http://localhost:3000` (development)
- `https://safespace-salone.vercel.app` (production)

**Headers:**
- `Access-Control-Allow-Origin`
- `Access-Control-Allow-Methods`
- `Access-Control-Allow-Headers`
- `Access-Control-Allow-Credentials`

### 4. **Security Headers**

| Header | Purpose | Value |
|--------|---------|-------|
| `X-Frame-Options` | Prevent clickjacking | `DENY` |
| `X-Content-Type-Options` | Prevent MIME sniffing | `nosniff` |
| `X-XSS-Protection` | Enable XSS filter | `1; mode=block` |
| `Referrer-Policy` | Control referrer info | `strict-origin-when-cross-origin` |
| `Strict-Transport-Security` | Force HTTPS | `max-age=31536000` |
| `Permissions-Policy` | Control browser features | `camera=(self) microphone=(self)` |

### 5. **Input Validation & Sanitization**

**Zod Schemas:**
```typescript
const createUserSchema = z.object({
  username: z.string().min(3).max(20).regex(/^[a-zA-Z0-9_-]+$/),
  avatar: z.number().int().min(1).max(8),
  topics: z.array(z.string()).min(1).max(10),
});
```

**Sanitization:**
- Remove `<>` characters (XSS prevention)
- Remove `javascript:` protocol
- Remove event handlers (`onclick=`, etc.)
- Trim and limit length

### 6. **File Upload Security**

**Audio Files:**
- Max size: 10MB
- Allowed types: WebM, WAV, MP3, OGG
- Magic byte validation (file header check)
- Secure random filenames
- Path traversal prevention

**Validation:**
```typescript
validateFileUpload(file, {
  maxSize: 10 * 1024 * 1024,
  allowedTypes: ['audio/webm', 'audio/wav', 'audio/mp3'],
});
```

### 7. **Authentication & Authorization**

**Clerk Integration:**
- OAuth 2.0 for counselors
- Session management
- Protected routes via middleware

**User Authentication:**
- PIN-based (4-6 digits)
- Stored locally (never sent to server)
- SHA-256 hashing if needed

### 8. **SQL Injection Prevention**

**Drizzle ORM:**
- Parameterized queries (automatic)
- Type-safe database operations
- No raw SQL strings

### 9. **CSRF Protection**

**Token Generation:**
```typescript
const csrfToken = generateCSRFToken(); // Random UUID base64
```

**Validation:**
- Check token on state-changing operations
- Store in session/cookie
- Validate on POST/PUT/DELETE

### 10. **Error Handling**

**Secure Error Responses:**
```typescript
// Development: Show detailed errors
// Production: Generic error messages
secureErrorResponse('An error occurred', 500);
```

**No Information Leakage:**
- Don't expose stack traces
- Don't reveal database structure
- Don't show internal paths

---

## 🛡️ Attack Prevention

### XSS (Cross-Site Scripting)
✅ CSP headers  
✅ Input sanitization  
✅ Output encoding  
✅ `X-XSS-Protection` header  

### CSRF (Cross-Site Request Forgery)
✅ CSRF tokens  
✅ SameSite cookies  
✅ Origin validation  

### SQL Injection
✅ Drizzle ORM (parameterized queries)  
✅ Input validation  
✅ Type safety  

### Clickjacking
✅ `X-Frame-Options: DENY`  
✅ CSP `frame-ancestors 'none'`  

### DDoS / Brute Force
✅ Rate limiting (100 req/15min)  
✅ API rate limiting (30 req/min)  
✅ Per-IP tracking  

### Path Traversal
✅ Filename validation  
✅ No `..` or `/` in filenames  
✅ Secure file storage  

### File Upload Attacks
✅ File type validation  
✅ Magic byte checking  
✅ Size limits (10MB)  
✅ Secure random filenames  

---

## 🔧 Configuration

### Environment Variables

```bash
# Required for production
NODE_ENV=production

# Clerk (Authentication)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...

# Database (Neon)
DATABASE_URL=postgresql://...

# Optional: Custom CORS origins
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

### Update CORS Origins

Edit `proxy.ts`:

```typescript
const ALLOWED_ORIGINS = [
  'http://localhost:3000',
  'https://safespace-salone.vercel.app',
  'https://yourdomain.com', // Add your domain
];
```

---

## 📋 Security Checklist

### Before Deployment

- [ ] Update `ALLOWED_ORIGINS` with production domains
- [ ] Set `NODE_ENV=production`
- [ ] Use HTTPS (Vercel does this automatically)
- [ ] Enable Clerk production keys
- [ ] Set strong `NEXTAUTH_SECRET`
- [ ] Review CSP policy for your CDN/services
- [ ] Test rate limiting
- [ ] Verify file upload limits
- [ ] Check error messages (no leaks)
- [ ] Enable HSTS in production

### Ongoing Maintenance

- [ ] Monitor rate limit logs
- [ ] Review uploaded files periodically
- [ ] Update dependencies (`pnpm update`)
- [ ] Check for security advisories
- [ ] Rotate secrets annually
- [ ] Audit user data access
- [ ] Review Clerk logs

---

## 🚨 Incident Response

### If Security Issue Detected

1. **Immediate Actions:**
   - Disable affected endpoint
   - Revoke compromised tokens
   - Clear rate limit cache

2. **Investigation:**
   - Check server logs
   - Review database for anomalies
   - Identify attack vector

3. **Remediation:**
   - Patch vulnerability
   - Update security rules
   - Notify affected users (if needed)

4. **Prevention:**
   - Add new validation rules
   - Update documentation
   - Improve monitoring

---

## 📊 Security Monitoring

### Logs to Monitor

```typescript
// Rate limit violations
console.warn('Rate limit exceeded:', { ip, route });

// Failed authentication
console.warn('Auth failed:', { route, timestamp });

// Invalid file uploads
console.warn('Invalid file:', { type, size });

// Suspicious patterns
console.warn('Attack detected:', { pattern, input });
```

### Metrics to Track

- Rate limit hits per hour
- Failed authentication attempts
- Invalid file upload attempts
- CSP violations
- Error rates by endpoint

---

## 🔐 Best Practices

### For Developers

1. **Never trust user input** - Always validate and sanitize
2. **Use parameterized queries** - Drizzle handles this
3. **Validate file uploads** - Check type, size, and content
4. **Use HTTPS everywhere** - Especially in production
5. **Keep dependencies updated** - Run `pnpm audit`
6. **Review security headers** - Test with securityheaders.com
7. **Implement logging** - Track security events
8. **Use environment variables** - Never hardcode secrets

### For Production

1. **Enable HSTS** - Force HTTPS
2. **Use Redis for rate limiting** - Better than in-memory
3. **Set up monitoring** - Sentry, LogRocket, etc.
4. **Regular security audits** - Quarterly reviews
5. **Backup database** - Daily automated backups
6. **Implement WAF** - Cloudflare, AWS WAF
7. **Use CDN** - DDoS protection
8. **Enable 2FA** - For admin accounts

---

## 🛠️ Testing Security

### Manual Tests

```bash
# Test rate limiting
for i in {1..150}; do curl http://localhost:3000/api/users; done

# Test CORS
curl -H "Origin: https://evil.com" http://localhost:3000/api/users

# Test file upload
curl -F "audio=@malicious.exe" http://localhost:3000/api/audio

# Test XSS
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"username":"<script>alert(1)</script>"}'
```

### Automated Tools

```bash
# Security audit
pnpm audit

# Check for vulnerabilities
pnpm audit --audit-level=high

# OWASP ZAP scan
zap-cli quick-scan http://localhost:3000
```

---

## 📚 Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Next.js Security](https://nextjs.org/docs/app/building-your-application/configuring/security-headers)
- [Clerk Security](https://clerk.com/docs/security)
- [CSP Evaluator](https://csp-evaluator.withgoogle.com/)
- [Security Headers](https://securityheaders.com/)

---
