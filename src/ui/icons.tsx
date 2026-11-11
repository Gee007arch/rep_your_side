const paths: Record<string, string> = {
  home: 'M3 10 12 3l9 7v11h-6v-7H9v7H3Z',
  play: 'm9 5 11 7-11 7Z',
  compass: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Zm4-16-2 8-8 2 2-8Z',
  pulse: 'M2 12h5l3-8 4 16 3-8h5',
  users: 'M16 21v-3a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v3m17-13a4 4 0 0 1 0 8m3 5v-3a4 4 0 0 0-3-4M13 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z',
  passport: 'M5 2h14v20H5Zm3 5h8m-8 10h8m-4-7v4m-2-2h4',
  arrow: 'M4 12h16m-6-6 6 6-6 6',
  pin: 'M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Zm-5 0a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z',
  chevron: 'm7 10 5 5 5-5',
  spark: 'm12 2 3 7 7 3-7 3-3 7-3-7-7-3 7-3Z',
  check: 'm5 12 4 4L20 5',
  close: 'm6 6 12 12M6 18 18 6',
  book: 'M12 5c-3-3-7-3-10-1v16c3-2 7-2 10 1 3-3 7-3 10-1V4c-3-2-7-2-10 1Zm0 0v16',
  save: 'M5 3h14v19l-7-5-7 5Z',
  clock: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Zm0-16v6l4 3',
  leaf: 'M20 3C9 1 1 9 5 17c8 5 16-3 15-14ZM4 21 16 9',
  camera: 'M3 7h4l2-4h6l2 4h4v14H3Zm13 6a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z',
  help: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20ZM9 8c0-4 7-4 7 0 0 3-4 2-4 6m0 3v1',
  settings: 'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm0-6v3m0 14v3M2 12h3m14 0h3M5 5l2 2m10 10 2 2M5 19l2-2M17 7l2-2',
  trophy: 'M7 3h10v8a5 5 0 0 1-10 0Zm0 2H3v5a4 4 0 0 0 4 4m10-9h4v5a4 4 0 0 1-4 4m-5 2v6m-5 0h10',
  menu: 'M3 6h18M3 12h18M3 18h18',
  share: 'm8 12 9-7m-9 7 9 7M8 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm15-9a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm0 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z',
  bag: 'M4 7h16l1 15H3Zm4 0V5a4 4 0 0 1 8 0v2',
  refresh: 'M20 8a9 9 0 1 0 0 9m0-14v5h-5',
  download: 'M12 3v12m-5-5 5 5 5-5M3 16v5h18v-5',
  shield: 'm12 2 9 4v6c0 5-9 10-9 10S3 17 3 12V6Zm-4 9 3 3 5-6',
  search: 'M16 16 22 22M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z'
};

export interface IconProps {
  name: string;
  className?: string;
}

export function Icon({ name, className = '' }: IconProps) {
  const d = paths[name];
  return (
    <svg
      className={`icon ${className}`.trim()}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {d ? <path d={d} /> : null}
    </svg>
  );
}
