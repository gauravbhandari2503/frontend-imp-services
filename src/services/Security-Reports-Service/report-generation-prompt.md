# Security Report Generation Prompt

**Role:** Security Engineer & Auditor
**Task:** Conduct a security audit of the provided frontend code based on the Security Checklist.

---

## Instructions

Analyze the provided code/project structure against the following checklist items. For each item, determine if the project **PASSES**, **FAILS**, or requires a **WARNING** (if manual verification is needed).

### Input

[Paste Codebase or File Content Here]

### Checklist to Verify

1.  **Secrets**: Are secrets exposed in code or `.env` files? (Look for `const SECRET = ...` or non-public `VITE_` vars).
2.  **API/Network**: Is HTTPS used? Are sensitive 3rd party APIs called directly?
3.  **Auth**: How are tokens stored? (Look for `localStorage.setItem('token')` -> FAIL).
4.  **DOM Safety**: Is `v-html` or `innerHTML` used without sanitization?
5.  **Console**: Are there left-over `console.log` statements?
6.  **Dependencies**: (If `package.json` provided) Are there obvious insecure versions or excessive dependencies?

_(Refer to `security-checklist.md` for the full detailed list)_

### Output Format

Please generate a report in the following valid Markdown format:

# Security Audit Report

## Executive Summary

[Brief summary of the security posture]

## Detailed Findings

| Category | Item                 | Status  | Observation                          | Recommendation            |
| :------- | :------------------- | :------ | :----------------------------------- | :------------------------ |
| Secrets  | No Hardcoded Secrets | ✅ PASS | No secrets found in source.          | N/A                       |
| Auth     | Secure Token Storage | ❌ FAIL | `localStorage` used for tokens.      | Move to HttpOnly cookies. |
| DOM      | Sanitize HTML        | ⚠️ WARN | `v-html` detected in `Component.vue` | Verify `DOMPurify` usage. |

## Remediation Plan

1. [High Priority] ...
2. [Medium Priority] ...

---

**Note:** This audit is automated and may produce false positives. Manual verification is required for all WARNINGS.
