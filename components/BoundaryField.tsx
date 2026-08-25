import { homeT, type Lang } from "@/lib/i18n";

interface BoundaryFieldProps {
  lang: Lang;
}

export default function BoundaryField({ lang }: BoundaryFieldProps) {
  const tx = homeT[lang].boundary;
  const titleId = `boundary-visual-title-${lang}`;
  const descriptionId = `boundary-visual-desc-${lang}`;

  return (
    <section aria-labelledby="boundary-field-title" className="border-b border-gray-200 py-12 sm:py-16">
      <p className="text-xs font-semibold uppercase tracking-wide text-amber-600">
        {tx.eyebrow}
      </p>
      <h2 id="boundary-field-title" className="mt-3 max-w-2xl text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
        {tx.title}
      </h2>

      <figure className="mt-8 max-w-5xl">
        <div className="flex flex-col gap-2 border-b border-amber-300 pb-4 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
          <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-wide text-amber-700">
            <span className="h-px w-8 bg-amber-500" aria-hidden="true" />
            {tx.boundaryLabel}
          </p>
          <p className="max-w-2xl break-words font-mono text-[11px] leading-relaxed text-gray-700 sm:text-right sm:text-xs">
            {tx.notation}
          </p>
        </div>

        <svg
          aria-labelledby={`${titleId} ${descriptionId}`}
          className="mt-5 h-auto w-full max-w-full"
          focusable="false"
          role="img"
          viewBox="0 0 760 360"
          xmlns="http://www.w3.org/2000/svg"
        >
          <title id={titleId}>{tx.title}</title>
          <desc id={descriptionId}>
            {tx.caption} {tx.tunnelDescription}. {tx.fieldDescription}.
          </desc>

          <g data-scope="shared">
            <path
              className="fill-amber-50 stroke-amber-500"
              d="M76 34H600L718 106V248L652 326H112L40 260V96Z"
              data-boundary="shared"
              strokeLinejoin="round"
              strokeWidth="2"
              vectorEffect="non-scaling-stroke"
            />

            <g className="fill-amber-500" aria-hidden="true">
              <circle cx="76" cy="34" r="3" />
              <circle cx="718" cy="106" r="3" />
              <circle cx="652" cy="326" r="3" />
              <circle cx="40" cy="260" r="3" />
            </g>

            <path
              aria-hidden="true"
              className="stroke-gray-300"
              d="M102 180H668"
              strokeDasharray="1 12"
              strokeLinecap="round"
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
            />

            <g aria-hidden="true">
              <path
                className="fill-white stroke-gray-500"
                d="M78 151H116L132 167V209H78Z"
                strokeLinejoin="round"
                strokeWidth="2"
                vectorEffect="non-scaling-stroke"
              />
              <path
                className="fill-none stroke-gray-500"
                d="M116 151V167H132M91 179H117M91 191H111"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                vectorEffect="non-scaling-stroke"
              />
              <circle className="fill-gray-900" cx="132" cy="180" r="4" />
            </g>

            <g data-converges-at="navigator" data-geometry="sequential" data-path="formal">
              <path
                className="fill-none stroke-red-600"
                d="M132 180C158 180 162 112 196 112H590C624 112 632 150 660 180"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="4"
                vectorEffect="non-scaling-stroke"
              />
              <g className="fill-amber-50 stroke-red-600" aria-hidden="true">
                <path d="M232 139V101C232 89 242 79 254 79H258C270 79 280 89 280 101V139" strokeLinejoin="round" strokeWidth="2.5" vectorEffect="non-scaling-stroke" />
                <path d="M326 139V101C326 89 336 79 348 79H352C364 79 374 89 374 101V139" strokeLinejoin="round" strokeWidth="2.5" vectorEffect="non-scaling-stroke" />
                <path d="M420 139V101C420 89 430 79 442 79H446C458 79 468 89 468 101V139" strokeLinejoin="round" strokeWidth="2.5" vectorEffect="non-scaling-stroke" />
                <path d="M514 139V101C514 89 524 79 536 79H540C552 79 562 89 562 101V139" strokeLinejoin="round" strokeWidth="2.5" vectorEffect="non-scaling-stroke" />
              </g>
              <g className="fill-red-600" aria-hidden="true">
                <circle cx="256" cy="112" r="4" />
                <circle cx="350" cy="112" r="4" />
                <circle cx="444" cy="112" r="4" />
                <circle cx="538" cy="112" r="4" />
              </g>
            </g>

            <g data-converges-at="navigator" data-geometry="branching" data-path="adaptive">
              <path
                className="fill-none stroke-green-600"
                d="M132 180C176 180 174 246 226 246C286 246 286 214 344 214C410 214 406 270 472 270C534 270 544 224 594 224C624 224 638 192 660 180"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="4"
                vectorEffect="non-scaling-stroke"
              />
              <g className="fill-none stroke-green-600" aria-hidden="true">
                <path d="M226 246C219 277 196 291 169 293" strokeLinecap="round" strokeWidth="2" vectorEffect="non-scaling-stroke" />
                <path d="M344 214C332 185 306 174 278 179" strokeLinecap="round" strokeWidth="2" vectorEffect="non-scaling-stroke" />
                <path d="M472 270C479 298 505 307 532 299" strokeLinecap="round" strokeWidth="2" vectorEffect="non-scaling-stroke" />
                <path d="M594 224C590 198 570 187 546 190" strokeLinecap="round" strokeWidth="2" vectorEffect="non-scaling-stroke" />
              </g>
              <g className="fill-amber-50 stroke-green-600" aria-hidden="true">
                <circle cx="226" cy="246" r="5" strokeWidth="2" vectorEffect="non-scaling-stroke" />
                <circle cx="344" cy="214" r="5" strokeWidth="2" vectorEffect="non-scaling-stroke" />
                <circle cx="472" cy="270" r="5" strokeWidth="2" vectorEffect="non-scaling-stroke" />
                <circle cx="594" cy="224" r="5" strokeWidth="2" vectorEffect="non-scaling-stroke" />
                <circle cx="169" cy="293" r="3" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
                <circle cx="278" cy="179" r="3" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
                <circle cx="532" cy="299" r="3" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
                <circle cx="546" cy="190" r="3" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
              </g>
            </g>

            <g aria-hidden="true" data-endpoint="navigator">
              <circle className="fill-white stroke-blue-600" cx="660" cy="180" r="23" strokeWidth="3" vectorEffect="non-scaling-stroke" />
              <path className="fill-blue-50 stroke-blue-600" d="M660 161L669 180L660 199L651 180Z" strokeLinejoin="round" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
              <path className="fill-blue-600" d="M660 161L669 180L660 177Z" />
              <circle className="fill-blue-600" cx="660" cy="180" r="3" />
            </g>
          </g>
        </svg>

        <div className="mt-5 grid gap-4 sm:grid-cols-2 sm:gap-8">
          <div className="flex gap-3">
            <span className="mt-2.5 h-0.5 w-9 shrink-0 bg-red-600" aria-hidden="true" />
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-red-700">
                {tx.tunnelLabel}
              </p>
              <p className="mt-1 text-sm text-gray-600">{tx.tunnelDescription}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <span className="mt-2.5 h-0.5 w-9 shrink-0 bg-green-600" aria-hidden="true" />
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-green-700">
                {tx.fieldLabel}
              </p>
              <p className="mt-1 text-sm text-gray-600">{tx.fieldDescription}</p>
            </div>
          </div>
        </div>

        <figcaption className="mt-5 max-w-3xl border-l-2 border-amber-400 pl-4 text-xs leading-relaxed text-gray-500">
          {tx.caption}
        </figcaption>
      </figure>
    </section>
  );
}
