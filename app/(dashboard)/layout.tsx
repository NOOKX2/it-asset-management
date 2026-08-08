import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { LocaleProvider } from "@/components/providers/LocaleProvider";

export default function DashboardGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LocaleProvider>
      <DashboardLayout>{children}</DashboardLayout>
    </LocaleProvider>
  );
}
