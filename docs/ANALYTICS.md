# Google Analytics and Search Console

Configured on 13 September 2026:

- Analytics account: **ProcuraCost** (account ID `407805091`).
- GA4 property: **ProcuraCost**, ID `553943657`.
- Web stream: **ProcuraCost WWW**, ID `15768889044`.
- Measurement ID: `G-TXEHBTT8E7` (public identifier, not a secret).
- Google tag ID: `GT-K8H9JJL9`, the unified tag container that routes to
  the `G-TXEHBTT8E7` destination. The site calls `config` with the `G-`
  destination directly, so the integration is unchanged; the `GT-` ID
  matters only if further destinations (for example Google Ads) are later
  attached to the same tag.
- Website: `https://www.procuracost.com`.
- Reporting timezone: Poland; currency: PLN.
- Enhanced measurement: disabled in the web stream.

The owner requested a separate Analytics account after the initial setup.
The earlier property `553911636` on account `24583686`, with tag
`G-9PJY7WEEF1`, remains unused and was not deleted or moved. The application
uses only the new tag above. Optional account data-sharing settings were
disabled when creating the separate account.

`components/GoogleAnalytics.tsx` is included in both language layouts.
It loads the Google tag only after explicit analytics consent and only on
the canonical production origin. Localhost and preview hosts send no data.
The footer control reopens consent settings. Withdrawal removes GA cookies
and reloads the page to unload the tag, including after a cross-tab change.

`lib/analytics.ts` sends one manual page view per pathname change. It strips
URL queries and fragments, uses pathnames as page titles, and limits referrers
to the previous sanitised page in the same document. Calculator inputs and
custom comparison names are never passed to the tracker. Advertising consent,
Google signals and advertising personalisation remain disabled. GA cookies
expire after 90 days; consent is stored separately in local storage.

Keep enhanced measurement disabled: enabling automatic history or form events
can duplicate manual page views or collect additional parameters.

## Verification and delivery

The Google property and stream exist. The website integration must be deployed
before actual production visits can be measured. Property creation alone does
not demonstrate live collection. Check Realtime after a consented production
visit, then check denial and withdrawal in a fresh browser context.

Run `npm test -- tests/analytics.test.ts` for host, consent, deduplication and
URL sanitisation checks, followed by the repository's full verification suite.

Local verification on 13 September: 812 tests passed; recompute, symmetry sweep
(zero invariant failures), replication, production build and lint passed.
Browser checks confirmed PL refusal, persistence when moving to EN, reopening
the English settings and accepting consent. No Google tag was loaded on
localhost even after acceptance; the browser console reported no errors.
Production collection and withdrawal with a live Google tag remain deployment
checks, not outcomes established by these local tests.

Deployment check on 20 September: the owner reported the GA4 property showing
the web tag as installed on `https://www.procuracost.com`. Still to verify in
Realtime: a consented production visit registering one manual page view, and
cookie withdrawal unloading the tag.

## Search Console

The verified domain property is `sc-domain:procuracost.com`. See
`gsc-2026-09-13.md` for the initial authenticated read. GSC is currently accessed
through its signed-in panel; no scheduled import, API credentials or public
reporting endpoint has been added. Its property is not yet linked to GA4;
linking is done on the GA4 side (property `553943657`, Admin → Product
links → Search Console links) against the verified domain property.

Google references:
- https://developers.google.com/tag-platform/security/guides/consent
- https://developers.google.com/analytics/devguides/collection/ga4/views
