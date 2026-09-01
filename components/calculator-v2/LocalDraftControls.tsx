import { calculatorV2T, type Lang } from "@/lib/i18n";

export type LocalDraftCandidateStatus =
  | "none"
  | "ready"
  | "invalid"
  | "incompatible";

export interface LocalDraftControlsProps {
  candidateStatus: LocalDraftCandidateStatus;
  enabled: boolean;
  lang: Lang;
  onDiscard: () => void;
  onEnabledChange: (enabled: boolean) => void;
  onResume: () => void;
  saveFailed?: boolean;
}

export function LocalDraftControls({
  candidateStatus,
  enabled,
  lang,
  onDiscard,
  onEnabledChange,
  onResume,
  saveFailed = false,
}: LocalDraftControlsProps) {
  const tx = calculatorV2T[lang].localDraft;

  if (candidateStatus === "ready") {
    return (
      <aside
        className="grid gap-5 border-l-4 border-blue-700 bg-blue-50 px-5 py-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center"
        data-local-draft-candidate="ready"
      >
        <div>
          <h2 className="font-bold text-gray-900">{tx.resumeTitle}</h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">{tx.resumeBody}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            className="min-h-11 rounded-lg bg-blue-700 px-4 text-sm font-semibold text-white hover:bg-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
            onClick={onResume}
            type="button"
          >
            {tx.resume}
          </button>
          <button
            className="min-h-11 px-2 text-sm font-semibold text-gray-700 underline decoration-gray-300 underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
            onClick={onDiscard}
            type="button"
          >
            {tx.startFresh}
          </button>
        </div>
      </aside>
    );
  }

  if (candidateStatus === "invalid" || candidateStatus === "incompatible") {
    return (
      <aside
        className="grid gap-4 border-l-4 border-amber-400 bg-amber-50 px-5 py-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center"
        data-local-draft-candidate={candidateStatus}
        role="alert"
      >
        <p className="text-sm leading-6 text-gray-700">
          {candidateStatus === "invalid" ? tx.invalid : tx.incompatible}
        </p>
        <button
          className="min-h-11 text-sm font-semibold text-amber-800 underline decoration-amber-400 underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-700"
          onClick={onDiscard}
          type="button"
        >
          {tx.remove}
        </button>
      </aside>
    );
  }

  return (
    <fieldset className="border-y border-gray-200 py-4">
      <legend className="text-xs font-semibold uppercase tracking-[0.12em] text-gray-600">
        {tx.title}
      </legend>
      <label className="mt-2 flex min-h-11 items-start gap-3 text-sm font-semibold text-gray-800">
        <input
          checked={enabled}
          className="mt-1 h-4 w-4 accent-blue-700"
          onChange={(event) => onEnabledChange(event.currentTarget.checked)}
          type="checkbox"
        />
        <span>{tx.enable}</span>
      </label>
      <p className="max-w-3xl text-xs leading-5 text-gray-600">
        {tx.disclosure}
      </p>
      {saveFailed ? (
        <p className="mt-2 text-xs font-medium text-amber-800" role="status">
          {tx.saveFailed}
        </p>
      ) : null}
    </fieldset>
  );
}
