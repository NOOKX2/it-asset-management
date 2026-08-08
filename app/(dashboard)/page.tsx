import { OverviewContent } from "@/components/pages/OverviewContent";

export default function OverviewPage() {
  return (
    <div className="-m-2 flex h-[calc(100vh-4rem-2.5rem)] min-h-0 flex-col overflow-hidden">
      <OverviewContent />
    </div>
  );
}
