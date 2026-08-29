export default function OpenGraphBoundaryMark() {
  return (
    <svg
      aria-hidden="true"
      height="360"
      style={{ display: "flex", height: 360, width: 470 }}
      viewBox="0 0 470 360"
      width="470"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M 38 18 H 354 L 446 86 V 270 L 392 340 H 64 L 18 294 V 72 Z"
        data-boundary="shared"
        fill="#fffbeb"
        stroke="#d97706"
        strokeLinejoin="round"
        strokeWidth="3"
      />
      <g fill="#d97706">
        <circle cx="38" cy="18" r="5" />
        <circle cx="446" cy="86" r="5" />
        <circle cx="392" cy="340" r="5" />
        <circle cx="18" cy="294" r="5" />
      </g>
      <path
        d="M 65 180 H 405"
        fill="none"
        stroke="#d1d5db"
        strokeDasharray="2 14"
        strokeLinecap="round"
        strokeWidth="2"
      />
      <g data-path="formal">
        <path
          d="M 76 180 C 112 180 112 98 154 98 H 326 C 363 98 369 151 402 180"
          fill="none"
          stroke="#dc2626"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="7"
        />
        <g fill="#fffbeb" stroke="#dc2626" strokeWidth="3">
          <path d="M 168 126 V 86 C 168 72 179 61 193 61 C 207 61 218 72 218 86 V 126" />
          <path d="M 244 126 V 86 C 244 72 255 61 269 61 C 283 61 294 72 294 86 V 126" />
        </g>
        <g fill="#dc2626">
          <circle cx="193" cy="98" r="6" />
          <circle cx="269" cy="98" r="6" />
        </g>
      </g>
      <g data-path="adaptive">
        <path
          d="M 76 180 C 116 180 113 253 164 253 C 213 253 217 213 262 213 C 315 213 316 279 357 262 C 382 251 385 202 402 180"
          fill="none"
          stroke="#16a34a"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="7"
        />
        <path
          d="M 164 253 C 151 288 124 298 99 290 M 262 213 C 246 181 219 174 194 184 M 357 262 C 371 292 397 298 418 281"
          fill="none"
          stroke="#16a34a"
          strokeLinecap="round"
          strokeWidth="3"
        />
        <g fill="#fffbeb" stroke="#16a34a" strokeWidth="3">
          <circle cx="164" cy="253" r="8" />
          <circle cx="262" cy="213" r="8" />
          <circle cx="357" cy="262" r="8" />
          <circle cx="99" cy="290" r="5" />
          <circle cx="194" cy="184" r="5" />
          <circle cx="418" cy="281" r="5" />
        </g>
      </g>
      <g fill="#ffffff" stroke="#4b5563" strokeWidth="3">
        <path d="M 48 151 H 77 L 92 166 V 209 H 48 Z" />
        <path d="M 77 151 V 166 H 92" fill="none" />
      </g>
      <circle cx="76" cy="180" fill="#111827" r="6" />
      <g data-endpoint="decision-record">
        <circle cx="402" cy="180" fill="#ffffff" r="27" stroke="#2563eb" strokeWidth="4" />
        <path d="M 402 157 L 415 180 L 402 203 L 389 180 Z" fill="#dbeafe" stroke="#2563eb" strokeWidth="3" />
        <circle cx="402" cy="180" fill="#2563eb" r="5" />
      </g>
    </svg>
  );
}
