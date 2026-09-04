import { Calculator, Equal, ShieldCheck } from "lucide-react";

import { calculatorV2T, type Lang } from "@/lib/i18n";
import {
  selectCompetitionDisadvantagedAlternative,
  type AlternativeId,
  type CalibratedValue,
} from "@/lib/model-v2";

import type {
  CalculatorWorkspaceAction,
  CalculatorWorkspaceState,
} from "./editor-state";
import type { CalculatorUiIssue } from "./issues";
import {
  calculatorIssueCopy,
  deriveCalculatorWorkspaceValidation,
} from "./workspace-validation";

type RangeMember = "low" | "central" | "high";

const ALTERNATIVE_IDS: AlternativeId[] = [
  "formalSequential",
  "adaptiveCompliant",
];
const COMPETITION_CHOICES: readonly (AlternativeId | null)[] = [
  null,
  ...ALTERNATIVE_IDS,
];

export interface EconomicAssumptionsProps {
  section?: "all" | "primary" | "advanced";
  lang: Lang;
  state: CalculatorWorkspaceState;
  onAction: (action: CalculatorWorkspaceAction) => void;
}

function editedRange(
  value: CalibratedValue,
  member: RangeMember,
  nextNumber: number
): CalibratedValue {
  return {
    ...value,
    [member]: nextNumber,
    rangeKind: "calibrated",
    evidenceClass: "user_input",
    evidenceIds: [],
  };
}

function economicIssue(
  issues: readonly CalculatorUiIssue[],
  field: string
): CalculatorUiIssue | undefined {
  return issues.find((issue) => issue.field === field);
}

interface EconomicRangeEditorProps {
  lang: Lang;
  idPrefix: string;
  label: string;
  unit: string;
  value: CalibratedValue;
  issue?: CalculatorUiIssue;
  maximum?: number;
  onChange: (value: CalibratedValue) => void;
}

function EconomicRangeEditor({
  lang,
  idPrefix,
  label,
  unit,
  value,
  issue,
  maximum,
  onChange,
}: EconomicRangeEditorProps) {
  const tx = calculatorV2T[lang].economics;
  const errorId = `${idPrefix}-error`;
  const members: Array<[RangeMember, string]> = [
    ["low", tx.low],
    ["central", tx.central],
    ["high", tx.high],
  ];

  return (
    <fieldset className="space-y-2 border-t border-gray-200 pt-4">
      <legend className="text-sm font-semibold text-gray-900">{label}</legend>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {members.map(([member, memberLabel]) => {
          const inputId = `${idPrefix}-${member}`;
          return (
            <label className="space-y-1" htmlFor={inputId} key={member}>
              <span className="block text-xs font-medium text-gray-600">
                {memberLabel}
              </span>
              <span className="flex items-center gap-2">
                <input
                  aria-describedby={issue ? errorId : undefined}
                  aria-invalid={issue ? true : undefined}
                  className="min-h-11 min-w-0 w-full rounded-lg border border-gray-200 bg-white px-3 font-mono text-sm text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                  id={inputId}
                  inputMode="decimal"
                  max={maximum}
                  min={0}
                  onChange={(event) =>
                    onChange(
                      editedRange(
                        value,
                        member,
                        Number(event.currentTarget.value)
                      )
                    )
                  }
                  step="any"
                  type="number"
                  value={value[member]}
                />
                <span className="shrink-0 font-mono text-[11px] text-gray-500">
                  {unit}
                </span>
              </span>
            </label>
          );
        })}
      </div>
      {issue ? (
        <p className="text-xs text-amber-800" id={errorId}>
          {calculatorIssueCopy(issue, lang)}
        </p>
      ) : null}
    </fieldset>
  );
}

function roleLabel(roleId: string, lang: Lang): string {
  const roles = calculatorV2T[lang].inspector.roles;
  return roleId in roles
    ? roles[roleId as keyof typeof roles]
    : `${roles.unknown} (${roleId})`;
}

export function EconomicAssumptions({
  section = "all",
  lang,
  state,
  onAction,
}: EconomicAssumptionsProps) {
  const tx = calculatorV2T[lang].economics;
  const assumptions = state.draft.economicAssumptions;
  const issues = deriveCalculatorWorkspaceValidation(state).issues;
  const competitionSideIssue = economicIssue(
    issues,
    "economicAssumptions.competitionDisadvantagedAlternative"
  );
  const replaceAssumption = (
    field:
      | "contractValue"
      | "dailyCostOfInaction"
      | "competitionTransferRate",
    value: CalibratedValue
  ) => {
    onAction({
      type: "replace-economic-assumptions",
      economicAssumptions: {
        ...assumptions,
        [field]: value,
      },
    });
  };

  const primaryFields = (
    <div className="grid gap-x-6 gap-y-5 lg:grid-cols-2">
      <EconomicRangeEditor
        idPrefix="economic-contract-value"
        issue={economicIssue(
          issues,
          "economicAssumptions.contractValue"
        )}
        label={tx.contractValue}
        lang={lang}
        onChange={(value) => replaceAssumption("contractValue", value)}
        unit={tx.currencyUnit}
        value={assumptions.contractValue}
      />
      <EconomicRangeEditor
        idPrefix="economic-daily-cost"
        issue={economicIssue(
          issues,
          "economicAssumptions.dailyCostOfInaction"
        )}
        label={tx.dailyCostOfDelay}
        lang={lang}
        onChange={(value) =>
          replaceAssumption("dailyCostOfInaction", value)
        }
        unit={tx.currencyUnit}
        value={assumptions.dailyCostOfInaction}
      />
    </div>
  );
  if (section === "primary") {
    return (
      <div className="space-y-5">
        <p className="max-w-3xl text-sm leading-relaxed text-gray-600">{tx.introduction}</p>
        {primaryFields}
      </div>
    );
  }

  return (
    <div aria-describedby="economic-assumptions-introduction" className="space-y-6">
      <p
        className="max-w-3xl text-sm leading-relaxed text-gray-600"
        id="economic-assumptions-introduction"
      >
        {tx.introduction}
      </p>

      {section === "all" ? primaryFields : null}
      <div className="grid gap-x-6 gap-y-5 lg:grid-cols-2">
        <fieldset className="space-y-3 border-t border-gray-200 pt-4 lg:col-span-2">
          <legend className="text-sm font-semibold text-gray-900">
            {tx.competitionDisadvantagedAlternative}
          </legend>
          <p
            className="max-w-3xl text-xs leading-relaxed text-gray-600"
            id="economic-competition-disadvantaged-disclosure"
          >
            {tx.competitionDisadvantagedDisclosure}
          </p>
          <div className="grid gap-2 sm:grid-cols-3">
            {COMPETITION_CHOICES.map((alternativeId) => {
              const isNoDifference = alternativeId === null;
              const selected = isNoDifference
                ? !assumptions.pathCompetitionDiffers &&
                  assumptions.competitionDisadvantagedAlternative === null
                : assumptions.pathCompetitionDiffers &&
                  assumptions.competitionDisadvantagedAlternative ===
                    alternativeId;
              const describedBy = [
                "economic-competition-disadvantaged-disclosure",
                competitionSideIssue
                  ? "economic-competition-disadvantaged-error"
                  : null,
              ]
                .filter(Boolean)
                .join(" ");
              return (
                <label
                  className={
                    selected
                      ? "flex min-h-11 items-center gap-3 rounded-lg border border-blue-500 bg-blue-50 px-3 text-sm font-medium text-blue-700"
                      : "flex min-h-11 items-center gap-3 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 hover:border-gray-300"
                  }
                  key={alternativeId ?? "none"}
                >
                  <input
                    aria-describedby={describedBy}
                    checked={selected}
                    name="economic-competition-disadvantaged"
                    onChange={() =>
                      onAction({
                        type: "replace-economic-assumptions",
                        economicAssumptions:
                          selectCompetitionDisadvantagedAlternative(
                            assumptions,
                            alternativeId
                          ),
                      })
                    }
                    type="radio"
                    value={alternativeId ?? "none"}
                  />
                  <span>
                    {alternativeId === null
                      ? tx.noDeclaredCompetitionDifference
                      : calculatorV2T[lang].alternatives[alternativeId]}
                  </span>
                </label>
              );
            })}
          </div>
          {competitionSideIssue ? (
            <p
              className="text-xs text-amber-800"
              id="economic-competition-disadvantaged-error"
            >
              {calculatorIssueCopy(competitionSideIssue, lang)}
            </p>
          ) : null}
        </fieldset>
        {assumptions.competitionTransferRate ? (
          <EconomicRangeEditor
            idPrefix="economic-competition-transfer"
            issue={economicIssue(
              issues,
              "economicAssumptions.competitionTransferRate"
            )}
            label={tx.competitionTransfer}
            lang={lang}
            maximum={1}
            onChange={(value) =>
              replaceAssumption("competitionTransferRate", value)
            }
            unit={tx.rateUnit}
            value={assumptions.competitionTransferRate}
          />
        ) : null}
      </div>

      <section aria-labelledby="economic-role-rates-heading" className="space-y-4">
        <div className="flex items-center gap-2">
          <Calculator aria-hidden="true" className="h-4 w-4 text-gray-500" />
          <h3
            className="text-xs font-semibold uppercase tracking-wide text-gray-600"
            id="economic-role-rates-heading"
          >
            {tx.roleRates}
          </h3>
        </div>
        <div className="space-y-5">
          {Object.entries(state.draft.roleHourlyRates).map(
            ([roleId, value]) => (
              <EconomicRangeEditor
                idPrefix={`economic-role-rate-${roleId}`}
                issue={economicIssue(issues, `roleHourlyRates.${roleId}`)}
                key={roleId}
                label={roleLabel(roleId, lang)}
                lang={lang}
                onChange={(nextValue) =>
                  onAction({
                    type: "edit-role-hourly-rate",
                    roleId,
                    value: nextValue,
                  })
                }
                unit={tx.hourlyUnit}
                value={value}
              />
            )
          )}
        </div>
      </section>

      <section
        aria-labelledby="economic-neutral-boundary-heading"
        className="border-l-4 border-amber-400 pl-4"
      >
        <div className="flex items-center gap-2">
          <ShieldCheck
            aria-hidden="true"
            className="h-4 w-4 text-amber-700"
          />
          <h3
            className="text-xs font-semibold uppercase tracking-wide text-gray-600"
            id="economic-neutral-boundary-heading"
          >
            {tx.fixedDimensions}
          </h3>
        </div>
        <p className="mt-2 text-xs leading-relaxed text-gray-600">
          {tx.fixedNeutral}
        </p>
        <dl className="mt-3 divide-y divide-gray-100 border-y border-gray-200">
          {[
            [tx.amendmentDifferential, assumptions.amendmentDifferential],
            [tx.tcoDifferential, assumptions.tcoDifferential],
          ].map(([label, value]) => {
            const calibrated = value as CalibratedValue;
            return (
              <div className="flex items-center justify-between gap-4 py-3" key={label as string}>
                <dt className="text-xs font-medium text-gray-700">
                  {label as string}
                </dt>
                <dd className="flex items-center gap-2 font-mono text-xs text-gray-900">
                  <Equal aria-hidden="true" className="h-3.5 w-3.5" />
                  {calibrated.central} {tx.currencyUnit}
                </dd>
              </div>
            );
          })}
          <div className="flex items-center justify-between gap-4 py-3">
            <dt className="text-xs font-medium text-gray-700">{tx.bypass}</dt>
            <dd className="text-right text-xs font-semibold text-gray-700">
              {tx.notMonetized}
            </dd>
          </div>
        </dl>
      </section>
    </div>
  );
}
