# Security Checklist

This document outlines the mandatory security best practices for frontend applications. All projects must adhere to these guidelines.

## 1. Secrets & Configuration

- [ ] **No Secrets in Code**: Do not expose secret keys (e.g., Stripe secret keys, private tokens) in the frontend code or environment files.
- [ ] **Public Environment Variables**: Only use public-prefixed environment variables (e.g., `VITE_`, `NEXT_PUBLIC_`) and validate their necessity.
- [ ] **No Hardcoded Credentials**: Never hardcode credentials or tokens in frontend code or config files.
- [ ] **Server-Side Secrets (SSR/SSG)**: In frameworks like Nuxt/Next.js, ensure secrets are used only in the `server` context.

## 2. API & Network Security

- [ ] **Use HTTPS**: Use HTTPS for all API and asset requests (HSTS enabled).
- [ ] **Proxy 3rd-Party APIs**: Avoid directly calling sensitive 3rd-party APIs from the frontend—proxy them through the backend to keep keys secure.
- [ ] **CORS Configuration**: Follow CORS security best practices; frontend should report misconfigurations (e.g., too permissive backend CORS settings).
- [ ] **Internal Endpoints**: Do not expose internal endpoint URLs or infra config in frontend code.
- [ ] **Strict-Transport-Security**: Ensure HSTS headers are respected.

## 3. Authentication & Session Management

- [ ] **Secure Token Storage**: Store authentication tokens using HttpOnly cookies (recommended) or securely in memory/session storage if necessary (avoid localStorage for sensitive tokens).
- [ ] **No Tokens in URL**: Do not expose JWTs or session tokens in URLs.
- [ ] **CSRF Protection**: Use CSRF Tokens (Double Submit Cookie or similar) to avoid cross-site request forgery attacks.
- [ ] **Session Break**: Implement absolute session timeouts and idle timeouts.
- [ ] **MFA Support**: Ensure UI handles Multi-Factor Authentication flows if required.
- [ ] **Zero Trust for Admin**: Use IP allowlists, OTPs, or separate login for admin panels. Log and monitor all actions on admin pages.

## 4. Input Validation & DOM Safety

- [ ] **Sanitize HTML**: Always sanitize dynamic HTML rendering (e.g., `DOMPurify`) when using directives like `v-html` or `dangerouslySetInnerHTML`.
- [ ] **Content Security Policy (CSP)**: Implement strict CSP headers. Avoid `unsafe-inline` and `unsafe-eval`.
- [ ] **Scoped Styles**: Use scoped styles to prevent style leaks or injection.
- [ ] **Input Validation**: Validate input on the frontend to enhance UX, but _always_ rely on backend for final input validation.
- [ ] **XSS Prevention**: Escape all user-generated content before rendering.

## 5. Dependencies & Third-Party Integrations

- [ ] **Audit Dependencies**: Audit dependencies regularly using `npm audit`, `yarn audit`, or Snyk, and fix known vulnerabilities.
- [ ] **Example SDK Scope**: Validate and review usage of Google Maps, Firebase, or other SDK keys —scope keys to allowed domains via their dashboards.
- [ ] **Subresource Integrity (SRI)**: If loading external scripts (CDNs), use SRI to ensure they haven't been tampered with.
- [ ] **Minimize Packages**: Avoid large or unnecessary client-side packages to reduce attack surface and bundle size.
- [ ] **Update Regularly**: Keep all frontend packages and frameworks up to date.

## 6. Build & Deployment

- [ ] **Pre-commit Hooks**: Use hooks (e.g., `git-secrets`, `lint-staged`) to prevent accidental commits of secrets or unsafe code.
- [ ] **Clean Production Builds**: Remove all `console.log`, `debugger`, or dev-only code before production builds.
- [ ] **Disable Source Maps**: Review source maps (`*.map`) and ensure they are disabled or access-restricted in production (prevent code theft/analysis).
- [ ] **CI/CD Scanning**: Participate in CI/CD testing pipelines for security scans (SAST/DAST) and ensure builds don’t expose unsafe configurations.
- [ ] **Secure Deployment**: Collaborate with DevOps to confirm frontend assets are deployed securely (e.g., CSP headers, HTTPS, static hosting permissions).
- [ ] **Cache Poisoning**: Configure cache headers (`Cache-Control`) to prevent cache poisoning attacks.

## 7. Advanced Features & Data Protection

- [ ] **Secure File Uploads**: Avoid uploading files directly to storage services (e.g., S3) without pre-signed URLs from backend. Validate file types/magic numbers.
- [ ] **Feature Policy**: Limit what features your app can access (e.g., no camera, geolocation, mic unless needed) using Feature-Policy/Permissions-Policy headers.
- [ ] **Data Minimization**: Only request and store the data absolutely necessary for the feature.
- [ ] **PII Handling**: Ensure PII is not logged to console or analytics services.

## 8. OWASP Top 10 (Frontend Focus)

- [ ] **A01: Broken Access Control**: Verify UI enforces permissions, but backend MUST validate.
- [ ] **A03: Injection**: Prevent XSS (see Section 4).
- [ ] **A07: Identification and Authentication Failures**: implementing session management (Section 3).
- [ ] **A02: Cryptographic Failures**: Ensure HTTPS and proper storage of sensitive data.
