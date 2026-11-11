import type { CityId } from '../domain/types';

function Tree({ x, y, s = 1, c = '#58896d' }: { x: number; y: number; s?: number; c?: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M0 12v62" stroke="#173f35" strokeWidth="8" />
      <path
        d="M-28 34Q-48 8-17-8Q-17-43 12-28Q47-30 42 4Q62 31 27 42Z"
        fill={c}
      />
      <path
        d="M0 42l-13-15m13 4L16 9"
        fill="none"
        stroke="#173f35"
        strokeWidth="3"
      />
    </g>
  );
}

function Building({
  x,
  y,
  w,
  h,
  c
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  c: string;
}) {
  const rows = Math.floor(h / 20) - 1;
  const cols = Math.floor(w / 15) - 1;
  const paths: React.ReactNode[] = [];

  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      paths.push(
        <path
          key={`${i}-${j}`}
          d={`M${x + 10 + i * 15} ${y + 12 + j * 20}v8`}
          stroke="#f8dfa5"
          strokeWidth="4"
          opacity=".7"
        />
      );
    }
  }

  return (
    <g>
      <path d={`M${x} ${y}h${w}v${h}h-${w}Z`} fill={c} />
      {paths}
    </g>
  );
}

export function Skyline({ city }: { city: CityId }) {
  return (
    <svg
      viewBox="0 0 600 360"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <pattern
          id="grain"
          width="11"
          height="11"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="2" cy="2" r=".7" fill="#fff" opacity=".1" />
        </pattern>
      </defs>
      <circle cx="423" cy="110" r="74" fill="#f6bd54" />
      <path d="M0 260Q140 220 310 260T600 250V360H0" fill="#477c69" />

      {city === 'lagos' ? (
        <>
          <Building x={150} y={113} w={55} h={150} c="#7f9f87" />
          <Building x={210} y={150} w={47} h={110} c="#bdc7a5" />
          <Building x={275} y={90} w={52} h={180} c="#5d8b76" />
          <Building x={340} y={135} w={65} h={130} c="#abc0a0" />
          <Building x={405} y={172} w={45} h={90} c="#71947d" />
          <path d="M30 285H585" stroke="#e6bd83" strokeWidth="19" />
          <path
            d="M104 284V170m0 0L39 280m65-110l76 110M472 285V151m0 0L380 280m92-129l97 129"
            stroke="#f7dcab"
            strokeWidth="5"
          />
          <path
            d="M0 326Q40 313 80 326t80 0t80 0t80 0t80 0t80 0t80 0t80 0"
            fill="none"
            stroke="#90b9a1"
            strokeWidth="3"
          />
          <g transform="translate(260 246) rotate(-4)">
            <rect width="105" height="49" rx="8" fill="#f9b93d" />
            <path d="M10 9h55v19H10Z" fill="#254c40" />
            <path d="M73 9h21v19H73Z" fill="#254c40" />
            <path d="M0 34h105" stroke="#274b3b" strokeWidth="4" />
            <circle cx="23" cy="49" r="10" fill="#192e28" />
            <circle cx="82" cy="49" r="10" fill="#192e28" />
            <circle cx="23" cy="49" r="4" fill="#dbcaa4" />
            <circle cx="82" cy="49" r="4" fill="#dbcaa4" />
          </g>
        </>
      ) : (
        <>
          <path d="M80 247Q114 98 202 95Q290 103 335 250Z" fill="#829d83" />
          <path
            d="M175 103Q159 152 182 187Q214 221 200 253"
            stroke="#b1b69a"
            fill="none"
            strokeWidth="16"
          />
          <Building x={334} y={157} w={45} h={101} c="#aac1a1" />
          <Building x={392} y={132} w={37} h={130} c="#628f76" />
          <g fill="#ecd8ad">
            <path d="M275 282V205h25v77m100 0V205h25v77" />
            <path d="M269 205q81-84 162 0h-28q-54-44-107 0Z" />
            <path d="M285 194v-38m130 38v-38" stroke="#ecd8ad" strokeWidth="7" />
          </g>
          <path d="M0 303Q220 275 600 305" stroke="#ccae7d" strokeWidth="36" />
          <path
            d="M0 303Q220 275 600 305"
            stroke="#ffdf9a"
            strokeWidth="2"
            strokeDasharray="22 18"
          />
          <g transform="translate(305 274)">
            <rect width="82" height="27" rx="10" fill="#e98357" />
            <path d="M16 0l13-15h31L74 0" fill="#e98357" />
            <path d="M30-10h24l7 10H22Z" fill="#274e43" />
            <circle cx="17" cy="29" r="8" fill="#243c32" />
            <circle cx="64" cy="29" r="8" fill="#243c32" />
          </g>
        </>
      )}

      <Tree x={535} y={193} s={0.95} />
      <Tree x={49} y={235} s={0.7} c="#87a782" />
      <path
        d="M365 47q12-12 23 0m-4-11q12-12 23 0"
        fill="none"
        stroke="#e6d7af"
        strokeWidth="2"
      />
      <rect width="600" height="360" fill="url(#grain)" />
    </svg>
  );
}

export function ArtScene({
  type,
  city = 'lagos'
}: {
  type: 'city' | 'forest' | 'park' | 'train' | 'craft' | string;
  city?: CityId;
}) {
  if (type === 'city') {
    return <Skyline city={city} />;
  }

  if (type === 'forest' || type === 'park') {
    return (
      <svg
        viewBox="0 0 600 360"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        focusable="false"
      >
        <rect width="600" height="360" fill="#bfd4ac" />
        <circle cx="425" cy="89" r="54" fill="#f7dda2" />
        <path d="M0 246Q200 140 600 220V360H0" fill="#7faa7f" />
        <path
          d="M210 360q160-131 30-158"
          stroke="#e7c8a0"
          strokeWidth="45"
          fill="none"
        />
        <Tree x={85} y={125} s={1.6} />
        <Tree x={470} y={140} s={1.7} c="#477c60" />
        <Tree x={215} y={95} s={1.1} c="#82a16f" />
        <Tree x={365} y={150} s={1.2} />
        <path
          d="M80 205q190 85 400-4m-400 12q190 85 400-4"
          stroke="#8c6c47"
          strokeWidth="4"
          fill="none"
        />
        <path
          d="M130 225v40m75-17v40m80-34v40m80-39v40m70-49v40"
          stroke="#b4a17a"
          strokeWidth="3"
        />
      </svg>
    );
  }

  if (type === 'train') {
    return (
      <svg
        viewBox="0 0 600 360"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        focusable="false"
      >
        <rect width="600" height="360" fill="#acd0d0" />
        <circle cx="460" cy="86" r="58" fill="#f3d890" />
        <Building x={50} y={95} w={70} h={180} c="#729e9b" />
        <Building x={145} y={160} w={70} h={115} c="#92b1a4" />
        <Building x={450} y={150} w={65} h={125} c="#598d88" />
        <path d="M0 285h600" stroke="#d4ba95" strokeWidth="40" />
        <path d="M0 319h600" stroke="#325e58" strokeWidth="6" />
        <g transform="translate(105 177)">
          <rect width="390" height="108" rx="24" fill="#f1f1dc" />
          <path d="M0 71h390v24H0" fill="#31839a" />
          <path d="M25 18h58v37H25zm82 0h58v37h-58zm82 0h58v37h-58zm82 0h58v37h-58zm82 0h20v37h-20Z" fill="#254d53" />
          <path
            d="M95 9v87m85-87v87m85-87v87m85-87v87"
            stroke="#a8bbb3"
            strokeWidth="3"
          />
          <circle cx="65" cy="106" r="12" fill="#214840" />
          <circle cx="323" cy="106" r="12" fill="#214840" />
        </g>
      </svg>
    );
  }

  if (type === 'craft') {
    return (
      <svg
        viewBox="0 0 600 360"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        focusable="false"
      >
        <rect width="600" height="360" fill="#f1caab" />
        <path d="M0 290h600v70H0" fill="#c09071" />
        <path d="M100 130l40-70h320l40 70Z" fill="#c16c45" />
        <path
          d="M120 132v150m360-150v150"
          stroke="#785343"
          strokeWidth="13"
        />
        <path d="M100 135h400" stroke="#f7e5bd" strokeWidth="13" />
        <path
          d="M150 265q-25-42 7-64v-27h40v27q32 25 7 64Zm190 0q-25-42 7-64v-37h40v37q32 25 7 64Z"
          fill="#d9914c"
        />
        <path
          d="M155 216h43m-46 13h48m153-16h44m-47 14h50"
          stroke="#6c6740"
          strokeWidth="7"
        />
        <path d="M240 180h70v85h-70Z" fill="#486e61" />
        <path
          d="M246 190l55 65m-55 0l55-65"
          stroke="#f2c262"
          strokeWidth="7"
        />
        <path d="M80 277h440" stroke="#835947" strokeWidth="12" />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 600 360"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <rect width="600" height="360" fill="#e4bca6" />
      <circle cx="300" cy="174" r="109" fill="#f5d566" />
      <path d="M244 229V115l113 57Z" fill="#183e35" />
    </svg>
  );
}
