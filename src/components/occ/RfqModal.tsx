import { useEffect, useState, type FormEvent } from "react";
import { X, Send } from "lucide-react";
import { toast } from "sonner";
import { addMessage } from "@/lib/inbox";

export function RfqModal({
  open,
  onClose,
  commodity,
}: {
  open: boolean;
  onClose: () => void;
  commodity: string;
}) {
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

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    const data = new FormData(e.currentTarget);
    const get = (field: string) => String(data.get(field) ?? "").trim();
    const saved = addMessage({
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
    setTimeout(() => {
      setSubmitting(false);
      if (saved) {
        toast.success("RFQ submitted", {
          description: `Our sourcing team will respond on ${commodity} within one business day.`,
        });
      } else {
        toast.error("RFQ sent, but it could not be stored in this browser.");
      }
      onClose();
    }, 700);
  }

  const field =
    "mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-primary";
  const label = "text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground";

  return (
    <div className="fixed inset-0 z-[100] grid place-items-center p-4">
      <button
        type="button"
        aria-label="Close request for quote"
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
          aria-label="Close"
          className="absolute right-5 top-5 grid h-9 w-9 place-items-center rounded-full border border-border text-muted-foreground transition-colors hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>

        <span className="text-xs font-semibold uppercase tracking-[0.24em] text-primary-strong">
          Request for Quote
        </span>
        <h2 className="mt-3 font-display text-3xl font-medium text-foreground">{commodity}</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Share your requirement and we'll respond with availability, specification and indicative
          FOB Djibouti terms.
        </p>

        <form onSubmit={onSubmit} className="mt-7 grid gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className={label} htmlFor="rfq-commodity">
              Commodity
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
              Full name
            </label>
            <input id="rfq-name" name="name" required className={field} />
          </div>
          <div>
            <label className={label} htmlFor="rfq-company">
              Company
            </label>
            <input id="rfq-company" name="company" required className={field} />
          </div>
          <div>
            <label className={label} htmlFor="rfq-email">
              Business email
            </label>
            <input id="rfq-email" name="email" type="email" required className={field} />
          </div>
          <div>
            <label className={label} htmlFor="rfq-country">
              Destination country
            </label>
            <input id="rfq-country" name="country" required className={field} />
          </div>
          <div>
            <label className={label} htmlFor="rfq-volume">
              Volume (MT)
            </label>
            <input
              id="rfq-volume"
              name="volume"
              placeholder="e.g. 25 MT / month"
              required
              className={field}
            />
          </div>
          <div>
            <label className={label} htmlFor="rfq-incoterm">
              Incoterm
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
              Required grade / specification
            </label>
            <input
              id="rfq-grade"
              name="grade"
              placeholder="e.g. Grade 1, washed, screen 14 up"
              className={field}
            />
          </div>
          <div className="sm:col-span-2">
            <label className={label} htmlFor="rfq-notes">
              Additional notes
            </label>
            <textarea id="rfq-notes" name="notes" rows={4} className={field} />
          </div>
          <div className="sm:col-span-2">
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary-strong px-7 py-3.5 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-60"
            >
              {submitting ? "Sending…" : "Submit RFQ"}
              <Send className="h-4 w-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
