# Changelog

## 2026-07-14 — Site 2026.29.1.2 / model 2.1.0

- Preserved mandatory PZP publication and standstill periods in both paths.
- Corrected Beuve et al. from an event probability to annual formal-amendment
  frequency and added contract duration to inputs and exports.
- Set the unsupported central TCO pool to zero and added a central break-even
  daily cost of inaction.
- Rebuilt the optimizer on common criteria, validated inputs, and restricted the
  national PZP band to the basic mode under Arts. 266 and 275. Above the EU
  threshold, the default filter now offers only procedures available without
  extra statutory grounds under Art. 129(2).
- Updated the website, long-form articles, working paper, supervisor package,
  shortcasts, and replication contract to model 2.1.

## 2026-07-13 — Site 2026.29.1.1 / model 2.0.0

- Replaced the single-rigidity logic with separate workflow, competition,
  contract-rigidity, TCO-capture and bypass constructs.
- Added low/central/high scenario envelopes with explicit sign robustness.
- Corrected the evidence mapping, bibliography and 2026–2027 PZP thresholds.
- Rewrote the public methodology, research pages, shortcasts and four long-form
  articles for model 2.0.
- Added a model-2.0 supervisor package and generated replication outputs.
- Adopted `ISO-week-year.ISO-week.release.patch` site versioning.
- Isolated superseded research, publication and planning files under
  `docs/archive/model-1.x/`; none is linked or served by the public application.

Historical change detail remains available in Git history and the archive's
verification reports. It is not current documentation.
