"use client";

import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useLocale } from "@/components/providers/LocaleProvider";

function HeroGraphic() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="absolute right-0 top-1/4 h-96 w-96 translate-x-1/4 rounded-full bg-[#4b6f1c]/30 blur-3xl"
        aria-hidden
      />
      <div
        className="absolute -left-16 bottom-1/4 h-96 w-96 rounded-full bg-[#2d4a12]/40 blur-3xl"
        aria-hidden
      />
      <div
        className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-3xl bg-gradient-to-br from-[#4b6f1c]/20 via-[#6b8f3c]/10 to-transparent rotate-12 blur-2xl"
        aria-hidden
      />
      <div
        className="absolute right-[10%] top-1/3 h-56 w-56 rounded-full border border-white/5 bg-white/5 backdrop-blur-sm"
        aria-hidden
      />
    </div>
  );
}

function AuthHero() {
  const { t } = useLocale();
  const a = t.auth;

  return (
    <div className="relative hidden shrink-0 flex-col justify-between overflow-hidden bg-gradient-to-br from-[#0c1210] via-[#111a14] to-[#0a0f0c] p-10 lg:flex lg:w-[58%] xl:p-12">
      <HeroGraphic />

      <div className="relative z-10">
        <div className="inline-flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 backdrop-blur-sm">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--primary-green)] text-xs font-bold text-white">
            GA
          </div>
          <div>
            <p className="text-sm font-semibold text-white">{a.brand}</p>
            <p className="text-xs text-white/50">{a.brandSubtitle}</p>
          </div>
        </div>
      </div>

      <div className="relative z-10 my-12">
        <p className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-[#8fce6a]/80">
          {a.heroTagline}
        </p>
        <h1 className="text-4xl font-bold leading-tight text-white xl:text-5xl">
          {a.heroTitlePrefix}{" "}
          <span className="text-[#8fce6a]">{a.heroTitleHighlight}</span>
        </h1>
        <p className="mt-5 max-w-md text-base leading-relaxed text-white/60">
          {a.heroDescription}
        </p>
      </div>

      <p className="relative z-10 text-xs text-white/30">{a.heroFooter}</p>
    </div>
  );
}

function MobileHeader() {
  const { t } = useLocale();
  const a = t.auth;

  return (
    <div className="flex items-center justify-between border-b border-white/10 bg-gradient-to-r from-[#0c1210] to-[#111a14] px-5 py-4 lg:hidden">
      <div className="flex items-center gap-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--primary-green)] text-xs font-bold text-white">
          GA
        </div>
        <span className="text-sm font-semibold text-white">{a.brand}</span>
      </div>
      <LanguageSwitcher />
    </div>
  );
}

export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-full flex-col lg:flex-row">
      <MobileHeader />
      <AuthHero />
      <div className="flex min-w-0 flex-1 flex-col bg-white lg:w-[42%]">
        <div className="hidden justify-end p-6 lg:flex">
          <LanguageSwitcher />
        </div>
        <div className="flex flex-1 items-center justify-center px-6 py-10 sm:px-10 lg:px-16 lg:py-12">
          <div className="w-full max-w-md">{children}</div>
        </div>
      </div>
    </div>
  );
}
