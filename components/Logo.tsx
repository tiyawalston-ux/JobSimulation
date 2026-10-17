// Day One logo: a sun rising over the horizon.
export function LogoMark({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <rect width="32" height="32" rx="10" fill="#fbd9c2" />
      <path d="M8 21a8 8 0 0 1 16 0z" fill="#f08a4b" />
      <path d="M16 7.5v2.5M8.6 10.6l1.7 1.7M23.4 10.6l-1.7 1.7" stroke="#f08a4b" strokeWidth="2" strokeLinecap="round" />
      <rect x="6" y="21" width="20" height="2.4" rx="1.2" fill="#2b2a33" />
    </svg>
  );
}

export default function Logo() {
  return (
    <span className="logo">
      <LogoMark />
      <span>Day One</span>
    </span>
  );
}
