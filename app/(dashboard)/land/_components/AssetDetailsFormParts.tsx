import { useLocale } from "@/components/providers/LocaleProvider";
import type { LandAsset } from "@/lib/land-types";

interface AssetDetailsFormHeaderProps {
  formId: string;
  onClose?: () => void;
}

export function AssetDetailsFormHeader({
  formId,
  onClose,
}: AssetDetailsFormHeaderProps) {
  const { t } = useLocale();

  return (
    <div className="flex items-center justify-between border-b border-[var(--card-border)] px-5 py-4">
      <h2 className="text-base font-semibold text-gray-900">{t.land.assetDetails}</h2>
      <div className="flex items-center gap-2">
        <span className="rounded-full bg-[var(--light-green)] px-3 py-1 text-xs font-medium text-[var(--primary-green-dark)]">
          {t.land.selected}: {formId}
        </span>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            aria-label={t.common.close}
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}

interface AssetDetailsFormFooterProps {
  saved: boolean;
  onCancel: () => void;
  onSave: () => void;
}

export function AssetDetailsFormFooter({
  saved,
  onCancel,
  onSave,
}: AssetDetailsFormFooterProps) {
  const { t } = useLocale();

  return (
    <div className="flex items-center justify-between border-t border-[var(--card-border)] px-5 py-4">
      {saved && (
        <span className="text-sm text-[var(--primary-green)]">{t.land.saved}</span>
      )}
      <div className="flex flex-1 justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
        >
          {t.common.cancel}
        </button>
        <button
          type="button"
          onClick={onSave}
          className="rounded-xl bg-[var(--primary-green)] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[var(--primary-green-dark)]"
        >
          {t.common.save}
        </button>
      </div>
    </div>
  );
}

export type AssetFieldUpdater = <K extends keyof LandAsset>(
  key: K,
  value: LandAsset[K]
) => void;
