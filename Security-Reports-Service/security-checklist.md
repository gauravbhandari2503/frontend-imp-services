# Security Checklist

This document outlines the mandatory security best practices for frontend applications. All projects must adhere to these guidelines.

## 1. Secrets & Configuration

- [ ] **No Secrets in Code**: Do not expose secret keys (e.g., Stripe secret keys, private tokens) in the frontend code or environment files.
- [ ] **Public Environment Variables**: Only use public-prefixed environment variables (e.g., `VITE_`, `NEXT_PUBLIC_`) and validate their necessity.
- [ ] **No Hardcoded Credentials**: Never hardcode credentials or tokens in frontend code or config files.
- [ ] **Server-Side Secrets (SSR/SSG)**: In frameworks like Nuxt/Next.js, ensure secrets are used only in the `server` context.

## 2. API & Network Security

- [ ] **Use HTTPS**: Use HTTPS for all API and asset requests.
- [ ] **Proxy 3rd-Party APIs**: Avoid directly calling sensitive 3rd-party APIs from the frontend—proxy them through the backend to keep keys secure.
- [ ] **CORS Configuration**: Follow CORS security best practices; frontend should report misconfigurations (e.g., too permissive backend CORS settings).
- [ ] **Internal Endpoints**: Do not expose internal endpoint URLs or infra config in frontend code.

## 3. Authentication & Session Management

- [ ] **Secure Token Storage**: Store authentication tokens using HttpOnly cookies (recommended) or securely in memory/session storage if necessary.
- [ ] **No Tokens in URL/Storage**: Do not expose JWTs or session tokens in URLs or localStorage.
- [ ] **CSRF Protection**: Use CSRF Tokens to avoid cross-site request forgery attacks.
- [ ] **Zero Trust for Admin**: Use IP allowlists, OTPs, or separate login for admin panels. Log and monitor all actions on admin pages.

## 4. Input Validation & DOM Safety

- [ ] **Sanitize HTML**: Always sanitize dynamic HTML rendering, especially when using directives like `v-html`.
- [ ] **Content Security Policy (CSP)**: Avoid inline JavaScript or inline styles—follow CSP guidelines.
- [ ] **Scoped Styles**: Use scoped styles to prevent style leaks or injection.
- [ ] **Input Validation**: Validate input on the frontend to enhance UX, but _always_ rely on backend for final input validation.

## 5. Dependencies & Third-Party Integrations

- [ ] **Audit Dependencies**: Audit dependencies regularly using `npm audit`, `yarn audit`, or Snyk, and fix known vulnerabilities.
- [ ] **Example SDK Scope**: Validate and review usage of Google Maps, Firebase, or other SDK keys —scope keys to allowed domains via their dashboards.
- [ ] **Subresource Integrity (SRI)**: If loading external scripts (CDNs), use SRI to ensure they haven't been tampered with.
- [ ] **Minimize Packages**: Avoid large or unnecessary client-side packages to reduce attack surface and bundle size.
- [ ] **Update Regularly**: Keep all frontend packages and frameworks up to date.

## 6. Build & Deployment

- [ ] **Pre-commit Hooks**: Use hooks (e.g., `git-secrets`, `lint-staged`) to prevent accidental commits of secrets or unsafe code.
- [ ] **Clean Production Builds**: Remove all `console.log`, `debugger`, or dev-only code before production builds.
- [ ] **Disable Source Maps**: Review source maps (`*.map`) and ensure they are disabled or access-restricted in production.
- [ ] **CI/CD Scanning**: Participate in CI/CD testing pipelines for security scans and ensure builds don’t expose unsafe configurations.
- [ ] **Secure Deployment**: Collaborate with DevOps to confirm frontend assets are deployed securely (e.g., CSP headers, HTTPS, static hosting permissions).

## 7. Advanced Features

- [ ] **Secure File Uploads**: Avoid uploading files directly to storage services (e.g., S3) without pre-signed URLs from backend.
- [ ] **Feature Policy**: Limit what features your app can access (e.g., no camera, geolocation, mic unless needed) using Feature-Policy/Permissions-Policy headers.
- [ ] **OWASP Top 10**: Regularly check and mitigate against OWASP Top 10 for frontend and common JS/DOM-based attacks.
