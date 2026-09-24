# Compliance download / current-user investigation

## Confirmed from this checkout

- `src/features/auth/services/get-user-core.ts` defines `CurrentUserError` and throws `Current user request timed out`. Its AbortController deadline is **5,000 ms**, unchanged by this fix. This covers fetching headers and reading the body. Previously an abort while reading JSON was incorrectly classified as `invalid-json`; it now reports `timeout`.
- Before this change, `get-user.tsx` was a `"use server"` export invoked by browser `useUser()` queries. A refetch therefore POSTed to the current page (including `/regional-staff/region/1/compliance?tab=reports`) and performed an outbound GET to Django's `/api/v1/auth/users/me/`. The authenticated server layout also reads this user. The reported 5.7-second invocation is consistent with that 5-second deadline, but the deployment's action identifier/outbound host is needed to prove which invocation it was.
- `RegionalCompliancePdfDialog.handleGenerate` calls `downloadRegionalCompliancePdf`, which performs a browser **GET**, not a server action. It does not call `getUser`. A current-user POST observed alongside it can be a stale query refetch (e.g. focus/remount), rather than PDF generation. There is no evidence in this checkout of the PDF issuing duplicate current-user requests.
- All `useUser` consumers share the `['user']` TanStack query key and 60-second stale time. They share in-flight browser queries. React's server `cache` is request scoped; it does not deduplicate separate page requests or browser refetches. Assembly switching did separately invalidate an active user query and then fetch it again; this change makes that an explicit single fetch.
- Django routes current-user through Djoser, `DynamicAuthentication` / `CookieJWTAuthentication`, and `CurrentUserSerializer`. The serializer includes assemblies, roles, regional assignments and capabilities. No measured backend query timing is available; serializer/database performance or server cold start must not be asserted as the timeout cause without deployment evidence.

## URL resolution and environments

Previously current-user used `src/config/urls.ts`: `NEXT_PUBLIC_API_URL`, otherwise `NEXT_PUBLIC_SERVER_DEV_URL` in development or `NEXT_PUBLIC_SERVER_PROD_URL` in a production build. Server requests did not use the browser gateway. There was no distinct Preview branch in this resolution and no server-only override. Browser proxying defaults on in production builds, unless explicitly disabled.

The local `.env` has a localhost public API override, a localhost development backend, a production fallback host `honeste-backend.vercel.app`, and browser proxying disabled. These are **local values**, not verified deployed values. A production-mode local build still loads this `.env`; successful compilation does not prove remote connectivity. Vercel Preview/Production variable scopes and branch-specific overrides must be checked separately. Public values are bundled at build time.

Server current-user, auth and gateway calls now share `backend-url.ts` and resolve at request time:

1. `DJANGO_API_URL` (server-only)
2. `NEXT_PUBLIC_API_URL`
3. The matching legacy `NEXT_PUBLIC_SERVER_DEV_URL` / `NEXT_PUBLIC_SERVER_PROD_URL`

Configure `DJANGO_API_URL` to the intended reachable Django base URL for each Vercel environment. It must not be the frontend origin or `/api/backend`. Missing/invalid URLs and deployed localhost targets fail explicitly. Keep browser proxying enabled for deployments using frontend-hosted auth cookies. Redeploy after updating public variables.

## Changes and authorization

- Browser current-user reads now use `GET /api/auth/current-user`, avoiding a page action POST. The server layout retains its request-local cached lookup.
- The GET route reads HttpOnly request cookies server-side, returns private/no-store responses, and retries only a genuine 401 when a refresh token exists. It never retries a timeout or 403. Timeout returns 504; other upstream failures remain failures, not anonymous-user success. Only Django's 401 maps to no user.
- PDF downloads now use the existing API gateway in deployed browser mode so frontend cookies reach Django. The gateway preserves the explicit slashless `monthly-report.pdf` Django route. It retains the original region/year/month/zone/country filters and refresh handling.
- Django's `IsAuthenticated`, `RegionalReportAccessMixin`, `_user_can_access_region`, `_scoped_region` and PDF service access checks are unchanged. No user identity or region grant comes from client input or a decoded JWT alone.
- `[current-user]` structured server logs include `apiHost`, `timeoutMs`, `status` (null before headers), `durationMs`, `failureCategory`, and deployment environment. No cookie, token, user payload, URL credentials, query string or raw exception is logged. Production compilation now retains info/warn/error logging.

## Remaining deployment verification

The workspace has no linked Vercel project/CLI or deployment credentials, and the actual Preview variable values and outbound GET host have not been supplied. The code fixes above are verified locally; **the underlying reason the deployed Django request exceeded five seconds is not yet established**.

For the failing branch's deployment, compare the configured API host with `[current-user].apiHost` and the outbound GET. Confirm the deployed commit corresponds to this checkout. If the host is wrong, correct the scoped variable and redeploy. If correct, correlate this request's timing with Django/Vercel backend logs to distinguish connection/cold-start delays from database/serialization time. A 401/403 or HTML/non-JSON response instead points to cookie/authentication or deployment protection/routing. Do not increase the timeout as a substitute for that diagnosis.

Recheck an authorized PDF download and a cross-region denial on Preview; the PDF should use `/api/backend/api/v1/reports/region/<id>/compliance/monthly-report.pdf`, and a user refetch should be a separate GET to `/api/auth/current-user`.

References: [Vercel environment scopes](https://vercel.com/docs/environment-variables), [Next.js server actions](https://nextjs.org/docs/13/app/building-your-application/data-fetching/server-actions-and-mutations).
