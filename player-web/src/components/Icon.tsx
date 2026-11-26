import type { ReactNode, SVGProps } from 'react';

const paths: Record<string, ReactNode> = {
  home: (
    <>
      <path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-4.5v-6h-5v6H5a1 1 0 0 1-1-1Z" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4.5 4.5" />
    </>
  ),
  library: (
    <>
      <rect x="3.5" y="4" width="4" height="16" rx="1" />
      <rect x="9.5" y="4" width="4" height="16" rx="1" />
      <path d="m16.4 5.6 3.7 1.3-3.3 12.3-3.7-1.3z" />
    </>
  ),
  heart: (
    <path d="M12 20.2C12 20.2 4.4 15.4 4.4 10.5A4.2 4.2 0 0 1 12 7.5a4.2 4.2 0 0 1 7.6 3c0 4.9-7.6 9.7-7.6 9.7Z" />
  ),
  heartFilled: (
    <path
      d="M12 20.2C12 20.2 4.4 15.4 4.4 10.5A4.2 4.2 0 0 1 12 7.5a4.2 4.2 0 0 1 7.6 3c0 4.9-7.6 9.7-7.6 9.7Z"
      fill="currentColor"
    />
  ),
  play: <path d="M8 5.4v13.2L19 12z" fill="currentColor" stroke="none" />,
  pause: (
    <>
      <rect x="8" y="5" width="3.2" height="14" rx="1.3" fill="currentColor" stroke="none" />
      <rect x="14.8" y="5" width="3.2" height="14" rx="1.3" fill="currentColor" stroke="none" />
    </>
  ),
  prev: (
    <>
      <path d="M18.6 5.6v12.8L8.4 12z" fill="currentColor" stroke="none" />
      <rect x="5" y="5.4" width="2" height="13.2" rx="1" fill="currentColor" stroke="none" />
    </>
  ),
  next: (
    <>
      <path d="M5.4 5.6v12.8L15.6 12z" fill="currentColor" stroke="none" />
      <rect x="17" y="5.4" width="2" height="13.2" rx="1" fill="currentColor" stroke="none" />
    </>
  ),
  shuffle: (
    <>
      <path d="M4 7h3.4c1.6 0 2.5.8 3.4 2.1l3.4 5.4c.9 1.4 1.8 2.2 3.4 2.2H20" />
      <path d="m17.4 14.4 2.6 2.6-2.6 2.6" />
      <path d="M4 17h3.4c1.3 0 2.1-.5 2.9-1.5" />
      <path d="M14.6 8.6c.8-1.1 1.6-1.6 3-1.6H20" />
      <path d="m17.4 4.4 2.6 2.6-2.6 2.6" />
    </>
  ),
  repeat: (
    <>
      <path d="M6.5 8.5H15a3.5 3.5 0 0 1 3.5 3.5v1.6" />
      <path d="m4 6 2.5 2.5L4 11" />
      <path d="M17.5 15.5H9A3.5 3.5 0 0 1 5.5 12v-1.6" />
      <path d="m20 18-2.5-2.5L20 13" />
    </>
  ),
  repeatOne: (
    <>
      <path d="M6.5 8.5H15a3.5 3.5 0 0 1 3.5 3.5v1.6" />
      <path d="m4 6 2.5 2.5L4 11" />
      <path d="M17.5 15.5H9A3.5 3.5 0 0 1 5.5 12v-1.6" />
      <path d="m20 18-2.5-2.5L20 13" />
      <path d="M12 10.4v3.2M11 11h1.6" strokeWidth="1.4" />
    </>
  ),
  volume: (
    <>
      <path d="M4 9.6v4.8h3l4 3.6V6L7 9.6z" />
      <path d="M14.8 9.4a4 4 0 0 1 0 5.2" />
      <path d="M17.4 7.2a7.4 7.4 0 0 1 0 9.6" />
    </>
  ),
  volumeMute: (
    <>
      <path d="M4 9.6v4.8h3l4 3.6V6L7 9.6z" />
      <path d="m15 9.5 5 5M20 9.5l-5 5" />
    </>
  ),
  queue: (
    <>
      <path d="M4 7h11M4 12h9M4 17h7" />
      <circle cx="17.4" cy="16.4" r="2.2" />
      <path d="M19.6 16.4V8l2.4.7" />
    </>
  ),
  lyrics: (
    <>
      <rect x="9" y="3" width="6" height="10.5" rx="3" />
      <path d="M6 11.4a6 6 0 0 0 12 0" />
      <path d="M12 17.4V21M9 21h6" />
    </>
  ),
  palette: (
    <>
      <path d="M12 3.2a8.8 8.8 0 1 0 0 17.6c1.5 0 2.1-.9 2.1-2 0-1.7-1.5-2.1-1.5-3.3 0-1 .8-1.8 2-1.8H17a4 4 0 0 0 4-4c0-3.7-4-6.5-9-6.5Z" />
      <circle cx="8.2" cy="9.4" r=".9" fill="currentColor" />
      <circle cx="8.2" cy="14" r=".9" fill="currentColor" />
      <circle cx="12" cy="7.2" r=".9" fill="currentColor" />
    </>
  ),
  back: <path d="m14.5 6-6 6 6 6" />,
  forward: <path d="m9.5 6 6 6-6 6" />,
  plus: <path d="M12 5v14M5 12h14" />,
  more: (
    <>
      <circle cx="6" cy="12" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="18" cy="12" r="1.4" fill="currentColor" stroke="none" />
    </>
  ),
  close: <path d="m6 6 12 12M18 6 6 18" />,
  trash: (
    <>
      <path d="M4.5 7h15M9.5 7V4.8h5V7M6.5 7l.9 12.2a1 1 0 0 0 1 .8h7.2a1 1 0 0 0 1-.8L17.5 7" />
      <path d="M10.4 11v5M13.6 11v5" />
    </>
  ),
  check: <path d="m5 12.6 4.6 4.6L19 7.4" />,
  note: (
    <>
      <circle cx="7" cy="17.2" r="2.6" />
      <circle cx="17.6" cy="15.2" r="2.6" />
      <path d="M9.6 17.2V6.2l10.6-2v11" />
    </>
  ),
  drag: (
    <>
      <circle cx="9" cy="7" r="1.3" fill="currentColor" stroke="none" />
      <circle cx="9" cy="12" r="1.3" fill="currentColor" stroke="none" />
      <circle cx="9" cy="17" r="1.3" fill="currentColor" stroke="none" />
      <circle cx="15" cy="7" r="1.3" fill="currentColor" stroke="none" />
      <circle cx="15" cy="12" r="1.3" fill="currentColor" stroke="none" />
      <circle cx="15" cy="17" r="1.3" fill="currentColor" stroke="none" />
    </>
  ),
  chevronDown: <path d="m6 9.5 6 6 6-6" />,
  sparkles: (
    <>
      <path d="M12 3.5 13.6 9 19 10.6 13.6 12.2 12 17.7 10.4 12.2 5 10.6 10.4 9z" />
      <path d="M18 16.5l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8z" />
    </>
  ),
  sliders: (
    <>
      <path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3" />
      <path d="M2 14h4M10 8h4M18 16h4" />
    </>
  ),
  portal: (
    <>
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <path d="M15 3h6v6M10 14 21 3" />
    </>
  ),
};

export type IconName = keyof typeof paths;

interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'name'> {
  name: IconName;
  size?: number;
}

export function Icon({ name, size = 18, ...rest }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.65}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {paths[name]}
    </svg>
  );
}
