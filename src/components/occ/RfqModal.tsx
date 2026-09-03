import { useEffect, useState, type FormEvent } from "react";
import { X, Send } from "lucide-react";
import { toast } from "sonner";
import { addMessage } from "@/lib/inbox";
import { useT } from "@/lib/i18n";

export function RfqModal({
  open,
  onClose,
  commodity,
}: {
  open: boolean;
  onClose: () => void;
  commodity: string;
}) {
  const t = useT();
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    const data = new FormData(e.currentTarget);
    const get = (field: string) => String(data.get(field) ?? "").trim();
    const saved = await addMessage({
      kind: "rfq",
      subject: get("commodity") || commodity,
      name: get("name"),
      email: get("email"),
      company: get("company"),
      country: get("country"),
      fields: [
        { label: "Commodity", value: get("commodity") || commodity },
        { label: "Company", value: get("company") },
        { label: "Destination country", value: get("country") },
        { label: "Email", value: get("email") },
        { label: "Volume", value: get("volume") },
        { label: "Incoterm", value: get("incoterm") },
        { label: "Required grade / specification", value: get("grade") },
        { label: "Additional notes", value: get("notes") },
      ],
    });
    setSubmitting(false);
    if (saved) {
      toast.success(t("rfq.successTitle"), {
        description: t("rfq.successBody", { name: commodity }),
      });
    } else {
      toast.error("RFQ could not be saved. Please email OCC directly.");
    }
    onClose();
  }

  const field =
    "mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-primary";
  const label = "text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground";

  return (
    <div className="fixed inset-0 z-[100] grid place-items-center p-4">
      <button
        type="button"
        aria-label={t("rfq.close")}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Request for quote — ${commodity}`}
        className="relative max-h-[88vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-border bg-card p-7 shadow-2xl md:p-9"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label={t("action.close")}
          className="absolute right-5 top-5 grid h-9 w-9 place-items-center rounded-full border border-border text-muted-foreground transition-colors hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>

        <span className="text-xs font-semibold uppercase tracking-[0.24em] text-primary-strong">
          {t("rfq.title")}
        </span>
        <h2 className="mt-3 font-display text-3xl font-medium text-foreground">{commodity}</h2>
        <p className="mt-2 text-sm text-muted-foreground">{t("rfq.intro")}</p>

        <form onSubmit={onSubmit} className="mt-7 grid gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className={label} htmlFor="rfq-commodity">
              {t("rfq.commodity")}
            </label>
            <input
              id="rfq-commodity"
              name="commodity"
              defaultValue={commodity}
              readOnly
              className={`${field} bg-muted`}
            />
          </div>
          <div>
            <label className={label} htmlFor="rfq-name">
              {t("rfq.fullName")}
            </label>
            <input id="rfq-name" name="name" required className={field} />
          </div>
          <div>
            <label className={label} htmlFor="rfq-company">
              {t("rfq.company")}
            </label>
            <input id="rfq-company" name="company" required className={field} />
          </div>
          <div>
            <label className={label} htmlFor="rfq-email">
              {t("rfq.businessEmail")}
            </label>
            <input id="rfq-email" name="email" type="email" required className={field} />
          </div>
          <div>
            <label className={label} htmlFor="rfq-country">
              {t("rfq.destinationCountry")}
            </label>
            <input id="rfq-country" name="country" required className={field} />
          </div>
          <div>
            <label className={label} htmlFor="rfq-volume">
              {t("rfq.volume")}
            </label>
            <input
              id="rfq-volume"
              name="volume"
              placeholder={t("rfq.volumeHint")}
              required
              className={field}
            />
          </div>
          <div>
            <label className={label} htmlFor="rfq-incoterm">
              {t("rfq.incoterm")}
            </label>
            <select id="rfq-incoterm" name="incoterm" defaultValue="FOB Djibouti" className={field}>
              <option>FOB Djibouti</option>
              <option>CFR</option>
              <option>CIF</option>
              <option>EXW Addis Ababa</option>
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className={label} htmlFor="rfq-grade">
              {t("rfq.grade")}
            </label>
            <input id="rfq-grade" name="grade" placeholder={t("rfq.gradeHint")} className={field} />
          </div>
          <div className="sm:col-span-2">
            <label className={label} htmlFor="rfq-notes">
              {t("rfq.notes")}
            </label>
            <textarea id="rfq-notes" name="notes" rows={4} className={field} />
          </div>
          <div className="sm:col-span-2">
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary-strong px-7 py-3.5 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-60"
            >
              {submitting ? t("rfq.sending") : t("rfq.submit")}
              <Send className="h-4 w-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
