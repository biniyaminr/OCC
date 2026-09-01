import { useEffect, useMemo, useState, type FormEvent } from "react";
import { CheckCircle2, Mail, MapPin, Phone, Send } from "lucide-react";
import { toast } from "sonner";
import { Reveal } from "./Reveal";
import { addMessage } from "@/lib/inbox";
import { useManagedProducts, useSiteContent } from "@/lib/site-content";

type Errors = Record<string, string>;

export function ContactSection() {
  const { content } = useSiteContent();
  const managedProducts = useManagedProducts();
  const productOptions = useMemo(
    () => [...managedProducts.map((p) => p.name), "Multiple / Other"],
    [managedProducts],
  );
  const contact = content.home.contact;
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [preselected, setPreselected] = useState<string>("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const search = window.location.search || window.location.hash.split("?")[1] || "";
    const params = new URLSearchParams(search.startsWith("?") ? search.slice(1) : search);
    const p = params.get("product");
    if (p && productOptions.includes(p)) setPreselected(p);
  }, [productOptions]);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const next: Errors = {};

    const required: [string, string][] = [
      ["name", "Please enter your full name."],
      ["company", "Please enter your company name."],
      ["email", "Please enter your business email."],
      ["product", "Please select a product of interest."],
      ["message", "Please describe your requirement."],
    ];
    required.forEach(([field, msg]) => {
      if (!String(data.get(field) ?? "").trim()) next[field] = msg;
    });
    const email = String(data.get("email") ?? "");
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      next["email"] = "Please enter a valid email address.";
    }

    setErrors(next);
    if (Object.keys(next).length > 0) {
      form.querySelector<HTMLElement>(`[name="${Object.keys(next)[0]}"]`)?.focus();
      return;
    }

    setSubmitting(true);
    const get = (field: string) => String(data.get(field) ?? "").trim();
    const saved = addMessage({
      kind: "contact",
      subject: get("product"),
      name: get("name"),
      email: get("email"),
      company: get("company"),
      country: get("country"),
      fields: [
        { label: "Product of interest", value: get("product") },
        { label: "Company", value: get("company") },
        { label: "Country", value: get("country") },
        { label: "Email", value: get("email") },
        { label: "Phone / WhatsApp", value: get("phone") },
        { label: "Estimated quantity", value: get("quantity") },
        { label: "Message", value: get("message") },
      ],
    });
    setTimeout(() => {
      setSubmitting(false);
      setSent(true);
      form.reset();
      if (!saved) {
        toast.error("Inquiry sent, but it could not be stored in this browser.");
      }
    }, 700);
  }

  return (
    <section id="contact" className="section-y relative overflow-hidden bg-background">
      <div className="container-x relative">
        <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)] lg:gap-20">
          <Reveal>
            <div>
              <span className="eyebrow">{contact.eyebrow}</span>
              <h2 className="mt-4 text-h2 font-medium leading-[1.1] text-foreground">
                {contact.title} <span className="italic text-coffee">{contact.accent}</span>
              </h2>
              <p className="mt-6 measure leading-relaxed text-muted-foreground">
                {contact.description}
              </p>

              <ul className="mt-10 space-y-5">
                {[
                  {
                    icon: Mail,
                    label: "Email",
                    value: contact.email,
                    href: `mailto:${contact.email}`,
                  },
                  {
                    icon: Phone,
                    label: "Phone",
                    value: contact.phone,
                    href: `tel:${contact.phone.replace(/[^+\d]/g, "")}`,
                  },
                  { icon: MapPin, label: "Head office", value: contact.address },
                ].map((c) => (
                  <li key={c.label} className="flex items-start gap-4">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary-strong">
                      <c.icon aria-hidden className="h-5 w-5" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                        {c.label}
                      </p>
                      {c.href ? (
                        <a
                          href={c.href}
                          className="mt-1 block text-foreground hover:text-primary-strong"
                        >
                          {c.value}
                        </a>
                      ) : (
                        <p className="mt-1 text-foreground">{c.value}</p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={120}>
            {sent ? (
              <div className="flex h-full flex-col items-start justify-center rounded-3xl border border-border bg-card p-8 sm:p-12">
                <CheckCircle2 aria-hidden className="h-10 w-10 text-primary-strong" />
                <h3 className="mt-5 font-display text-h3 text-foreground">Inquiry received</h3>
                <p className="mt-3 measure text-muted-foreground">
                  Thank you. Our sourcing team will reply within one business day from
                  plcoragon@gmail.com with availability and indicative terms.
                </p>
                <button
                  type="button"
                  onClick={() => setSent(false)}
                  className="mt-7 inline-flex min-h-[2.75rem] items-center rounded-full border border-border px-6 text-sm font-semibold text-foreground transition-colors hover:border-primary hover:text-primary-strong"
                >
                  Send another inquiry
                </button>
              </div>
            ) : (
              <form
                onSubmit={onSubmit}
                noValidate
                className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-10"
              >
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field
                    label="Full name"
                    name="name"
                    autoComplete="name"
                    required
                    error={errors["name"]}
                  />
                  <Field
                    label="Company name"
                    name="company"
                    autoComplete="organization"
                    required
                    error={errors["company"]}
                  />
                  <Field
                    label="Country"
                    name="country"
                    autoComplete="country-name"
                    hint="Optional"
                  />
                  <Field
                    label="Business email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    error={errors["email"]}
                  />
                  <Field
                    label="Phone or WhatsApp"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    hint="Optional"
                  />
                  <div>
                    <FieldLabel htmlFor="product" label="Product of interest (coffee)" required />
                    <select
                      id="product"
                      name="product"
                      key={preselected}
                      defaultValue={preselected}
                      aria-invalid={Boolean(errors["product"])}
                      className={inputCls(Boolean(errors["product"]))}
                    >
                      <option value="">Select a product…</option>
                      {productOptions.map((p) => (
                        <option key={p} value={p}>
                          {p}
                        </option>
                      ))}
                    </select>
                    <ErrorText message={errors["product"]} />
                  </div>
                  <Field
                    label="Estimated quantity"
                    name="quantity"
                    hint="Optional, e.g. 2 x 20ft"
                  />
                  <Field label="Destination port" name="port" hint="Optional" />
                  <div className="sm:col-span-2">
                    <FieldLabel htmlFor="message" label="Message or specifications" required />
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      aria-invalid={Boolean(errors["message"])}
                      placeholder="Target grade, packaging, shipment timing and destination port."
                      className={`${inputCls(Boolean(errors["message"]))} h-auto resize-none p-4`}
                    />
                    <ErrorText message={errors["message"]} />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="mt-8 inline-flex min-h-[3rem] w-full items-center justify-center gap-2 rounded-full bg-primary-strong px-8 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover disabled:opacity-60 sm:w-auto"
                >
                  {submitting ? "Sending…" : "Send inquiry"}
                  <Send aria-hidden className="h-4 w-4" />
                </button>
                <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
                  Your details are used only to respond to this sourcing inquiry and are never
                  shared with third parties.
                </p>
              </form>
            )}
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function inputCls(invalid: boolean) {
  return `h-12 w-full rounded-xl border bg-background px-4 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 ${
    invalid ? "border-destructive" : "border-border"
  }`;
}

function FieldLabel({
  htmlFor,
  label,
  required,
  hint,
}: {
  htmlFor: string;
  label: string;
  required?: boolean;
  hint?: string;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-2 flex items-center gap-2 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground"
    >
      {label}
      {required ? (
        <span className="text-primary-strong">*</span>
      ) : (
        <span className="font-medium normal-case tracking-normal opacity-70">
          {hint ?? "Optional"}
        </span>
      )}
    </label>
  );
}

function ErrorText({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p role="alert" className="mt-1.5 text-xs font-medium text-destructive">
      {message}
    </p>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  autoComplete,
  hint,
  error,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
  hint?: string;
  error?: string;
}) {
  return (
    <div>
      <FieldLabel htmlFor={name} label={label} required={required} hint={hint} />
      <input
        id={name}
        name={name}
        type={type}
        autoComplete={autoComplete}
        aria-invalid={Boolean(error)}
        className={inputCls(Boolean(error))}
      />
      <ErrorText message={error} />
    </div>
  );
}
