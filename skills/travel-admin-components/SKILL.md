---
name: travel-admin-components
description: Use when creating or updating React components, pages, routes, hooks, or feature services in this travel agency admin frontend. Enforces the repo's API-first admin patterns, exact backend route mapping, dark mobile app styling, light desktop card/table layout, debounced server-side search, and bottom-of-table pagination.
---

# Travel Admin Components

Use this skill for any new or modified feature UI in this repo.

## Goals

- Match the existing travel admin visual system.
- Keep data fetching and normalization out of page components.
- Keep mobile layouts feeling like an app, not a squeezed desktop page.
- Put search above tables and pagination in the table footer area.

## Workflow

1. Inspect the existing feature first.
   Read the page, service, hook, constants, and related CSS block before editing.

2. Keep the data flow layered.
   Add endpoints in `src/constants/apiUrls.js`.
   Normalize API responses in `src/features/<feature>/services/*Service.js`.
   Keep pages mostly presentation-focused.
   Prefer a fallback payload when the feature already uses that pattern.

3. Keep route naming aligned with backend paths.
   Add the client route in `src/constants/routes.js`.
   Register it in `src/App.jsx`.
   Map backend menu paths in `src/features/menu/utils/menuHelpers.js`.
   If the backend path is `/admin/tripPerformance`, prefer that exact route unless there is a strong reason not to.

4. Follow the page composition pattern.
   Desktop:
   Use `AdminLayout`, `Card`, `Table`, and `MetricsOverview` where they fit.
   Keep page-level summaries in a hero/header block and detailed data in cards below.

   Mobile:
   Create a dedicated mobile layout with feature-prefixed classes such as `trip-performance-mobile__...`.
   Use dark layered surfaces, rounded cards, and compact spacing.

5. Use server-side search correctly.
   Put the search UI above the table.
   For desktop tables, place search in `Card.actions`.
   Use `useDebouncedValue` before calling the data hook.
   Send `search` to the API from the service layer.
   Reset pagination to page `1` when the search term changes.

6. Put pagination at the bottom of tables.
   Use the `Card.footer` area for desktop pagination.
   Show a summary like `Showing X-Y of Z`.
   Keep action buttons grouped on the right on desktop and stacked on mobile.

7. Keep styling consistent.
   Add page-specific CSS to `src/styles/App.css`.
   Prefix selectors by feature, for example:
   `trip-performance-*`
   `dashboard-*`

   Preserve these visual rules:
   - mobile is dark, layered, and app-like
   - desktop is lighter, airy, and card-based
   - use gradients sparingly but intentionally
   - keep radii soft and spacing compact

8. Reuse proven interaction patterns.
   Occupancy/progress bars should use semantic wrapper classes instead of large inline style blocks.
   Tabular data should go through the shared `Table` component.
   Buttons should use the shared `Button` component.

9. Do not hardcode secrets.
   Never embed bearer tokens in source files.
   Use the existing auth token flow from local storage through `apiClient`.

10. Validate every feature change.
   Run:
   `npm run build`
   `npm run lint`

## Checklist

- Endpoint added or reused in `apiUrls.js`
- Service normalizes raw API data
- Hook uses `useApi`
- Route added in `routes.js` and `App.jsx`
- Menu helper maps backend path
- Search is debounced and server-side
- Pagination is below the table
- Mobile and desktop both designed intentionally
- Build and lint pass
