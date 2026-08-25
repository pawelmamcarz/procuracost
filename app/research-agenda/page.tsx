import Link from "next/link";
import { MODEL_VERSION } from "@/lib/version";

export const metadata = {
  title: `Agenda badawcza ${MODEL_VERSION}: ProcuraCost`,
  description: `Agenda empirycznej walidacji neutralnego modelu ProcuraCost ${MODEL_VERSION}.`,
};

export default function ResearchAgendaPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <p className="text-sm font-semibold text-blue-700">Agenda badawcza · Model {MODEL_VERSION}</p>
      <h1 className="mt-2 text-3xl font-bold">Waliduj mechanizmy przed ich wyceną</h1>
      <p className="mt-4 text-gray-700">
        ProcuraCost jest przejrzystym modelem decyzyjnym, a nie zmierzonym efektem.
        Program empiryczny zaczyna się od oddzielnego pomiaru przebiegu pracy,
        konkurencji i konstrukcji kontraktu. Narzędzia badawcze wymagają przeglądu
        przed zbieraniem danych.
      </p>

      <section className="mt-10 space-y-6">
        <div>
          <h2 className="text-xl font-semibold">Priorytety pomiaru</h2>
          <ul className="mt-3 list-disc space-y-2 pl-6 text-gray-700">
            <li>Przebieg pracy: znaczniki czasu, praca równoległa i godziny pracy według ról.</li>
            <li>Konkurencja: udział oferentów, kwalifikacja i benchmarki cenowe.</li>
            <li>Konstrukcja kontraktu: adaptowalność na poziomie klauzul i aneksy.</li>
            <li>Wyniki: opóźnienie, efekty w cyklu życia, obejścia i ustalenia audytowe.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold">Reguła identyfikacji</h2>
          <p className="mt-3 text-gray-700">
            Oszacuj wyniki składowe oddzielnie przed przeliczeniem ich na pieniądze.
            Porównuj zgodne z prawem ścieżki w tych samych granicach ładu i kontroli,
            kontroluj złożoność zakupu i zachowuj możliwość odwrócenia znaku. Nie
            kalibruj danych tak, aby odtwarzały tezę Tunel–Pole.
          </p>
        </div>

        <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
          <h2 className="font-semibold text-amber-950">Aktualny status</h2>
          <p className="mt-2 text-sm text-amber-900">
            {`Nie zatwierdzono jeszcze ankiety dla modelu ${MODEL_VERSION}, prerejestracji ani protokołu konfirmacyjnego. Nowe narzędzia muszą wynikać z rozdzielonych konstruktów i przejść przegląd przed rekrutacją lub pozyskaniem danych.`}
          </p>
        </div>
      </section>

      <div className="mt-10 flex flex-wrap gap-3">
        <Link href="/research" className="rounded-lg bg-blue-700 px-5 py-3 text-sm font-semibold text-white">Artykuł naukowy</Link>
        <Link href="/methodology" className="rounded-lg border px-5 py-3 text-sm font-semibold">Metodologia</Link>
        <Link href="/model/assumptions" className="rounded-lg border px-5 py-3 text-sm font-semibold">Zakresy scenariuszy</Link>
      </div>
    </main>
  );
}
