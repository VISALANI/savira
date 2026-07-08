"use client";
import Link from "next/link";

interface Props {
  variant?: "dark" | "light" | "gold";
  size?: "sm" | "md" | "lg";
  href?: string;
  className?: string;
}

/**
 * SAVIRA ATTIRES brand logo — SVG recreation of the mandala crown + wordmark.
 * variant "dark"  → sage green mandala, charcoal text  (on ivory/white bg)
 * variant "light" → white mandala + text               (on dark/sage bg)
 * variant "gold"  → gold mandala, white text            (on dark bg)
 */
export default function SaviraLogo({ variant = "dark", size = "md", href = "/", className = "" }: Props) {
  const sizes = { sm: 80, md: 110, lg: 150 };
  const w = sizes[size];

  const mandala = variant === "light" ? "#FFFFFF" : variant === "gold" ? "#C8A96B" : "#4F6F52";
  const textMain = variant === "light" ? "#FFFFFF" : variant === "gold" ? "#FFFFFF" : "#2E2E2E";
  const textSub = variant === "light" ? "rgba(255,255,255,0.75)" : variant === "gold" ? "#C8A96B" : "#4F6F52";

  const logo = (
    <svg
      width={w}
      viewBox="0 0 220 130"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="SAVIRA ATTIRES"
      role="img"
    >
      {/* ── Mandala / Lotus Crown ── */}
      <g stroke={mandala} strokeWidth="1.2" fill="none" strokeLinecap="round" strokeLinejoin="round">

        {/* Horizontal base line */}
        <line x1="42" y1="58" x2="178" y2="58" stroke={mandala} strokeWidth="1" />

        {/* Centre lotus petal */}
        <path d="M110 14 C104 26 104 42 110 52 C116 42 116 26 110 14Z" />

        {/* Inner arch */}
        <path d="M94 52 C94 38 101 28 110 24 C119 28 126 38 126 52" />

        {/* Second-tier petals */}
        <path d="M96 20 C88 30 86 44 90 54 C96 46 98 34 96 20Z" />
        <path d="M124 20 C132 30 134 44 130 54 C124 46 122 34 124 20Z" />

        {/* Third-tier petals */}
        <path d="M80 28 C70 36 68 50 72 58 C78 50 80 38 80 28Z" />
        <path d="M140 28 C150 36 152 50 148 58 C142 50 140 38 140 28Z" />

        {/* Outer wing petals */}
        <path d="M62 36 C52 40 48 52 52 60 C58 54 62 44 62 36Z" />
        <path d="M158 36 C168 40 172 52 168 60 C162 54 158 44 158 36Z" />

        {/* Far wing tips */}
        <path d="M46 44 C38 46 36 56 40 62 C46 56 48 48 46 44Z" />
        <path d="M174 44 C182 46 184 56 180 62 C174 56 172 48 174 44Z" />

        {/* Decorative dots — top centre arc */}
        <circle cx="110" cy="16" r="1.2" fill={mandala} />
        <circle cx="103" cy="19" r="1" fill={mandala} />
        <circle cx="117" cy="19" r="1" fill={mandala} />

        {/* Dot rows on outer petals */}
        <circle cx="72" cy="40" r="1" fill={mandala} />
        <circle cx="68" cy="46" r="1" fill={mandala} />
        <circle cx="148" cy="40" r="1" fill={mandala} />
        <circle cx="152" cy="46" r="1" fill={mandala} />

        {/* Inner semicircle detail */}
        <path d="M100 52 C100 44 104 40 110 40 C116 40 120 44 120 52" />
        <path d="M104 52 C104 46 107 43 110 43 C113 43 116 46 116 52" />

        {/* Small petal inside */}
        <path d="M107 36 C106 40 106 46 110 50 C114 46 114 40 113 36 C112 38 110 39 108 38Z" />

        {/* Dot clusters on mid petals */}
        <circle cx="90" cy="36" r="0.9" fill={mandala} />
        <circle cx="88" cy="42" r="0.9" fill={mandala} />
        <circle cx="130" cy="36" r="0.9" fill={mandala} />
        <circle cx="132" cy="42" r="0.9" fill={mandala} />

        {/* Outer dot row */}
        <circle cx="56" cy="50" r="0.9" fill={mandala} />
        <circle cx="54" cy="56" r="0.9" fill={mandala} />
        <circle cx="164" cy="50" r="0.9" fill={mandala} />
        <circle cx="166" cy="56" r="0.9" fill={mandala} />
      </g>

      {/* ── SAVIRA wordmark ── */}
      <text
        x="110"
        y="82"
        textAnchor="middle"
        fontFamily="'Playfair Display', 'Georgia', serif"
        fontSize="28"
        fontWeight="600"
        letterSpacing="3"
        fill={textMain}
      >
        SAVIRA
      </text>

      {/* ── ATTIRES subtext ── */}
      <text
        x="110"
        y="100"
        textAnchor="middle"
        fontFamily="'Poppins', 'Arial', sans-serif"
        fontSize="9"
        fontWeight="400"
        letterSpacing="6"
        fill={textSub}
      >
        ATTIRES
      </text>
    </svg>
  );

  if (!href) return <div className={className}>{logo}</div>;

  return (
    <Link href={href} className={`inline-block ${className}`} aria-label="SAVIRA ATTIRES — Home">
      {logo}
    </Link>
  );
}
