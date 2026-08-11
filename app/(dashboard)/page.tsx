import { OverviewContent } from "./_components/OverviewContent";

export default function OverviewPage() {
  return (
    <div className="-m-2 flex min-h-0 flex-col lg:h-[calc(100vh-4rem-2.5rem)] lg:overflow-hidden">
      <OverviewContent />
    </div>
  );
}
