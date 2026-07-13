import Link from "next/link";

export const metadata = {
  title: "Metodologia modelu 2.0 | ProcuraCost",
  description: "Neutralny model porównawczy z jawnym zakresem niepewności.",
};

export default function MethodologyPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8 px-6 py-10">
      <header>
        <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">Model 2.0</p>
        <h1 className="mt-1 text-2xl font-bold text-gray-900">Metodologia bez zaszytego zwycięzcy</h1>
        <p className="mt-2 text-sm text-gray-600">
          Porównujemy ścieżkę formalną/sekwencyjną z adaptacyjną/zgodną. Obie zachowują te same
          granice prawne, konkurencyjne, etyczne i dokumentacyjne.
        </p>
      </header>

      <section>
        <h2 className="font-bold text-gray-900">Pięć odrębnych konstrukcji</h2>
        <p className="mt-2 text-sm text-gray-600">
          Model nie utożsamia już formalności z konkurencją, sztywnością kontraktu, kontrolą systemową
          ani dyskrecją. Każdy mechanizm ma osobny parametr i osobne zastrzeżenie dowodowe.
        </p>
      </section>

      <section>
        <h2 className="font-bold text-gray-900">Siedem wymiarów kosztu</h2>
        <ol className="mt-2 list-decimal space-y-2 pl-5 text-sm text-gray-600">
          <li>praca zespołu na poziomie czynności i ról;</li>
          <li>koordynacja i koszt tej samej technologii dla obu ścieżek;</li>
          <li>zwłoka wyceniana kosztem bezczynności podanym przez użytkownika;</li>
          <li>ryzyko wyboru dostawcy zależne od skuteczności konkurencji;</li>
          <li>renegocjacja zależna od sztywności kontraktu, nie workflow;</li>
          <li>scenariuszowa pula wartości TCO i zdolność jej przechwycenia;</li>
          <li>scenariuszowa stopa obejść, a nie prognoza z arbitralnej sigmoidy.</li>
        </ol>
      </section>

      <section className="rounded-xl border border-amber-200 bg-amber-50 p-4">
        <h2 className="font-bold text-amber-900">Jak czytać zakres</h2>
        <p className="mt-2 text-sm text-amber-800">
          Wynik centralny ma przedział niskiego i wysokiego ΔC. To stres-test założeń, nie przedział
          ufności. Przecięcie zera oznacza, że model nie wskazuje odpornego zwycięzcy.
        </p>
      </section>

      <section>
        <h2 className="font-bold text-gray-900">Granica PZP</h2>
        <p className="mt-2 text-sm text-gray-600">
          Adaptacyjna ścieżka publiczna zawsze pozostaje legalnym wariantem w PZP. Optymalizator uwzględnia
          próg 170 000 PLN od 1.01.2026 oraz właściwy próg UE zależny od przedmiotu i zamawiającego.
        </p>
      </section>

      <p className="text-sm"><Link href="/research" className="font-medium text-blue-600 hover:underline">Pełny working paper i zweryfikowana bibliografia →</Link></p>
    </div>
  );
}
