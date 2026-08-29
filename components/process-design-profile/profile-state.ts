export type ProcessOrientation = "sequential" | "mixed" | "adaptive";

export interface ProcessProfileAnswer {
  questionIndex: number;
  orientation: ProcessOrientation;
  answerIndex: 0 | 1 | 2;
}

export interface ProcessProfileResult {
  counts: Record<ProcessOrientation, number>;
  answers: readonly ProcessProfileAnswer[];
}

export interface ProcessProfileState {
  answers: readonly ProcessProfileAnswer[];
  focusTarget: "result-heading" | null;
}

export type ProcessProfileAction =
  | {
      type: "answer";
      answer: ProcessProfileAnswer;
      questionCount: number;
    }
  | { type: "focus-consumed" }
  | { type: "reset" };

const ORIENTATION_BY_ANSWER_INDEX = [
  "sequential",
  "mixed",
  "adaptive",
] as const;

function cloneAnswer(answer: ProcessProfileAnswer): ProcessProfileAnswer {
  return { ...answer };
}

export function buildProcessProfileResult(
  answers: readonly ProcessProfileAnswer[],
  questionCount: number
): ProcessProfileResult | null {
  if (!Number.isInteger(questionCount) || questionCount <= 0) return null;
  if (answers.length !== questionCount) return null;

  const questionIndexes = new Set<number>();
  for (const answer of answers) {
    if (
      !Number.isInteger(answer.questionIndex) ||
      answer.questionIndex < 0 ||
      answer.questionIndex >= questionCount ||
      questionIndexes.has(answer.questionIndex) ||
      !Number.isInteger(answer.answerIndex) ||
      answer.answerIndex < 0 ||
      answer.answerIndex >= ORIENTATION_BY_ANSWER_INDEX.length ||
      ORIENTATION_BY_ANSWER_INDEX[answer.answerIndex] !== answer.orientation
    ) {
      return null;
    }
    questionIndexes.add(answer.questionIndex);
  }

  const counts: Record<ProcessOrientation, number> = {
    sequential: 0,
    mixed: 0,
    adaptive: 0,
  };
  for (const answer of answers) counts[answer.orientation] += 1;

  return {
    counts,
    answers: answers.map(cloneAnswer),
  };
}

export function createProcessProfileState(): ProcessProfileState {
  return { answers: [], focusTarget: null };
}

export function processProfileReducer(
  state: ProcessProfileState,
  action: ProcessProfileAction
): ProcessProfileState {
  if (action.type === "reset") return createProcessProfileState();
  if (action.type === "focus-consumed") {
    return state.focusTarget === null ? state : { ...state, focusTarget: null };
  }

  const wasComplete =
    buildProcessProfileResult(state.answers, action.questionCount) !== null;
  const existingIndex = state.answers.findIndex(
    ({ questionIndex }) => questionIndex === action.answer.questionIndex
  );
  const answers = state.answers.map(cloneAnswer);
  if (existingIndex === -1) answers.push(cloneAnswer(action.answer));
  else answers[existingIndex] = cloneAnswer(action.answer);
  const isComplete =
    buildProcessProfileResult(answers, action.questionCount) !== null;

  return {
    answers,
    focusTarget:
      !wasComplete && isComplete ? "result-heading" : state.focusTarget,
  };
}
