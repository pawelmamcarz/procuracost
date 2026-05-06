"use client";

export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 print:hidden"
    >
      <svg
        className="h-4 w-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.75 19.77m10.56-5.941l-.001 5.94M10.5 8.5h3M10.5 12h3M12 3v1m0 16v1m8.485-9H21M3 12H2.515M6.343 6.343l-.707-.707M17.657 6.343l.707-.707M6.343 17.657l-.707.707M17.657 17.657l.707.707"
        />
      </svg>
      Print / Save as PDF
    </button>
  );
}
