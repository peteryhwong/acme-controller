# Controller Service

A microservice that controls devices

# Generate Migration

`npm run typeorm -- migration:generate -d datasource.ts src/migration/CreateDevice`

# Local Development

## Prerequisites

-   node v22.14.0
-   npm

## Instructions

-   `npm ci` -- Install dependencies
-   `npm run watch` -- Watch
-   `npm run migrate` -- Execute database migration
-   `npm run build` -- Build
-   `npm run test` -- Test
-   `npm audit` -- Audit
-   `npm run dev` -- Run locally as node process, note that a local mysql instance must be set up and its hostname must be updated at `src/resource/api.json`
