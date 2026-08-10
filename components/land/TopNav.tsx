"use client";

import Link from "next/link";
import { Suspense, useEffect, useRef, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { TopNavLandViewToggle } from "@/components/land/TopNavLandViewToggle";
import { useLocale } from "@/components/providers/LocaleProvider";

function getUserInitials(name?: string | null, email?: string | null) {
  if (name?.trim()) {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return name.trim().slice(0, 2).toUpperCase();
  }
  if (email) {
    return email.slice(0, 2).toUpperCase();
  }
  return "U";
}

function UserProfileMenu() {
  const { t } = useLocale();
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const name = session?.user?.name?.trim() || session?.user?.email || "";
  const email = session?.user?.email ?? "";
  const initials = getUserInitials(session?.user?.name, session?.user?.email);

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: MouseEvent) {
      if (!menuRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [open]);

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--light-green)] text-sm font-semibold text-[var(--primary-green-dark)] hover:ring-2 hover:ring-[var(--primary-green)]/30"
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={name}
      >
        {initials}
      </button>

      {open && (
        <div
          className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-xl border border-[var(--card-border)] bg-white shadow-lg"
          role="menu"
        >
          <div className="border-b border-[var(--card-border)] px-4 py-3">
            <p className="truncate text-sm font-semibold text-gray-900">{name}</p>
            {email && (
              <p className="truncate text-xs text-gray-500">{email}</p>
            )}
          </div>
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setOpen(false);
              signOut({ callbackUrl: "/login" });
            }}
            className="flex w-full items-center gap-2 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            {t.sidebar.logout}
          </button>
        </div>
      )}
    </div>
  );
}

export function TopNav() {
  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between border-b border-[var(--card-border)] bg-white px-6">
      <div className="flex items-center gap-4 lg:gap-6">
        <Link href="/" className="text-lg font-semibold text-[var(--primary-green)]">
          ITAM Pro
        </Link>
        <Suspense fallback={null}>
          <TopNavLandViewToggle />
        </Suspense>
        <div className="relative hidden md:block">
          <svg
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
          </svg>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <LanguageSwitcher />

        <div className="flex items-center gap-3">
          <button
            type="button"
            className="rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
            aria-label="Notifications"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </button>
          <UserProfileMenu />
        </div>
      </div>
    </header>
  );
}
