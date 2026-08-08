import { LocaleProvider } from "@/components/providers/LocaleProvider";
import { SessionProvider } from "@/components/providers/SessionProvider";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <LocaleProvider>
        <div className="min-h-screen w-full">{children}</div>
      </LocaleProvider>
    </SessionProvider>
  );
}
