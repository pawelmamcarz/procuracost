import { homeT, type Lang } from "@/lib/i18n";

interface BoundaryFieldProps {
  lang: Lang;
}

export default function BoundaryField({ lang }: BoundaryFieldProps) {
  const tx = homeT[lang].boundary;
  const titleId = `home-topology-title-${lang}`;
  const descriptionId = `home-topology-description-${lang}`;

  return (
    <figure className="mt-7 max-w-4xl" data-home-topology={lang}>
      <div className="flex flex-col gap-2 border-y border-amber-300 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
        <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.14em] text-amber-800">
          <span className="h-px w-8 shrink-0 bg-amber-500" aria-hidden="true" />
          {tx.boundaryLabel}
        </p>
        <p className="break-words font-mono text-[11px] leading-relaxed text-gray-600 sm:text-right sm:text-xs">
          {tx.notation}
        </p>
      </div>

      <svg
        aria-labelledby={`${titleId} ${descriptionId}`}
        className="pointer-events-none mt-5 h-auto w-full max-w-full"
        focusable="false"
        role="img"
        viewBox="0 0 760 360"
        xmlns="http://www.w3.org/2000/svg"
      >
        <title id={titleId}>{tx.title}</title>
        <desc id={descriptionId}>
          {tx.caption} {tx.tunnelDescription} {tx.fieldDescription}
        </desc>

        <g data-scope="shared">
          <path
            className="fill-amber-50/40 stroke-amber-500"
            d="M52 28H666L724 86V274L666 332H52L24 304V56Z"
            data-boundary="shared"
            strokeLinejoin="round"
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
          />
          <g className="fill-amber-500" aria-hidden="true">
            <circle cx="52" cy="28" r="3" />
            <circle cx="724" cy="86" r="3" />
            <circle cx="666" cy="332" r="3" />
            <circle cx="24" cy="304" r="3" />
          </g>

          <path
            aria-hidden="true"
            className="fill-none stroke-gray-300"
            d="M132 180H648"
            strokeDasharray="1 12"
            strokeLinecap="round"
            strokeWidth="1.5"
            vectorEffect="non-scaling-stroke"
          />

          <g aria-hidden="true" data-origin="procurement-brief">
            <path
              className="fill-white stroke-gray-500"
              d="M70 146H112L130 164V214H70Z"
              strokeLinejoin="round"
              strokeWidth="2"
              vectorEffect="non-scaling-stroke"
            />
            <path
              className="fill-none stroke-gray-500"
              d="M112 146V164H130M84 177H112M84 190H105"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              vectorEffect="non-scaling-stroke"
            />
            <circle className="fill-gray-900" cx="132" cy="180" r="4" />
          </g>

          <g
            data-converges-at="navigator"
            data-geometry="sequential-gates"
            data-path="formal"
          >
            <path
              className="fill-none stroke-red-600"
              d="M132 180C160 180 164 112 202 112H584C618 112 624 154 648 180"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="4"
              vectorEffect="non-scaling-stroke"
            />
            <g className="fill-amber-50 stroke-red-600" aria-hidden="true">
              <path d="M238 138V99L250 87L262 99V138" strokeLinejoin="round" strokeWidth="2.5" vectorEffect="non-scaling-stroke" />
              <path d="M330 138V99L342 87L354 99V138" strokeLinejoin="round" strokeWidth="2.5" vectorEffect="non-scaling-stroke" />
              <path d="M422 138V99L434 87L446 99V138" strokeLinejoin="round" strokeWidth="2.5" vectorEffect="non-scaling-stroke" />
              <path d="M514 138V99L526 87L538 99V138" strokeLinejoin="round" strokeWidth="2.5" vectorEffect="non-scaling-stroke" />
            </g>
            <g className="fill-red-600" aria-hidden="true">
              <circle cx="250" cy="112" r="4" />
              <circle cx="342" cy="112" r="4" />
              <circle cx="434" cy="112" r="4" />
              <circle cx="526" cy="112" r="4" />
            </g>
          </g>

          <g
            data-converges-at="navigator"
            data-geometry="branch-and-rejoin"
            data-path="adaptive"
          >
            <path
              className="fill-none stroke-green-600"
              d="M132 180C162 180 168 242 216 242"
              strokeLinecap="round"
              strokeWidth="4"
              vectorEffect="non-scaling-stroke"
            />
            <path
              className="fill-none stroke-green-600"
              d="M216 242C258 242 264 202 312 202C358 202 362 222 408 222C454 222 460 200 506 200C550 200 566 234 598 234"
              data-rejoins-at="adaptive-junction"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="3"
              vectorEffect="non-scaling-stroke"
            />
            <path
              className="fill-none stroke-green-600"
              d="M216 242C262 242 270 292 330 292H416C468 292 482 244 536 244C560 244 574 234 598 234"
              data-rejoins-at="adaptive-junction"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="3"
              vectorEffect="non-scaling-stroke"
            />
            <path
              className="fill-none stroke-green-600"
              d="M598 234C624 234 630 198 648 180"
              data-segment="adaptive-to-navigator"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="3"
              vectorEffect="non-scaling-stroke"
            />
            <g className="fill-amber-50 stroke-green-600" aria-hidden="true">
              <circle cx="216" cy="242" r="6" strokeWidth="2" vectorEffect="non-scaling-stroke" />
              <circle cx="312" cy="202" r="5" strokeWidth="2" vectorEffect="non-scaling-stroke" />
              <circle cx="408" cy="222" r="5" strokeWidth="2" vectorEffect="non-scaling-stroke" />
              <circle cx="506" cy="200" r="5" strokeWidth="2" vectorEffect="non-scaling-stroke" />
              <circle cx="330" cy="292" r="5" strokeWidth="2" vectorEffect="non-scaling-stroke" />
              <circle cx="416" cy="292" r="5" strokeWidth="2" vectorEffect="non-scaling-stroke" />
              <circle cx="536" cy="244" r="5" strokeWidth="2" vectorEffect="non-scaling-stroke" />
              <circle
                cx="598"
                cy="234"
                data-junction="adaptive-rejoin"
                r="6"
                strokeWidth="2"
                vectorEffect="non-scaling-stroke"
              />
            </g>
          </g>

          <g aria-hidden="true" data-endpoint="navigator">
            <path
              className="fill-blue-50 stroke-blue-600"
              d="M648 151L677 180L648 209L619 180Z"
              strokeLinejoin="round"
              strokeWidth="3"
              vectorEffect="non-scaling-stroke"
            />
            <circle className="fill-white stroke-blue-600" cx="648" cy="180" r="11" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
            <path className="fill-blue-600" d="M648 164L654 180L648 177L642 180Z" />
            <circle className="fill-blue-600" cx="648" cy="180" r="2.5" />
          </g>
        </g>
      </svg>

      <div className="mt-5 grid gap-4 border-t border-gray-200 pt-5 sm:grid-cols-2 sm:gap-8">
        <div className="flex gap-3">
          <span className="mt-2.5 h-0.5 w-9 shrink-0 bg-red-600" aria-hidden="true" />
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-red-700">
              {tx.tunnelLabel}
            </p>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              {tx.tunnelDescription}
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <span className="mt-2.5 h-0.5 w-9 shrink-0 bg-green-600" aria-hidden="true" />
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-green-700">
              {tx.fieldLabel}
            </p>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              {tx.fieldDescription}
            </p>
          </div>
        </div>
      </div>

      <figcaption className="mt-5 max-w-3xl border-l-2 border-amber-400 pl-4 text-xs leading-relaxed text-gray-600">
        {tx.caption}
      </figcaption>
    </figure>
  );
}
