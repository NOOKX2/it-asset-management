import Link from "next/link";
import { useLocale } from "@/components/providers/LocaleProvider";
import { useCanEdit } from "@/lib/hooks/use-can-edit";
import { CardShell } from "./overview-ui";

export function OverviewSidebar({
  onExportPdf,
  exporting,
}: {
  onExportPdf: () => void;
  exporting: boolean;
}) {
  const { t } = useLocale();
  const canEdit = useCanEdit();

  const actions = [
    { href: "/analysis", label: t.overview.viewAnalysis },
    { href: "/liquidity", label: t.nav.liquidity },
    ...(canEdit
      ? [
          { href: "/assets/new", label: t.sidebar.addAsset },
          { href: "/assets/new", label: t.overview.addLand },
        ]
      : [{ href: "/land", label: t.nav.land }]),
  ];

  return (
    <div className="flex flex-col gap-3">
      <CardShell>
        <h3 className="mb-3 text-sm font-semibold text-gray-900">{t.overview.quickActions}</h3>
        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={onExportPdf}
            disabled={exporting}
            className="rounded-xl border border-[var(--primary-green)] bg-[var(--light-green-bg)] px-3 py-2.5 text-left text-sm font-medium text-[var(--primary-green-dark)] hover:bg-[var(--light-green)] disabled:opacity-60"
          >
            <span className="block">{exporting ? t.overview.exportingPdf : t.overview.exportReport}</span>
            <span className="mt-0.5 block text-xs font-normal text-gray-500">
              {t.overview.exportPdfHint}
            </span>
          </button>
          {actions.map((action) => (
            <Link
              key={`${action.href}-${action.label}`}
              href={action.href}
              className="rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              {action.label}
            </Link>
          ))}
        </div>
      </CardShell>

      <CardShell>
        <h3 className="mb-2 text-sm font-semibold text-gray-900">{t.overview.aboutAssets}</h3>
        <p className="text-sm leading-relaxed text-gray-500">{t.overview.aboutBody}</p>
      </CardShell>
    </div>
  );
}
