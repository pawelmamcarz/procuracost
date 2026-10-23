"use client";

import { m, useReducedMotion } from "motion/react";
import { useId } from "react";
import type { debateT } from "@/lib/i18n";

type Labels = (typeof debateT)["pl"];
const EASE = [0.22, 1, 0.36, 1] as const;

function Lock({ x, y, label }: { x: number; y: number; label: string }) {
  return (
    <g transform={`translate(${x} ${y})`} data-legal-lock="identical">
      <rect x="-14" y="-19" width="28" height="38" className="fill-amber-50 stroke-amber-400" strokeWidth="2" />
      <path d="M-5-3V-7a5 5 0 0 1 10 0v4M-7-3H7V8H-7ZM0 1V5" className="fill-none stroke-amber-800" strokeWidth="1.8" />
      <text y="40" textAnchor="middle" className="fill-amber-800 text-[15px]">{label}</text>
    </g>
  );
}

export default function BlueprintDiagram({ labels, phi, selected }: {
  labels: Labels;
  phi: string;
  selected: "tunnel" | "field" | "both";
}) {
  const id = useId().replace(/:/g, "");
  const reducedMotion = useReducedMotion();
  const terms = phi.slice(phi.indexOf("{") + 1, -1).split(", ");
  const draw = (delay = 0) => ({
    initial: { pathLength: 1 },
    whileInView: { pathLength: reducedMotion ? 1 : [0, 1] },
    viewport: { once: true, amount: 0.3 },
    transition: { duration: reducedMotion ? 0 : 0.9, delay: reducedMotion ? 0 : delay, ease: EASE },
  });
  const lane = (name: "tunnel" | "field") => ({
    initial: false as const,
    animate: { opacity: selected === "both" || selected === name ? 1 : 0.2 },
    transition: { duration: reducedMotion ? 0 : 0.5, ease: EASE },
  });

  function callout(number: number, x: number, y: number, line: string) {
    return (
      <m.a
        href={`#question-${number}`}
        aria-label={`${labels.diagram.question} ${number}`}
        className="group outline-blue-700"
        initial={{ opacity: 1 }}
        whileInView={{ opacity: reducedMotion ? 1 : [0, 1] }}
        viewport={{ once: true }}
        transition={{ duration: reducedMotion ? 0 : 0.5, delay: reducedMotion ? 0 : 1.1 + number * 0.08 }}
      >
        <path d={line} className="fill-none stroke-blue-600" strokeWidth="1.5" />
        <rect x={x - 28} y={y - 28} width="56" height="56" className="fill-transparent" />
        <circle cx={x} cy={y} r="16" className="fill-blue-700 group-hover:fill-blue-900" />
        <text x={x} y={y + 5} textAnchor="middle" className="fill-white font-mono text-[16px] font-semibold">{number}</text>
      </m.a>
    );
  }

  function token(x: number, y: number, dx: number, dy: number, delay: number, formal = false) {
    return (
      <m.g
        initial={{ x: dx, y: dy }}
        whileInView={{ x: reducedMotion ? dx : [0, dx * 0.35, dx * 0.7, dx], y: reducedMotion ? dy : [0, dy * 0.35, dy * 0.7, dy] }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: reducedMotion ? 0 : 0.9, delay: reducedMotion ? 0 : delay, ease: EASE }}
      >
        <rect x={x - 6} y={y - 8} width="12" height="16" rx="1" className={formal ? "fill-white stroke-red-700" : "fill-white stroke-green-700"} strokeWidth="2" />
        <path d={`M${x - 3} ${y - 3}h6m-6 5h6`} className={formal ? "stroke-red-700" : "stroke-green-700"} />
      </m.g>
    );
  }

  function defs(suffix: string) {
    return (
      <defs>
        <pattern id={`${id}-${suffix}`} width="24" height="24" patternUnits="userSpaceOnUse">
          <path d="M24 0H0V24" className="fill-none stroke-gray-200" strokeWidth="0.7" />
        </pattern>
        <marker id={`${id}-${suffix}-arrow`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M0 0L10 5L0 10" className="fill-none stroke-gray-500" strokeWidth="1.5" />
        </marker>
      </defs>
    );
  }

  return (
    <div key={selected} className="-mx-4 my-4 md:mx-0" data-blueprint="workflow">
      <svg viewBox="0 0 960 520" role="img" aria-labelledby={`${id}-desktop-title ${id}-desktop-desc`} className="hidden h-auto w-full md:block">
        <title id={`${id}-desktop-title`}>{labels.diagram.title}</title>
        <desc id={`${id}-desktop-desc`}>{labels.tunnelDescription} {labels.fieldDescription} {labels.caption}</desc>
        {defs("landscape")}
        <rect width="960" height="520" fill={`url(#${id}-landscape)`} />
        <path d="M34 32H925" markerEnd={`url(#${id}-landscape-arrow)`} className="stroke-gray-400" />
        <text x="36" y="28" className="fill-gray-600 font-mono text-[14px]">{labels.diagram.time}</text>
        <m.g {...lane("tunnel")} data-workflow-lane="tunnel">
          <text x="32" y="77" className="fill-red-700 text-[23px] font-bold">{labels.tunnel}</text>
          <text x="132" y="76" className="fill-gray-700 text-[23px] lg:text-[18px]">{labels.formal}</text>
          <path d="M32 113H927V216H32Z" className="fill-red-50 stroke-red-300" strokeWidth="3" />
          <path d="M32 105H927M32 224H927" className="stroke-red-300" strokeWidth="5" />
          <m.path {...draw()} d="M58 165H905" className="fill-none stroke-red-600" strokeWidth="3" markerEnd={`url(#${id}-landscape-arrow)`} />
          {[240, 415, 590].map((x, i) => (
            <g key={x}>
              <path d={`M${x} 114V148M${x} 182V216`} className="stroke-red-700" strokeWidth="5" />
              <rect x={x - 9} y="148" width="18" height="34" className="fill-white stroke-red-700" strokeWidth="2" />
              <text x={x} y="98" textAnchor="middle" className="fill-gray-700 stroke-white font-mono text-[23px] [paint-order:stroke] lg:text-[18px]" strokeWidth="6" strokeLinejoin="round">{labels.diagram.gates[i]}</text>
            </g>
          ))}
          {token(68, 165, 620, 0, 0.45, true)}
          <Lock x={790} y={165} label={labels.diagram.wait} />
          <circle cx="58" cy="165" r="5" className="fill-red-700" />
        </m.g>
        <m.g {...lane("field")} data-workflow-lane="field">
          <text x="32" y="270" className="fill-green-700 text-[23px] font-bold">{labels.field}</text>
          <text x="132" y="269" className="fill-gray-700 text-[23px] lg:text-[18px]">{labels.adaptive}</text>
          <path d="M32 302H926V478H32Z" className="fill-green-50 stroke-green-700" strokeWidth="2" data-boundary="shared" />
          <text x="48" y="319" className="fill-green-700 font-mono text-[16px]">∂Φ</text>
          <text x="240" y="296" className="fill-gray-700 font-mono text-[14px]">{terms[0]}</text>
          <text x="620" y="296" className="fill-gray-700 font-mono text-[14px]">{terms[1]}</text>
          <text x="240" y="498" className="fill-gray-700 font-mono text-[14px]">{terms[2]}</text>
          <text x="620" y="498" className="fill-gray-700 font-mono text-[14px]">{terms[3]}</text>
          <m.path {...draw(0.15)} d="M58 390H130L190 350H650L710 390H905M130 390H710M130 390L190 438H650L710 390" className="fill-none stroke-green-600" strokeWidth="2.5" markerEnd={`url(#${id}-landscape-arrow)`} />
          <path d="M190 368H495" className="stroke-green-300" strokeDasharray="3 5" />
          <text x="195" y="337" className="fill-green-700 text-[16px] font-semibold">{labels.diagram.standard}</text>
          {[0, 1, 2, 3, 4].map((n) => <g key={n}>{token(200 + n * 35, 350, 170, 0, 0.3 + n * 0.12)}{token(185 + n * 40, 438, 110, 0, 0.4 + n * 0.1)}</g>)}
          <path d="M420 390L442 368L464 390L442 412Z" className="fill-white stroke-blue-700" strokeWidth="2" />
          <m.path {...draw(0.4)} d="M464 390H590" className="stroke-blue-700" strokeWidth="4" />
          <circle cx="590" cy="390" r="27" className="fill-blue-700" />
          <circle cx="590" cy="390" r="21" className="fill-white" />
          <circle cx="590" cy="384" r="5" className="fill-none stroke-blue-700" strokeWidth="2" />
          <path d="M580 400Q590 385 600 400M436 381h12v18h-12ZM442 385v6m0 2v2" className="fill-none stroke-blue-700" strokeWidth="2" />
          <text x="530" y="465" textAnchor="middle" className="fill-blue-700 stroke-white text-[18px] font-semibold [paint-order:stroke]" strokeWidth="8" strokeLinejoin="round">{labels.diagram.exception}</text>
          <Lock x={790} y={390} label={labels.diagram.wait} />
          <circle cx="58" cy="390" r="5" className="fill-green-700" />
        </m.g>
        <text x="42" y="246" className="fill-gray-600 text-[14px]">{labels.diagram.start}</text>
        <text x="926" y="246" textAnchor="end" className="fill-gray-600 text-[14px]">{labels.diagram.finish}</text>
        {callout(3, 415, 56, "M415 72V89")}
        {callout(1, 330, 393, "M330 377V356")}
        {callout(2, 730, 465, "M714 465H690L611 407")}
        {callout(4, 905, 270, "M905 286V375")}
      </svg>
      <svg viewBox="0 0 320 1000" role="img" aria-labelledby={`${id}-mobile-title ${id}-mobile-desc`} className="h-auto w-full md:hidden">
        <title id={`${id}-mobile-title`}>{labels.diagram.title}</title>
        <desc id={`${id}-mobile-desc`}>{labels.tunnelDescription} {labels.fieldDescription} {labels.caption}</desc>
        {defs("portrait")}
        <rect width="320" height="1000" fill={`url(#${id}-portrait)`} />
        <m.g {...lane("tunnel")} data-workflow-lane="tunnel">
          <text x="18" y="40" className="fill-red-700 text-[25px] font-bold">{labels.tunnel}</text>
          <text x="18" y="68" className="fill-gray-700 text-[16px]">{labels.formal}</text>
          <path d="M46 87H126V425H46Z" className="fill-red-50 stroke-red-300" strokeWidth="3" />
          <m.path {...draw()} d="M86 100V410" className="stroke-red-600" strokeWidth="3" markerEnd={`url(#${id}-portrait-arrow)`} />
          {[145, 220, 295].map((y, i) => (
            <g key={y}>
              <path d={`M46 ${y}H73M99 ${y}H126`} className="stroke-red-700" strokeWidth="4" />
              <rect x="73" y={y - 7} width="26" height="14" className="fill-white stroke-red-700" strokeWidth="2" />
              <text x="146" y={y + 5} className="fill-gray-700 font-mono text-[16px]">{labels.diagram.gates[i]}</text>
            </g>
          ))}
          {token(86, 105, 0, 224, 0.5, true)}
          <Lock x={86} y={365} label="" />
          <text x="146" y="370" className="fill-amber-800 text-[16px]">{labels.diagram.wait}</text>
        </m.g>
        <path d="M17 90V421" markerEnd={`url(#${id}-portrait-arrow)`} className="stroke-gray-400" />
        {callout(3, 283, 95, "M283 111V125H128")}
        <m.g {...lane("field")} data-workflow-lane="field">
          <text x="18" y="473" className="fill-green-700 text-[25px] font-bold">{labels.field}</text>
          <text x="18" y="499" className="fill-gray-700 text-[16px]">{labels.adaptive}</text>
          <rect x="16" y="530" width="288" height="425" className="fill-green-50 stroke-green-700" strokeWidth="2" data-boundary="shared" />
          <text x="38" y="551" className="fill-green-700 font-mono text-[17px]">∂Φ</text>
          <text x="173" y="524" textAnchor="middle" className="fill-gray-700 font-mono text-[16px]">{terms[0]}</text>
          <text x="282" y="680" textAnchor="middle" transform="rotate(-90 282 680)" className="fill-gray-700 font-mono text-[16px]">{terms[1]}</text>
          <text x="173" y="978" textAnchor="middle" className="fill-gray-700 font-mono text-[16px]">{terms[3]}</text>
          <text x="34" y="760" textAnchor="middle" transform="rotate(-90 34 760)" className="fill-gray-700 font-mono text-[16px]">{terms[2]}</text>
          <m.path {...draw(0.1)} d="M86 560V590L52 620V785L86 820V927M86 590V820M86 590L120 620V785L86 820" className="fill-none stroke-green-600" strokeWidth="2.5" markerEnd={`url(#${id}-portrait-arrow)`} />
          {[0, 1, 2, 3].map((n) => <g key={n}>{token(52, 620 + n * 25, 0, 70, 0.3 + n * 0.12)}{token(86, 615 + n * 25, 0, 70, 0.4 + n * 0.12)}</g>)}
          <text x="141" y="594" className="fill-green-700 text-[16px] font-semibold">
            {labels.diagram.standardLines.map((line, i) => <tspan x="141" dy={i === 0 ? 0 : 22} key={line}>{line}</tspan>)}
          </text>
          <path d="M120 716L135 731L120 746L105 731ZM135 731H205" className="fill-white stroke-blue-700" strokeWidth="2" />
          <path d="M115 723h10v16h-10ZM120 726v5m0 2v2" className="fill-none stroke-blue-700" strokeWidth="1.5" data-token="exception" />
          <circle cx="226" cy="731" r="21" className="fill-white stroke-blue-700" strokeWidth="3" />
          <circle cx="226" cy="725" r="5" className="fill-none stroke-blue-700" strokeWidth="2" />
          <path d="M216 742Q226 728 236 742" className="fill-none stroke-blue-700" strokeWidth="2" />
          <text x="147" y="790" className="fill-blue-700 text-[16px] font-semibold">
            {labels.diagram.exceptionLines.map((line, i) => <tspan x="147" dy={i === 0 ? 0 : 22} key={line}>{line}</tspan>)}
          </text>
          <Lock x={86} y={876} label="" />
          <text x="124" y="881" className="fill-amber-800 text-[16px]">{labels.diagram.wait}</text>
        </m.g>
        {callout(1, 265, 562, "M249 562H229V580")}
        {callout(2, 228, 684, "M228 700V710")}
        {callout(4, 265, 926, "M249 926H105")}
      </svg>
    </div>
  );
}
