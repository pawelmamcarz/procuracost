import PrintButton from "./PrintButton";
import { comparisonT } from "@/lib/i18n";
import { MODEL_VERSION } from "@/lib/version";

export const metadata = {
  title: "Procedural Rigidity and Adaptive Procurement | ProcuraCost",
  description: `Corrected working paper for the neutral ProcuraCost ${MODEL_VERSION} decision model.`,
};

const references = [
  "Szucs, F. (2024). Discretion and Favoritism in Public Procurement. JEEA, 22(1), 117–160. DOI: 10.1093/jeea/jvad017.",
  "Beuve, J., Moszoro, M. W., & Spiller, P. T. (2023). Doing It by the Book: Political Contestability and Public Contract Renegotiations. JLEO, 39(1), 281–308. DOI: 10.1093/jleo/ewab039.",
  "Coviello, D., & Mariniello, M. (2014). Publicity Requirements in Public Procurement. Journal of Public Economics, 109, 76–100.",
  "European Commission (2011). Public Procurement in Europe: Cost and Effectiveness.",
  "Fazekas, M., & Blum, J. R. (2021). Improving Public Procurement Outcomes. World Bank WPS 9690.",
  "Holmström, B., & Milgrom, P. (1991). Multitask Principal–Agent Analyses. JLEO, 7, 24–52.",
  "Lipsky, M. (1980). Street-Level Bureaucracy. Russell Sage Foundation.",
  "Vaughan, D. (1996). The Challenger Launch Decision. University of Chicago Press.",
];

export default function ResearchPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-10 print:max-w-none print:px-0">
      <div className="mb-8 flex items-center justify-between print:hidden">
        <div>
          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
            Working paper · ProcuraCost {MODEL_VERSION}
          </span>
          <p className="mt-2 text-xs text-gray-500">Corrected evidence and model specification · 27 July 2026</p>
        </div>
        <PrintButton />
      </div>

      <article className="prose prose-sm max-w-none text-gray-800">
        <h1>Procedural Rigidity and Adaptive Procurement: A Transparent Decision Model</h1>

        <h2>Abstract</h2>
        <p>
          Procurement policy, workflow, competition, and contract design are related but distinct.
          ProcuraCost {MODEL_VERSION} corrects an earlier model that collapsed them into one rigidity index and
          therefore overstated what the cited literature supported. The revised model compares a
          formal/sequential path with an adaptive/compliant path under the same legal and governance
          boundary. It reports a central estimate and a wide scenario interval that may favor either path.
        </p>
        <p>
          The Tunnel–Field proposition remains a conditional hypothesis: adaptability is valuable when
          avoidable delay and adaptation costs exceed the governance value of formal competition and
          control. It is not a universal empirical finding.
        </p>

        <h2>What changed</h2>
        <ul>
          <li>Competition effectiveness, contractual rigidity, workflow burden, TCO capture, and bypass are separate constructs.</li>
          <li>Public-sector comparisons stay inside PZP; an adaptive path is not a lawful-exemption shortcut.</li>
          <li>The unsupported 10%-per-year / 30% TCO rule and invented bypass sigmoid are removed.</li>
          <li>Tool cost is equal when both paths use the same technology.</li>
          <li>Mandatory PZP publication and standstill periods remain identical in both paths.</li>
          <li>Weak quantities appear as broad scenarios, not precise predictions or confidence intervals.</li>
          <li>The combined uncertainty envelope crosses zero in all ten fixed reference scenarios.</li>
        </ul>

        <h2>Evidence corrections</h2>
        <p>
          <strong>Szucs (2024)</strong> studies Hungarian public procurement with substantial sorting
          around a value threshold of about 25 million HUF. The structural estimates report roughly a 6%
          price effect and about 10% lower average contractor total factor productivity under discretion;
          the invalid raw discontinuity reports roughly 32%. The model monetizes price only; adding
          productivity again would require an unsupported conversion and risk double counting. Because the
          effect is identified below that threshold, transferring it to EU-threshold procurement is a
          scenario rather than a measurement.
        </p>
        <p>
          <strong>Beuve, Moszoro, and Spiller (2023)</strong> estimate contractual rather than procedural rigidity
          using 2SLS/IV in French car-park contracts. Their 0.077–0.105 result is an increase in formal
          amendments per contract-year for a simultaneous one-standard-deviation increase in each of seven
          rigidity categories, not an event probability. ProcuraCost&apos;s 0–1 profile has no empirical
          conversion to that shift, so the coefficient is a calibration assumption with an external
          order-of-magnitude anchor, not a transferred estimate.
        </p>
        <p>
          Theory from Lipsky, Vaughan, and Holmström–Milgrom supports possible workaround mechanisms but
          supplies no bypass probability. Practitioner case studies motivate mechanisms only; they do not
          identify causal effects and are not evidence about Polish public-procurement law.
        </p>

        <h2>Seven-dimension model</h2>
        <p><code>ΔC = C_formal − C_adaptive = Σ ΔC_i</code></p>
        <ol>
          <li><strong>Staff effort:</strong> total activity hours by role and loaded rate; headcount is descriptive.</li>
          <li><strong>Administration:</strong> non-labor overhead on active days plus equal technology cost.</li>
          <li><strong>Delay:</strong> elapsed days times user-supplied cost of inaction.</li>
          <li><strong>Selection risk:</strong> price-premium scenario times residual competition risk.</li>
          <li><strong>Formal amendments:</strong> annual contract-rigidity frequency times event cost and a discounted annuity factor.</li>
          <li><strong>TCO:</strong> a three-year cumulative pool converted to a discounted annual flow; central pool is zero.</li>
          <li><strong>Bypass:</strong> scenario rate times user-supplied exposure and system controls.</li>
        </ol>

        <h2>Interpretation</h2>
        <p>
          A positive ΔC favors the adaptive path; a negative value favors the formal path. If the displayed
          scenario interval crosses zero, assumptions determine the winner. If it does not, the sign is stable
          only within the declared bounds; it is not statistically proven.
        </p>
        <p>
          {comparisonT.en.breakEvenGeneral}
        </p>
        <p>
          Formality can dominate when delay is cheap, competition materially constrains favoritism, requirements
          are stable, and adaptive governance capability is weak. Adaptability can dominate when delay is costly,
          competition is preserved, and requirements or contracts must evolve as information arrives.
        </p>

        <h2>Legal boundary</h2>
        <p>
          From 1 January 2026, the Polish PZP application threshold is 170,000 PLN net. The optimizer uses the
          applicable 2026–2027 EU threshold according to procurement object and authority level: 603,400 PLN,
          930,960 PLN, or 23,291,240 PLN. In the national band, Arts. 266 and 275 restrict the default
          recommendation to the basic mode. At or above the EU threshold, the default filter offers only
          open and restricted tender under Art. 129(2); special procedures require a separate assessment
          of statutory grounds. The tool is illustrative and is not legal advice.
        </p>

        <h2>References</h2>
        <ul>{references.map((reference) => <li key={reference}>{reference}</li>)}</ul>

        <p className="border-t pt-4 text-xs text-gray-500">
          Full formulas, scenario bounds, and validation rules are maintained in the repository&apos;s
          <code> RESEARCH.md</code> and <code>docs/MODEL_PARAMETERS.md</code>.
        </p>
      </article>
    </div>
  );
}
