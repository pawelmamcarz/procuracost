import type { ModelContextV2 } from "./domain";

function registeredContextFields(context: ModelContextV2) {
  return Object.fromEntries(
    Object.entries(context).filter(([key]) => key !== "initiatedOn")
  ) as Omit<ModelContextV2, "initiatedOn">;
}

export function hasSameRegisteredScenarioContext(
  actual: ModelContextV2,
  registered: ModelContextV2
): boolean {
  const actualFields = registeredContextFields(actual);
  const registeredFields = registeredContextFields(registered);
  const actualKeys = Object.keys(actualFields) as Array<keyof typeof actualFields>;
  const registeredKeys = Object.keys(registeredFields);

  return (
    actualKeys.length === registeredKeys.length &&
    actualKeys.every(
      (key) =>
        Object.hasOwn(registeredFields, key) &&
        actualFields[key] === registeredFields[key]
    )
  );
}

export function assertSameRegisteredScenarioContext(
  actual: ModelContextV2,
  registered: ModelContextV2,
  subject = "Input"
): void {
  if (!hasSameRegisteredScenarioContext(actual, registered)) {
    throw new Error(`${subject} does not match the registered scenario context`);
  }
}
