import type { CalculatorUiIssue } from "./issues";

export interface CalculatorIssueGroups {
  processMapIssues: CalculatorUiIssue[];
  generalIssues: CalculatorUiIssue[];
}

export function isProcessMapPresentationIssue(
  issue: CalculatorUiIssue
): boolean {
  if (issue.source === "process-map" || issue.source === "custom-label") {
    return true;
  }

  return (
    (issue.source === "editor" || issue.source === "range") &&
    Boolean(issue.alternativeId && issue.stepId)
  );
}

export function partitionCalculatorIssues(
  issues: readonly CalculatorUiIssue[]
): CalculatorIssueGroups {
  const processMapIssues: CalculatorUiIssue[] = [];
  const generalIssues: CalculatorUiIssue[] = [];

  for (const issue of issues) {
    if (isProcessMapPresentationIssue(issue)) {
      processMapIssues.push(issue);
    } else {
      generalIssues.push(issue);
    }
  }

  return { processMapIssues, generalIssues };
}
