import Link from "next/link";
import { systemPageT, type Lang } from "@/lib/i18n";

export default function SystemPage({ lang, retry }: { lang: Lang; retry?: () => void }) {
  const tx = systemPageT[lang];
  const prefix = lang === "en" ? "/en" : "";
  return (
    <section className="mx-auto max-w-3xl px-6 py-16" lang={lang}>
      <h1 className="border-l-4 border-blue-700 pl-5 text-3xl font-bold text-gray-900">
        {retry ? tx.errorTitle : tx.notFoundTitle}
      </h1>
      <p className="mt-5 text-base leading-7 text-gray-700">{retry ? tx.errorBody : tx.notFoundBody}</p>
      <div className="mt-7 flex flex-wrap gap-5">
        {retry ? (
          <button className="min-h-11 rounded-lg bg-blue-700 px-5 font-semibold text-white hover:bg-blue-800" onClick={retry} type="button">{tx.retry}</button>
        ) : null}
        <Link className="inline-flex min-h-11 items-center font-semibold text-blue-700 underline underline-offset-4" href={prefix || "/"}>{tx.home}</Link>
        <Link className="inline-flex min-h-11 items-center font-semibold text-blue-700 underline underline-offset-4" href={`${prefix}/calculator`}>{tx.calculator}</Link>
      </div>
    </section>
  );
}
