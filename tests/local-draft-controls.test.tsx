import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

describe("local draft consent controls", () => {
  it("renders explicit consent and a separate resume decision", async () => {
    const draftControlsModule = await import(
      "@/components/calculator-v2/LocalDraftControls"
    ).catch(() => null);

    expect(draftControlsModule).not.toBeNull();
    if (!draftControlsModule) return;

    const consent = renderToStaticMarkup(
      createElement(draftControlsModule.LocalDraftControls, {
        candidateStatus: "none",
        enabled: false,
        lang: "en",
        onDiscard: () => {},
        onEnabledChange: () => {},
        onResume: () => {},
      })
    );
    const resume = renderToStaticMarkup(
      createElement(draftControlsModule.LocalDraftControls, {
        candidateStatus: "ready",
        enabled: false,
        lang: "en",
        onDiscard: () => {},
        onEnabledChange: () => {},
        onResume: () => {},
      })
    );

    expect(consent).toContain('type="checkbox"');
    expect(consent).toContain("Save the draft on this device");
    expect(consent).toContain("It is not sent to a server.");
    expect(resume).toContain('data-local-draft-candidate="ready"');
    expect(resume).toContain("Resume draft");
    expect(resume).toContain("Start again");
    expect(resume).not.toContain('checked=""');
  });

  it("offers deletion instead of loading invalid or incompatible data", async () => {
    const { LocalDraftControls } = await import(
      "@/components/calculator-v2/LocalDraftControls"
    );

    for (const candidateStatus of ["invalid", "incompatible"] as const) {
      const html = renderToStaticMarkup(
        createElement(LocalDraftControls, {
          candidateStatus,
          enabled: false,
          lang: "en",
          onDiscard: () => {},
          onEnabledChange: () => {},
          onResume: () => {},
        })
      );
      expect(html).toContain(`data-local-draft-candidate="${candidateStatus}"`);
      expect(html).toContain("Remove local draft");
      expect(html).not.toContain("Resume draft");
    }
  });
});
