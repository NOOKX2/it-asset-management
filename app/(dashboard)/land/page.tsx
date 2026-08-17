import { Suspense } from "react";
import { LandAssetContent } from "./_components/LandAssetContent";

export const metadata = {
  title: "Land Assets",
};

export default function LandPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center text-sm text-gray-500">
          Loading…
        </div>
      }
    >
      <LandAssetContent />
    </Suspense>
  );
}
