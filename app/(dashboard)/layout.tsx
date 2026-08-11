import { DashboardLayout } from "./_components/DashboardLayout";
import { LocaleProvider } from "@/components/providers/LocaleProvider";
import { SessionProvider } from "@/components/providers/SessionProvider";

export default function DashboardGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <LocaleProvider>
        <DashboardLayout>{children}</DashboardLayout>
      </LocaleProvider>
    </SessionProvider>
  );
}
