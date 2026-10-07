export function HeroBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
      <div className="nexa-home-backdrop absolute inset-0" />
      <div className="nexa-hero-planet absolute right-[-22%] top-[6%] aspect-square w-[82vw] max-w-[1120px] rounded-full lg:right-[1%] lg:top-[5%] lg:w-[65vw]" />
      <div className="absolute inset-x-0 bottom-0 h-[35%] min-h-[190px] opacity-90 sm:h-[40%]">
        <svg viewBox="0 0 1440 420" preserveAspectRatio="xMidYMax slice" className="h-full w-full">
          <defs>
            <linearGradient id="nexa-land-a" x1="0" x2="0.9" y1="0" y2="1">
              <stop offset="0" stopColor="#111b27" />
              <stop offset="1" stopColor="#020407" />
            </linearGradient>
            <linearGradient id="nexa-land-b" x1="0" x2="1" y1="0" y2="1">
              <stop offset="0" stopColor="#0b111a" />
              <stop offset="0.5" stopColor="#17121a" />
              <stop offset="1" stopColor="#030507" />
            </linearGradient>
            <linearGradient id="nexa-horizon" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0" stopColor="var(--nexa-home-accent)" stopOpacity="0" />
              <stop offset="0.34" stopColor="var(--nexa-home-accent)" stopOpacity="0.9" />
              <stop offset="0.73" stopColor="var(--nexa-home-accent)" stopOpacity="0.72" />
              <stop offset="1" stopColor="var(--nexa-home-accent)" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d="M0 190 95 145 178 183 280 150 378 204 470 166 562 218 670 163 770 195 872 139 972 205 1085 160 1202 207 1327 126 1440 180V420H0Z" fill="url(#nexa-land-a)" />
          <path d="M0 249 112 214 226 268 338 230 474 300 584 238 706 283 833 221 956 276 1082 215 1211 265 1320 212 1440 242V420H0Z" fill="url(#nexa-land-b)" />
          <path d="M0 278 C205 282 250 330 414 321 S660 274 804 305 1014 329 1160 293 1346 270 1440 281" fill="none" stroke="url(#nexa-horizon)" strokeWidth="2" strokeOpacity="0.3" />
          <path d="M0 300 C180 303 290 350 440 344 S660 308 805 328 1020 351 1180 321 1340 294 1440 301V420H0Z" fill="#030507" fillOpacity="0.78" />
        </svg>
      </div>
      <div className="nexa-home-horizon-glow absolute inset-x-0 bottom-[18%] h-28 blur-2xl" />
    </div>
  );
}
