"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useLocale } from "@/components/providers/LocaleProvider";
import { downloadElementAsPdf } from "@/lib/export-overview-pdf";
import { useLandAssets } from "@/lib/hooks/use-land-assets";
import { useLiquidityAssets } from "@/lib/hooks/use-liquidity-assets";
import { todayIsoDate } from "@/lib/loan-tenure";
import { OverviewAllocationCard } from "./OverviewAllocationCard";
import { OverviewKpiBar } from "./OverviewKpiBar";
import { OverviewLandCard } from "./OverviewLandCard";
import { OverviewPdfDocument } from "./OverviewPdfDocument";
import { OverviewSidebar } from "./OverviewSidebar";
import { useOverviewMetrics } from "./use-overview-metrics";

export function OverviewContent() {
  const { locale, t } = useLocale();
  const { assets: landAssets, isLoading: landLoading } = useLandAssets();
  const { assets: liquidityAssets, isLoading: liquidityLoading } = useLiquidityAssets();

  const metrics = useOverviewMetrics(landAssets, liquidityAssets);
  const isLoading = landLoading || liquidityLoading;
  const reportRef = useRef<HTMLDivElement>(null);
  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);

  const startExport = useCallback(() => {
    setExportError(null);
    setExporting(true);
  }, []);

  useEffect(() => {
    if (!exporting) return;
    let cancelled = false;

    const run = async () => {
      await new Promise((resolve) => window.setTimeout(resolve, 80));
      if (cancelled || !reportRef.current) {
        setExporting(false);
        return;
      }
      try {
        await downloadElementAsPdf(
          reportRef.current,
          `total-assets-${todayIsoDate()}.pdf`
        );
      } catch {
        if (!cancelled) setExportError(t.overview.exportPdfFailed);
      } finally {
        if (!cancelled) setExporting(false);
      }
    };

    void run();
    return () => {
      cancelled = true;
    };
  }, [exporting, t.overview.exportPdfFailed]);

  if (isLoading) {
    return (
      <div className="flex h-full min-h-[40vh] items-center justify-center text-sm text-gray-500">
        Loading overview…
      </div>
    );
  }

  const generatedAt = new Date().toLocaleString(locale === "th" ? "th-TH" : "en-GB");

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">{t.overview.title}</h1>
          <p className="mt-1 text-sm text-gray-500">{t.overview.subtitle}</p>
        </div>
        <div className="shrink-0">
          <ExportPdfButton
            label={t.overview.exportReport}
            hint={t.overview.exportPdfHint}
            exportingLabel={t.overview.exportingPdf}
            exporting={exporting}
            onClick={startExport}
          />
          {exportError ? (
            <p className="mt-1 text-xs text-red-600">{exportError}</p>
          ) : null}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="flex flex-col gap-4 lg:col-span-2">
          <OverviewKpiBar metrics={metrics} />
          <OverviewAllocationCard metrics={metrics} />
          <OverviewLandCard assets={landAssets} />
        </div>
        <OverviewSidebar exporting={exporting} onExportPdf={startExport} />
      </div>

      {exporting
        ? createPortal(
            <>
              <div className="fixed inset-0 z-[80] flex items-center justify-center bg-white/80 text-sm font-medium text-gray-700">
                {t.overview.exportingPdf}
              </div>
              <div
                ref={reportRef}
                style={{ position: "absolute", left: 0, top: 0, zIndex: 1 }}
              >
                <OverviewPdfDocument
                  locale={locale}
                  t={t}
                  generatedAt={generatedAt}
                  metrics={metrics}
                  landAssets={landAssets}
                  liquidityAssets={liquidityAssets}
                />
              </div>
            </>,
            document.documentElement
          )
        : null}
    </div>
  );
}

function ExportPdfButton({
  label,
  hint,
  exportingLabel,
  exporting,
  onClick,
}: {
  label: string;
  hint: string;
  exportingLabel: string;
  exporting: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={exporting}
      className="inline-flex items-center gap-2 rounded-xl bg-[var(--primary-green)] px-4 py-2.5 text-sm font-medium text-white hover:bg-[var(--primary-green-dark)] disabled:opacity-60"
    >
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
      <span className="text-left leading-tight">
        <span className="block">{exporting ? exportingLabel : label}</span>
        <span className="block text-[11px] font-normal text-white/80">{hint}</span>
      </span>
    </button>
  );
}
