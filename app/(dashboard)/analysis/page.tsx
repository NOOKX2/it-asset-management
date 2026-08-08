import { AnalysisContent } from "@/components/pages/AnalysisContent";

export default function AnalysisPage() {
  return (
    <div className="-m-6 flex h-[calc(100dvh-4rem-3rem)] max-h-[calc(100dvh-4rem-3rem)] min-h-0 flex-col overflow-hidden px-6 py-4">
      <AnalysisContent />
    </div>
  );
}
