/* Public GA4 Measurement ID for the Illinois Care Guide web stream.
   This is a measurement ID (G-…), not a Google Tag Manager container ID (GTM-…).
   Property 563468689 · account 415635477 · stream 16308642891.
   Maintainer report (sign-in required):
   https://analytics.google.com/analytics/web/#/a415635477p563468689/reports/intelligenthome
   Property settings confirmed by the maintainer on 2026-11-10:
   Enhanced measurement OFF, Google signals OFF, ads personalization disallowed
   in all regions, optional data sharing OFF, data retention 2 months.
   Also keep “Reset user data on new activity” OFF if that control is shown,
   and keep email redaction ON for the web stream.
   The tag loads only on https://shroudxk.github.io after a visitor accepts.
   Localhost, previews, and automated tests do not send hits. */
(function (root) {
  if (!root.ICG_ANALYTICS_CONFIG) {
    root.ICG_ANALYTICS_CONFIG = {
      provider: 'ga4',
      measurementId: 'G-68T1ZEGEJX'
    };
  }
})(typeof globalThis !== 'undefined' ? globalThis : this);
