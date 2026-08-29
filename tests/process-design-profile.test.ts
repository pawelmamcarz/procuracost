import { readFileSync } from "node:fs";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import AssessmentQuiz, {
  AssessmentQuizView,
  PROCESS_PROFILE_RESULT_HEADING_ID,
} from "@/components/AssessmentQuiz";
import {
  buildProcessProfileResult,
  createProcessProfileState,
  processProfileReducer,
  type ProcessProfileAnswer,
} from "@/components/process-design-profile/profile-state";
import { assessmentT } from "@/lib/i18n";

const TEN_ANSWERS: readonly ProcessProfileAnswer[] = [
  { questionIndex: 0, orientation: "sequential", answerIndex: 0 },
  { questionIndex: 1, orientation: "mixed", answerIndex: 1 },
  { questionIndex: 2, orientation: "adaptive", answerIndex: 2 },
  { questionIndex: 3, orientation: "sequential", answerIndex: 0 },
  { questionIndex: 4, orientation: "mixed", answerIndex: 1 },
  { questionIndex: 5, orientation: "adaptive", answerIndex: 2 },
  { questionIndex: 6, orientation: "sequential", answerIndex: 0 },
  { questionIndex: 7, orientation: "mixed", answerIndex: 1 },
  { questionIndex: 8, orientation: "adaptive", answerIndex: 2 },
  { questionIndex: 9, orientation: "sequential", answerIndex: 0 },
];

describe("descriptive procurement process profile state", () => {
  it("returns null until every one of the ten distinct rows has an answer", () => {
    expect(buildProcessProfileResult([], 10)).toBeNull();
    expect(buildProcessProfileResult(TEN_ANSWERS.slice(0, 9), 10)).toBeNull();
    expect(
      buildProcessProfileResult(
        [...TEN_ANSWERS.slice(0, 9), { ...TEN_ANSWERS[8] }],
        10
      )
    ).toBeNull();
  });

  it("counts three unordered orientations and preserves every supplied row", () => {
    const shuffled = [
      TEN_ANSWERS[7],
      TEN_ANSWERS[0],
      TEN_ANSWERS[9],
      TEN_ANSWERS[2],
      TEN_ANSWERS[5],
      TEN_ANSWERS[1],
      TEN_ANSWERS[8],
      TEN_ANSWERS[4],
      TEN_ANSWERS[3],
      TEN_ANSWERS[6],
    ];

    const result = buildProcessProfileResult(shuffled, 10);

    expect(result).toEqual({
      counts: { sequential: 4, mixed: 3, adaptive: 3 },
      answers: shuffled,
    });
    expect(result?.answers).not.toBe(shuffled);
    for (const [index, answer] of result!.answers.entries()) {
      expect(answer).not.toBe(shuffled[index]);
    }
  });

  it("fails closed for invalid or internally inconsistent runtime answer values", () => {
    const invalidOrientation = TEN_ANSWERS.map((answer) => ({ ...answer }));
    invalidOrientation[3] = {
      ...invalidOrientation[3],
      orientation: "other",
    } as unknown as ProcessProfileAnswer;
    expect(buildProcessProfileResult(invalidOrientation, 10)).toBeNull();

    const invalidAnswerIndex = TEN_ANSWERS.map((answer) => ({ ...answer }));
    invalidAnswerIndex[3] = {
      ...invalidAnswerIndex[3],
      answerIndex: 3,
    } as unknown as ProcessProfileAnswer;
    expect(buildProcessProfileResult(invalidAnswerIndex, 10)).toBeNull();

    const inconsistentMapping = TEN_ANSWERS.map((answer) => ({ ...answer }));
    inconsistentMapping[3] = {
      ...inconsistentMapping[3],
      orientation: "adaptive",
      answerIndex: 0,
    };
    expect(buildProcessProfileResult(inconsistentMapping, 10)).toBeNull();
  });

  it("sets one declarative result focus target only on completion", () => {
    let state = createProcessProfileState();

    for (const answer of TEN_ANSWERS.slice(0, 9)) {
      state = processProfileReducer(state, {
        type: "answer",
        answer,
        questionCount: 10,
      });
      expect(state.focusTarget).toBeNull();
    }

    state = processProfileReducer(state, {
      type: "answer",
      answer: TEN_ANSWERS[9],
      questionCount: 10,
    });
    expect(state.answers).toEqual(TEN_ANSWERS);
    expect(state.focusTarget).toBe("result-heading");

    state = processProfileReducer(state, { type: "focus-consumed" });
    expect(state.focusTarget).toBeNull();
  });

  it("replaces a row by question identity and resets the complete profile", () => {
    let state = TEN_ANSWERS.reduce(
      (current, answer) =>
        processProfileReducer(current, {
          type: "answer",
          answer,
          questionCount: 10,
        }),
      createProcessProfileState()
    );

    state = processProfileReducer(state, {
      type: "answer",
      answer: { questionIndex: 4, orientation: "adaptive", answerIndex: 2 },
      questionCount: 10,
    });
    expect(state.answers).toHaveLength(10);
    expect(state.answers[4]).toEqual({
      questionIndex: 4,
      orientation: "adaptive",
      answerIndex: 2,
    });

    expect(processProfileReducer(state, { type: "reset" })).toEqual(
      createProcessProfileState()
    );
  });
});

function completeProfileState() {
  return TEN_ANSWERS.reduce(
    (state, answer) =>
      processProfileReducer(state, {
        type: "answer",
        answer,
        questionCount: 10,
      }),
    createProcessProfileState()
  );
}

function visibleText(markup: string) {
  return markup
    .replace(/<[^>]+>/g, " ")
    .replaceAll("&amp;", "&")
    .replaceAll("&#x27;", "'")
    .replace(/\s+/g, " ")
    .trim();
}

describe("procurement process design profile presentation", () => {
  it("describes equally controlled orientations without maturity-scale cues in the choices", () => {
    const maturityCues =
      /\b(?:better|worse|best|weak|weaker|strong|stronger|basic|advanced|mature|immature|lepsz\w*|gorsz\w*|najlepsz\w*|słab\w*|siln\w*|podstawow\w*|zaawansowan\w*|dojrzał\w*|niedojrzał\w*)\b/i;

    for (const lang of ["pl", "en"] as const) {
      const choices = assessmentT[lang].questions.flatMap(
        ({ answers }) => answers
      );

      expect(choices).toHaveLength(30);
      for (const choice of choices) expect(choice).not.toMatch(maturityCues);
    }

    expect(assessmentT.pl.subtitle).toContain(
      "nie są skalą od gorszego do lepszego"
    );
    expect(assessmentT.en.questions[4].answers[0]).toBe(
      "Approvals follow an approved sequence under the delegation-of-authority matrix."
    );
    expect(assessmentT.en.result.selectionsTitle).toBe(
      "Selected design by dimension"
    );
  });

  it("renders all ten neutral rows and thirty unordered controls from the initial state", () => {
    for (const lang of ["pl", "en"] as const) {
      const markup = renderToStaticMarkup(
        createElement(AssessmentQuizView, {
          lang,
          state: createProcessProfileState(),
          onStateChange: () => {},
        })
      );
      const text = visibleText(markup);

      expect(text).toContain(assessmentT[lang].title);
      expect(markup).toContain('<div class="mx-auto max-w-2xl');
      expect(markup.match(/<fieldset\b/g)).toHaveLength(10);
      expect(markup.match(/<legend\b/g)).toHaveLength(10);
      expect(markup.match(/type="radio"/g)).toHaveLength(30);
      expect(markup.match(/data-profile-row=/g)).toHaveLength(10);
      expect(markup).not.toContain("checked");
      expect(markup).not.toMatch(/progressbar|aria-valuenow|style="width:/);
      expect(markup).not.toMatch(/bg-(?:red|green|amber)-|text-(?:red|green|amber)-/);
      expect(markup).not.toMatch(/bg-gradient|shadow-|transition-/);
      expect(markup).not.toContain("slate-");
      expect(text).not.toMatch(/\b(?:score|points|percentage|maturity score)\b|\/\s*20/i);
      expect(text).not.toMatch(/\b(?:punktacja|punkty|procent|poziom dojrzałości)\b|\/\s*20/i);
    }
  });

  it("renders unordered counts, written selections, interpretation limit and contextual links", () => {
    const state = completeProfileState();

    for (const lang of ["pl", "en"] as const) {
      const markup = renderToStaticMarkup(
        createElement(AssessmentQuizView, {
          lang,
          state,
          onStateChange: () => {},
        })
      );
      const text = visibleText(markup);
      const tx = assessmentT[lang];
      const resultStart = markup.indexOf(
        `aria-labelledby="${PROCESS_PROFILE_RESULT_HEADING_ID}"`
      );
      const resultMarkup = markup.slice(resultStart);
      const resultText = visibleText(resultMarkup);

      expect(markup.match(/data-orientation-count=/g)).toHaveLength(3);
      expect(markup.match(/data-selected-orientation=/g)).toHaveLength(10);
      expect(markup.match(/data-selected-indicator=/g)).toHaveLength(10);
      expect(resultMarkup.match(/data-profile-result-row=/g)).toHaveLength(10);
      expect(markup).toContain(`id="${PROCESS_PROFILE_RESULT_HEADING_ID}"`);
      expect(markup).toContain('tabindex="-1"');
      expect(text).toContain(tx.result.description);
      expect(resultText).toContain(
        lang === "pl"
          ? "Profil ma charakter opisowy i nie jest zwalidowanym narzędziem oceny."
          : "The profile is descriptive and has not been validated as an assessment instrument."
      );
      expect(text).toContain(tx.orientations.sequential);
      expect(text).toContain(tx.orientations.mixed);
      expect(text).toContain(tx.orientations.adaptive);
      for (const answer of TEN_ANSWERS) {
        const question = tx.questions[answer.questionIndex];
        expect(resultText).toContain(question.dimension);
        expect(resultText).toContain(question.answers[answer.answerIndex]);
        expect(resultText).toContain(tx.orientations[answer.orientation]);
      }
      expect(markup).toContain(
        `href="${lang === "en" ? "/en/calculator" : "/calculator"}"`
      );
      expect(markup).toContain(
        `href="${lang === "en" ? "/en/readiness" : "/readiness"}"`
      );
      expect(text).toContain(tx.actions.restart);
    }
  });

  it("owns interactive state, consumes the declarative focus target through the shared reveal helper and persists nothing", () => {
    const source = readFileSync("components/AssessmentQuiz.tsx", "utf8");

    expect(source).toContain("revealResult");
    expect(source).toContain("processProfileReducer");
    expect(source).toContain("PROCESS_PROFILE_RESULT_HEADING_ID");
    expect(source).not.toMatch(
      /localStorage|sessionStorage|URLSearchParams|fetch\(|sendBeacon/
    );
    expect(renderToStaticMarkup(createElement(AssessmentQuiz, { lang: "en" })))
      .toContain(assessmentT.en.title);
  });
});
