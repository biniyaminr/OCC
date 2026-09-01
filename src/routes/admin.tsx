import { useEffect, useRef, useState, type ChangeEvent, type ReactNode } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  Check,
  ExternalLink,
  Handshake,
  Image as ImageIcon,
  Inbox,
  Layers3,
  LayoutDashboard,
  Loader2,
  Mail,
  MailOpen,
  Package,
  Plus,
  RotateCcw,
  Search,
  Trash2,
  Undo2,
  Upload,
} from "lucide-react";
import { formatReceived, replyHref, useInbox, type InboxMessage } from "@/lib/inbox";
import { categories } from "@/data/products";
import {
  defaultSiteContent,
  buildManagedCategories,
  isSlugTaken,
  renameRecordKey,
  slugify,
  useSiteContent,
  type SaveState,
  type SiteContent,
} from "@/lib/site-content";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [{ title: "Content Studio — OCC" }, { name: "robots", content: "noindex, nofollow" }],
  }),
  component: AdminPage,
});

type AdminView = "home" | "messages" | "categories" | "products" | "partners";

const navigation: { id: AdminView; label: string; icon: typeof LayoutDashboard }[] = [
  { id: "home", label: "Website & home", icon: LayoutDashboard },
  { id: "messages", label: "Messages", icon: Inbox },
  { id: "categories", label: "Categories", icon: Layers3 },
  { id: "products", label: "Products", icon: Package },
  { id: "partners", label: "Partners", icon: Handshake },
];

function AdminPage() {
  const { content, setContent, resetContent, ready, saveState, saveError } = useSiteContent();
  const inbox = useInbox();
  const [view, setView] = useState<AdminView>("home");

  const updateBrand = (field: keyof SiteContent["brand"], value: string) => {
    setContent({ ...content, brand: { ...content.brand, [field]: value } });
  };

  const updateHome = (section: keyof SiteContent["home"], field: string, value: string) => {
    setContent({
      ...content,
      home: {
        ...content.home,
        [section]: { ...content.home[section], [field]: value },
      },
    });
  };

  const heading =
    view === "home"
      ? { title: "Website & homepage", blurb: "Brand details and every homepage section." }
      : view === "messages"
        ? { title: "Buyer messages", blurb: "Inquiries and quote requests from the website." }
        : view === "categories"
          ? { title: "Commodity groups", blurb: "The groups your catalog is organised into." }
          : view === "products"
            ? {
                title: "Product catalog",
                blurb: "Catalog cards, pictures and product detail pages.",
              }
            : { title: "Partner profiles", blurb: "Partner logos, links and profile copy." };

  return (
    <div className="relative min-h-screen text-[#162019]">
      {/* Layered wash: warm parchment base with soft origin-green and gold light. */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 bg-[#f2f5ee]"
        style={{
          backgroundImage:
            "radial-gradient(60rem 40rem at 12% -10%, rgba(29,74,44,0.13), transparent 60%)," +
            "radial-gradient(45rem 35rem at 100% 0%, rgba(216,168,78,0.20), transparent 55%)," +
            "radial-gradient(50rem 40rem at 60% 110%, rgba(29,74,44,0.09), transparent 60%)," +
            "linear-gradient(180deg, #f7f9f4 0%, #eef2e9 55%, #e9efe4 100%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 opacity-[0.5]"
        style={{
          backgroundImage: "radial-gradient(rgba(23,35,27,0.16) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
          maskImage: "radial-gradient(70rem 50rem at 50% 0%, #000 20%, transparent 75%)",
          WebkitMaskImage: "radial-gradient(70rem 50rem at 50% 0%, #000 20%, transparent 75%)",
        }}
      />

      <header className="sticky top-0 z-40 border-b border-[#dfe6dc]/80 bg-white/80 backdrop-blur-xl">
        <div className="flex min-h-16 items-center justify-between gap-4 px-5 lg:px-8">
          <div className="flex items-center gap-3">
            <img
              src={content.brand.logo}
              alt=""
              className="h-9 w-9 rounded-xl object-cover ring-1 ring-[#dce2db]"
            />
            <div>
              <p className="text-sm font-bold tracking-tight">OCC Content Studio</p>
              <p className="text-[10px] uppercase tracking-[0.18em] text-[#718076]">
                Website administration
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <SaveStatus ready={ready} saveState={saveState} saveError={saveError} />
            <Link
              to="/"
              target="_blank"
              className="inline-flex items-center gap-2 rounded-xl border border-[#d5ddd6] bg-white px-3.5 py-2 text-xs font-semibold shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#788f7e] hover:shadow"
            >
              View website <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </header>

      <div className="grid min-h-[calc(100vh-4rem)] lg:grid-cols-[16rem_minmax(0,1fr)]">
        <aside className="relative border-b border-[#dce2db] bg-gradient-to-b from-[#1b2a20] via-[#17231b] to-[#101a13] p-4 text-white lg:border-b-0 lg:border-r lg:p-5">
          <nav aria-label="Admin sections" className="flex gap-2 overflow-x-auto lg:flex-col">
            {navigation.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => setView(id)}
                aria-current={view === id}
                className={`flex shrink-0 items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold transition-all lg:w-full ${
                  view === id
                    ? "bg-gradient-to-r from-[#d8a84e] to-[#c8943a] text-[#17231b] shadow-[0_8px_20px_rgba(216,168,78,0.25)]"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon className="h-4.5 w-4.5" />
                <span className="flex-1">{label}</span>
                {id === "messages" && inbox.unread > 0 && (
                  <span
                    aria-label={`${inbox.unread} unread`}
                    className={`grid min-w-5 place-items-center rounded-full px-1.5 text-[10px] font-bold ${
                      view === id ? "bg-[#17231b] text-[#d8a84e]" : "bg-[#d8a84e] text-[#17231b]"
                    }`}
                  >
                    {inbox.unread}
                  </span>
                )}
              </button>
            ))}
          </nav>

          <div className="mt-6 hidden rounded-2xl border border-white/10 bg-white/5 p-4 lg:block">
            <p className="text-xs font-semibold text-white">Local content mode</p>
            <p className="mt-2 text-xs leading-relaxed text-white/55">
              Edits are stored in this browser. Connect a database and secure login before using
              this dashboard across multiple devices.
            </p>
          </div>
        </aside>

        <main className="min-w-0 p-5 md:p-8 lg:p-10">
          <div className="mx-auto max-w-5xl">
            <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#9a6e22]">
                  Content management
                </p>
                <h1 className="mt-2 font-sans text-3xl font-bold tracking-tight md:text-4xl">
                  {heading.title}
                </h1>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#68746b]">
                  {view === "messages"
                    ? heading.blurb
                    : `${heading.blurb} Changes appear on the public site as soon as they are made.`}
                </p>
              </div>
              {view !== "messages" && (
                <button
                  type="button"
                  onClick={() => {
                    if (
                      window.confirm("Reset every editable field and image to its original value?")
                    ) {
                      resetContent();
                    }
                  }}
                  className="inline-flex items-center gap-2 rounded-xl border border-[#d5ddd6] bg-white px-4 py-2.5 text-xs font-semibold text-[#58655b] hover:border-[#a5b1a7]"
                >
                  <RotateCcw className="h-3.5 w-3.5" /> Reset all content
                </button>
              )}
            </div>

            {view === "home" && (
              <HomeEditor content={content} updateBrand={updateBrand} updateHome={updateHome} />
            )}
            {view === "messages" && <MessagesView inbox={inbox} />}
            {view === "categories" && (
              <CategoriesEditor content={content} setContent={setContent} />
            )}
            {view === "products" && <ProductsEditor content={content} setContent={setContent} />}
            {view === "partners" && <PartnersEditor content={content} setContent={setContent} />}
          </div>
        </main>
      </div>
    </div>
  );
}

function HomeEditor({
  content,
  updateBrand,
  updateHome,
}: {
  content: SiteContent;
  updateBrand: (field: keyof SiteContent["brand"], value: string) => void;
  updateHome: (section: keyof SiteContent["home"], field: string, value: string) => void;
}) {
  const sections: {
    id: keyof SiteContent["home"];
    title: string;
    description: string;
    image?: boolean;
  }[] = [
    {
      id: "hero",
      title: "Hero section",
      description: "The first message visitors see.",
      image: true,
    },
    {
      id: "about",
      title: "About OCC",
      description: "Company introduction and supporting image.",
      image: true,
    },
    {
      id: "products",
      title: "Products introduction",
      description: "Heading above the commodity catalog.",
    },
    {
      id: "whyEthiopia",
      title: "Why Ethiopia",
      description: "Origin and agricultural advantage introduction.",
    },
    { id: "whyOcc", title: "Why OCC", description: "Buyer assurance section heading." },
    {
      id: "process",
      title: "Sourcing process",
      description: "Introduction to the five-step process.",
    },
    {
      id: "contact",
      title: "Contact section",
      description: "Inquiry introduction and business contact details.",
    },
  ];

  return (
    <div className="space-y-5">
      <EditorSection
        title="Brand settings"
        description="Used in the site header and footer."
        defaultOpen
      >
        <div className="grid gap-5 md:grid-cols-2">
          <ImageField
            id="brand-logo"
            label="Logo"
            value={content.brand.logo}
            defaultValue={defaultSiteContent.brand.logo}
            onChange={(value) => updateBrand("logo", value)}
            compact
          />
          <div className="grid gap-4">
            <TextField
              label="Short name"
              value={content.brand.shortName}
              onChange={(v) => updateBrand("shortName", v)}
            />
            <TextField
              label="Organization name"
              value={content.brand.name}
              onChange={(v) => updateBrand("name", v)}
            />
          </div>
          <div className="md:col-span-2">
            <TextField
              label="Footer description"
              value={content.brand.footerDescription}
              onChange={(v) => updateBrand("footerDescription", v)}
              multiline
            />
          </div>
        </div>
      </EditorSection>

      {sections.map((item, index) => {
        const section = content.home[item.id] as Record<string, string>;
        const defaults = defaultSiteContent.home[item.id] as Record<string, string>;
        return (
          <EditorSection
            key={item.id}
            title={item.title}
            description={item.description}
            defaultOpen={index === 0}
          >
            <div className="grid gap-5 md:grid-cols-2">
              {item.image && (
                <div className="md:col-span-2">
                  <ImageField
                    id={`${item.id}-image`}
                    label="Section image"
                    value={section.image}
                    defaultValue={defaults.image}
                    onChange={(value) => updateHome(item.id, "image", value)}
                  />
                </div>
              )}
              {Object.entries(section)
                .filter(([field]) => field !== "image")
                .map(([field, value]) => (
                  <div
                    key={field}
                    className={
                      field === "description" || field === "imageCaption" || field === "address"
                        ? "md:col-span-2"
                        : ""
                    }
                  >
                    <TextField
                      label={humanize(field)}
                      value={value}
                      onChange={(next) => updateHome(item.id, field, next)}
                      multiline={
                        field === "description" || field === "imageCaption" || field === "address"
                      }
                    />
                  </div>
                ))}
            </div>
          </EditorSection>
        );
      })}
    </div>
  );
}

function MessagesView({ inbox }: { inbox: ReturnType<typeof useInbox> }) {
  const { messages, ready, setRead, remove, clearAll } = inbox;
  const [selectedId, setSelectedId] = useState("");
  const [filter, setFilter] = useState<"all" | "unread" | "rfq" | "contact">("all");

  const visible = messages.filter((message) =>
    filter === "all" ? true : filter === "unread" ? !message.read : message.kind === filter,
  );
  // The chosen message can be deleted or filtered away, so re-derive it.
  const selected = visible.find((message) => message.id === selectedId) ?? visible[0] ?? undefined;

  const open = (message: InboxMessage) => {
    setSelectedId(message.id);
    if (!message.read) setRead(message.id, true);
  };

  const filters: { id: typeof filter; label: string }[] = [
    { id: "all", label: `All (${messages.length})` },
    { id: "unread", label: `Unread (${messages.filter((m) => !m.read).length})` },
    { id: "rfq", label: "Quote requests" },
    { id: "contact", label: "Inquiries" },
  ];

  return (
    <div className="grid gap-6">
      <div className="flex items-start gap-3 rounded-2xl border border-[#e8dcc0] bg-[#fdf8ec] p-4">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-[#9a6e22]" />
        <p className="text-xs leading-relaxed text-[#6b5a34]">
          <strong className="font-semibold">These are browser-stored messages.</strong> A form
          submitted on a buyer's own computer is saved in <em>their</em> browser, so it will never
          reach this inbox. What you see here are submissions made from this browser. Connect the
          forms to a server endpoint or email service before relying on this for real leads.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {filters.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setFilter(item.id)}
              aria-pressed={filter === item.id}
              className={`rounded-full border px-3.5 py-2 text-xs font-semibold transition-colors ${
                filter === item.id
                  ? "border-[#1d4a2c] bg-[#1d4a2c] text-white"
                  : "border-[#d5ddd6] bg-white text-[#657068] hover:border-[#a5b1a7]"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
        {messages.length > 0 && (
          <button
            type="button"
            onClick={() => {
              if (window.confirm(`Delete all ${messages.length} messages? This cannot be undone.`))
                clearAll();
            }}
            className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-3.5 w-3.5" /> Delete all
          </button>
        )}
      </div>

      {!ready ? (
        <p className="text-sm text-[#748077]">Loading messages…</p>
      ) : messages.length === 0 ? (
        <div className="grid place-items-center rounded-2xl border border-dashed border-[#c9d3ca] bg-white/85 p-10 text-center backdrop-blur-sm">
          <div className="max-w-sm">
            <Inbox className="mx-auto h-8 w-8 text-[#9aa59c]" />
            <h2 className="mt-3 text-base font-bold tracking-tight">No messages yet</h2>
            <p className="mt-2 text-sm leading-relaxed text-[#748077]">
              Inquiries from the contact form and quote requests from product pages will appear
              here.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[20rem_minmax(0,1fr)]">
          <div className="h-fit rounded-2xl border border-[#dce2db]/90 bg-white/90 p-2 shadow-[0_18px_45px_-25px_rgba(24,39,28,0.35)] backdrop-blur-sm lg:sticky lg:top-24">
            <div className="max-h-[65vh] space-y-1 overflow-y-auto">
              {visible.map((message) => (
                <button
                  key={message.id}
                  type="button"
                  onClick={() => open(message)}
                  className={`w-full rounded-xl px-3 py-3 text-left transition-colors ${
                    selected?.id === message.id ? "bg-[#e9efe9]" : "hover:bg-[#f4f6f3]"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {message.read ? (
                      <MailOpen className="h-3.5 w-3.5 shrink-0 text-[#9aa59c]" />
                    ) : (
                      <Mail className="h-3.5 w-3.5 shrink-0 text-[#1d4a2c]" />
                    )}
                    <span
                      className={`truncate text-xs ${
                        message.read ? "font-medium text-[#657068]" : "font-bold text-[#17231b]"
                      }`}
                    >
                      {message.name || message.email || "Unnamed sender"}
                    </span>
                    <span
                      className={`ml-auto shrink-0 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.1em] ${
                        message.kind === "rfq"
                          ? "bg-[#e7dcc2] text-[#7a5c14]"
                          : "bg-[#e3ece4] text-[#3d6247]"
                      }`}
                    >
                      {message.kind === "rfq" ? "RFQ" : "Inquiry"}
                    </span>
                  </div>
                  <p className="mt-1 truncate text-xs text-[#748077]">
                    {message.subject || "No product specified"}
                  </p>
                  <p className="mt-0.5 text-[10px] text-[#9aa59c]">
                    {formatReceived(message.createdAt)}
                  </p>
                </button>
              ))}
              {visible.length === 0 && (
                <p className="px-3 py-6 text-center text-xs text-[#8b968d]">
                  Nothing matches this filter.
                </p>
              )}
            </div>
          </div>

          {selected ? (
            <div className="rounded-2xl border border-[#dce2db]/90 bg-white/90 p-5 shadow-[0_18px_45px_-25px_rgba(24,39,28,0.35)] backdrop-blur-sm md:p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="text-base font-bold tracking-tight">
                    {selected.kind === "rfq" ? "Quote request" : "Website inquiry"}
                    {selected.subject ? ` — ${selected.subject}` : ""}
                  </h2>
                  <p className="mt-1 text-xs text-[#748077]">
                    {selected.name}
                    {selected.company ? ` · ${selected.company}` : ""}
                    {selected.country ? ` · ${selected.country}` : ""} ·{" "}
                    {formatReceived(selected.createdAt)}
                  </p>
                </div>
                <div className="flex shrink-0 flex-wrap gap-2">
                  {selected.email && (
                    <a
                      href={replyHref(selected)}
                      className="inline-flex items-center gap-2 rounded-xl bg-[#1d4a2c] px-3.5 py-2.5 text-xs font-semibold text-white hover:bg-[#173d24]"
                    >
                      <Mail className="h-3.5 w-3.5" /> Reply by email
                    </a>
                  )}
                  <button
                    type="button"
                    onClick={() => setRead(selected.id, !selected.read)}
                    className="rounded-xl border border-[#d5ddd6] bg-white px-3.5 py-2.5 text-xs font-semibold text-[#657068] hover:border-[#a5b1a7]"
                  >
                    Mark {selected.read ? "unread" : "read"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm("Delete this message?")) remove(selected.id);
                    }}
                    className="inline-flex items-center gap-2 rounded-xl px-3 py-2.5 text-xs font-semibold text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              <dl className="mt-5 grid gap-4 sm:grid-cols-2">
                {selected.fields
                  .filter((field) => field.value)
                  .map((field) => (
                    <div
                      key={field.label}
                      className={
                        field.label === "Message" || field.label === "Additional notes"
                          ? "sm:col-span-2"
                          : ""
                      }
                    >
                      <dt className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#718076]">
                        {field.label}
                      </dt>
                      <dd className="mt-1 whitespace-pre-wrap break-words text-sm text-[#1c271f]">
                        {field.value}
                      </dd>
                    </div>
                  ))}
              </dl>
            </div>
          ) : (
            <div className="grid place-items-center rounded-2xl border border-dashed border-[#c9d3ca] bg-white/85 p-10 text-center text-sm text-[#748077] backdrop-blur-sm">
              Select a message to read it.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const CATEGORY_ICONS = ["☕", "🌻", "🫘", "🌾", "🌰", "🧂", "🍯", "🌿", "🥜", "🫒", "🍫", "📦"];

function CategoriesEditor({ content, setContent }: EditorProps) {
  const entries = Object.entries(content.categories);
  const available = entries.filter(([, item]) => !item.deleted);
  const removed = entries.filter(([, item]) => item.deleted);
  const [selected, setSelected] = useState("");
  const selectable = content.categories[selected];
  const id = selectable && !selectable.deleted ? selected : (available[0]?.[0] ?? "");
  const category = id ? content.categories[id] : undefined;
  const [autoSlug, setAutoSlug] = useState<string | null>(null);

  const managed = buildManagedCategories(content);
  const productCount = managed.find((item) => item.id === id)?.products.length ?? 0;
  const firstOtherTitle =
    managed.find((item) => item.id !== id)?.title ?? "the first remaining group";

  const writeCategories = (nextCategories: SiteContent["categories"]) =>
    setContent({ ...content, categories: nextCategories });

  const update = (field: "title" | "blurb" | "icon", value: string) => {
    if (!category) return;
    writeCategories({ ...content.categories, [id]: { ...category, [field]: value } });
  };

  const updateTitle = (value: string) => {
    if (!category) return;
    let next = { ...content.categories, [id]: { ...category, title: value } };
    const candidate = slugify(value);
    if (autoSlug === id && candidate && !isSlugTaken(next, candidate, id)) {
      next = renameRecordKey(next, id, candidate);
      // Products keep pointing at their group when its ID changes.
      const products = Object.fromEntries(
        Object.entries(content.products).map(([slug, product]) => [
          slug,
          product.categoryId === id ? { ...product, categoryId: candidate } : product,
        ]),
      );
      setAutoSlug(candidate);
      setSelected(candidate);
      setContent({ ...content, categories: next, products });
      return;
    }
    writeCategories(next);
  };

  const renameId = (nextId: string) => {
    const products = Object.fromEntries(
      Object.entries(content.products).map(([slug, product]) => [
        slug,
        product.categoryId === id ? { ...product, categoryId: nextId } : product,
      ]),
    );
    setContent({
      ...content,
      categories: renameRecordKey(content.categories, id, nextId),
      products,
    });
    setAutoSlug(null);
    setSelected(nextId);
  };

  const createCategory = () => {
    const nextId = uniqueSlug("new-category", content.categories);
    writeCategories({
      ...content.categories,
      [nextId]: {
        title: "New category",
        blurb: "Describe what this commodity group covers.",
        icon: "📦",
        custom: true,
      },
    });
    setSelected(nextId);
    setAutoSlug(nextId);
  };

  const deleteCategory = () => {
    if (!category) return;
    if (available.length <= 1) {
      window.alert("Keep at least one category — products need a group to live in.");
      return;
    }
    const moved =
      productCount > 0
        ? `\n\n${productCount} product${productCount === 1 ? "" : "s"} will move to “${firstOtherTitle}”.`
        : "";
    const permanent = Boolean(category.custom);
    const question = permanent
      ? `Permanently delete “${category.title}”? This cannot be undone.${moved}`
      : `Remove “${category.title}” from the site? You can restore it later.${moved}`;
    if (!window.confirm(question)) return;
    const next = { ...content.categories };
    if (permanent) delete next[id];
    else next[id] = { ...category, deleted: true };
    writeCategories(next);
    setSelected(Object.entries(next).find(([, item]) => !item.deleted)?.[0] ?? "");
  };

  const restoreCategory = (itemId: string) => {
    const item = content.categories[itemId];
    if (!item) return;
    const { deleted: _deleted, ...rest } = item;
    writeCategories({ ...content.categories, [itemId]: rest });
    setSelected(itemId);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[16rem_minmax(0,1fr)]">
      <RecordList
        label="Select category"
        createLabel="Create category"
        onCreate={createCategory}
        items={available.map(([itemId, item]) => ({
          slug: itemId,
          name: `${item.icon} ${item.title}`,
          custom: Boolean(item.custom),
        }))}
        removed={removed.map(([itemId, item]) => ({ slug: itemId, name: item.title }))}
        activeSlug={id}
        onSelect={setSelected}
        onRestore={restoreCategory}
      />

      {category ? (
        <EditorSection
          title={category.title || "Untitled category"}
          description="Commodity group shown on the homepage catalog."
          defaultOpen
        >
          <div className="grid gap-5">
            <RecordHeader
              slug={id}
              editable={Boolean(category.custom)}
              isTaken={(candidate) => isSlugTaken(content.categories, candidate, id)}
              onRename={renameId}
              onDelete={deleteCategory}
              deleteLabel="Delete category"
              publicPath={`/#${id}`}
            />
            <p className="rounded-xl bg-[#f2f6ef] px-4 py-3 text-xs text-[#5c6b60]">
              {productCount === 0
                ? "No products are assigned to this category yet."
                : `${productCount} product${productCount === 1 ? "" : "s"} currently sit${productCount === 1 ? "s" : ""} in this category.`}
            </p>
            <TextField label="Category title" value={category.title} onChange={updateTitle} />
            <div>
              <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.16em] text-[#718076]">
                Icon
              </span>
              <div className="flex flex-wrap gap-2">
                {CATEGORY_ICONS.map((icon) => (
                  <button
                    key={icon}
                    type="button"
                    onClick={() => update("icon", icon)}
                    aria-label={`Use ${icon} as the category icon`}
                    aria-pressed={category.icon === icon}
                    className={`grid h-11 w-11 place-items-center rounded-xl border text-lg transition-colors ${
                      category.icon === icon
                        ? "border-[#1d4a2c] bg-[#e9efe9]"
                        : "border-[#dce2db] bg-white hover:border-[#a5b1a7]"
                    }`}
                  >
                    {icon}
                  </button>
                ))}
                <input
                  value={category.icon}
                  onChange={(event) => update("icon", event.target.value.slice(0, 4))}
                  aria-label="Custom category icon"
                  className="h-11 w-20 rounded-xl border border-[#dce2db] bg-white text-center text-lg outline-none focus:border-[#688270]"
                />
              </div>
            </div>
            <TextField
              label="Short description"
              value={category.blurb}
              onChange={(v) => update("blurb", v)}
              multiline
            />
          </div>
        </EditorSection>
      ) : (
        <EmptyRecordState
          title="No categories on the site"
          description="Create a commodity group so products have somewhere to live."
          actionLabel="Create category"
          onAction={createCategory}
        />
      )}
    </div>
  );
}

function ProductsEditor({ content, setContent }: EditorProps) {
  const entries = Object.entries(content.products);
  const available = entries.filter(([, item]) => !item.deleted);
  const removed = entries.filter(([, item]) => item.deleted);
  const [selected, setSelected] = useState("");
  // The stored selection can disappear (deleted here or in another tab), so the
  // active record is always re-derived from the content that actually exists.
  const selectable = content.products[selected];
  const slug = selectable && !selectable.deleted ? selected : (available[0]?.[0] ?? "");
  const product = slug ? content.products[slug] : undefined;
  const original = defaultSiteContent.products[slug];
  const managedCategories = buildManagedCategories(content);
  // A freshly created record keeps its ID in sync with the name until the
  // editor sets one explicitly.
  const [autoSlug, setAutoSlug] = useState<string | null>(null);

  const writeProducts = (products: SiteContent["products"]) => setContent({ ...content, products });

  const update = (field: "tagline" | "overview" | "image" | "categoryId", value: string) => {
    if (!product) return;
    writeProducts({ ...content.products, [slug]: { ...product, [field]: value } });
  };

  const updateName = (value: string) => {
    if (!product) return;
    let products = { ...content.products, [slug]: { ...product, name: value } };
    const candidate = slugify(value);
    if (autoSlug === slug && candidate && !isSlugTaken(products, candidate, slug)) {
      products = renameRecordKey(products, slug, candidate);
      setAutoSlug(candidate);
      setSelected(candidate);
    }
    writeProducts(products);
  };

  const renameSlug = (nextSlug: string) => {
    writeProducts(renameRecordKey(content.products, slug, nextSlug));
    setAutoSlug(null);
    setSelected(nextSlug);
  };

  const updateRegions = (value: string) => {
    if (!product) return;
    writeProducts({
      ...content.products,
      [slug]: {
        ...product,
        regions: value
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
      },
    });
  };

  const updateGallery = (gallery: string[]) => {
    if (!product) return;
    writeProducts({ ...content.products, [slug]: { ...product, gallery } });
  };

  const createProduct = () => {
    const nextSlug = uniqueSlug("new-product", content.products);
    writeProducts({
      ...content.products,
      [nextSlug]: {
        name: "New product",
        tagline: "Add a short product tagline.",
        overview: "Add the full product overview here.",
        image: "/favicon.png",
        categoryId: categories[0]?.id ?? "coffee",
        regions: [],
        custom: true,
      },
    });
    setSelected(nextSlug);
    setAutoSlug(nextSlug);
  };

  const deleteProduct = () => {
    if (!product) return;
    const permanent = Boolean(product.custom);
    const question = permanent
      ? `Permanently delete “${product.name}”? This cannot be undone.`
      : `Remove “${product.name}” from the catalog? You can restore it later.`;
    if (!window.confirm(question)) return;
    const nextProducts = { ...content.products };
    if (permanent) delete nextProducts[slug];
    else nextProducts[slug] = { ...product, deleted: true };
    writeProducts(nextProducts);
    setSelected(Object.entries(nextProducts).find(([, item]) => !item.deleted)?.[0] ?? "");
  };

  const restoreProduct = (itemSlug: string) => {
    const item = content.products[itemSlug];
    if (!item) return;
    const { deleted: _deleted, ...rest } = item;
    writeProducts({ ...content.products, [itemSlug]: rest });
    setSelected(itemSlug);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[16rem_minmax(0,1fr)]">
      <RecordList
        label="Select product"
        createLabel="Create product"
        onCreate={createProduct}
        items={available.map(([itemSlug, item]) => ({
          slug: itemSlug,
          name: item.name,
          custom: Boolean(item.custom),
        }))}
        removed={removed.map(([itemSlug, item]) => ({ slug: itemSlug, name: item.name }))}
        activeSlug={slug}
        onSelect={setSelected}
        onRestore={restoreProduct}
      />

      {product ? (
        <EditorSection
          title={product.name || "Untitled product"}
          description="Catalog card and product detail content."
          defaultOpen
        >
          <div className="grid gap-5">
            <RecordHeader
              slug={slug}
              editable={Boolean(product.custom)}
              isTaken={(candidate) => isSlugTaken(content.products, candidate, slug)}
              onRename={renameSlug}
              onDelete={deleteProduct}
              deleteLabel="Delete product"
              publicPath={`/products/${slug}`}
            />
            <ImageField
              id={`product-${slug}`}
              label="Main product image"
              value={product.image}
              defaultValue={original?.image ?? "/favicon.png"}
              onChange={(v) => update("image", v)}
              onRemove={() => update("image", "")}
            />
            <GalleryField
              id={`product-gallery-${slug}`}
              label="More pictures"
              description="Shown as thumbnails on the product page, after the main image."
              images={product.gallery ?? []}
              onChange={updateGallery}
            />
            <TextField label="Product name" value={product.name} onChange={updateName} />
            <label className="block">
              <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.16em] text-[#718076]">
                Category
              </span>
              <select
                value={product.categoryId}
                onChange={(e) => update("categoryId", e.target.value)}
                className={inputClass}
              >
                {managedCategories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.title}
                  </option>
                ))}
              </select>
            </label>
            <TextField
              label="Tagline"
              value={product.tagline}
              onChange={(v) => update("tagline", v)}
              multiline
            />
            <TextField
              label="Overview"
              value={product.overview}
              onChange={(v) => update("overview", v)}
              multiline
            />
            <TextField
              label="Sourcing regions (comma separated)"
              value={product.regions.join(", ")}
              onChange={updateRegions}
            />
          </div>
        </EditorSection>
      ) : (
        <EmptyRecordState
          title="No products in the catalog"
          description="Create a product to start building the catalog again, or restore one you removed."
          actionLabel="Create product"
          onAction={createProduct}
        />
      )}
    </div>
  );
}

function PartnersEditor({ content, setContent }: EditorProps) {
  const entries = Object.entries(content.partners);
  const available = entries.filter(([, item]) => !item.deleted);
  const removed = entries.filter(([, item]) => item.deleted);
  const [selected, setSelected] = useState("");
  const selectable = content.partners[selected];
  const slug = selectable && !selectable.deleted ? selected : (available[0]?.[0] ?? "");
  const partner = slug ? content.partners[slug] : undefined;
  const original = defaultSiteContent.partners[slug];
  const [autoSlug, setAutoSlug] = useState<string | null>(null);

  const writePartners = (partners: SiteContent["partners"]) => setContent({ ...content, partners });

  const update = (
    field: "category" | "url" | "tagline" | "longDescription" | "image",
    value: string,
  ) => {
    if (!partner) return;
    writePartners({ ...content.partners, [slug]: { ...partner, [field]: value } });
  };

  const updateName = (value: string) => {
    if (!partner) return;
    let partners = { ...content.partners, [slug]: { ...partner, name: value } };
    const candidate = slugify(value);
    if (autoSlug === slug && candidate && !isSlugTaken(partners, candidate, slug)) {
      partners = renameRecordKey(partners, slug, candidate);
      setAutoSlug(candidate);
      setSelected(candidate);
    }
    writePartners(partners);
  };

  const renameSlug = (nextSlug: string) => {
    writePartners(renameRecordKey(content.partners, slug, nextSlug));
    setAutoSlug(null);
    setSelected(nextSlug);
  };

  const createPartner = () => {
    const nextSlug = uniqueSlug("new-partner", content.partners);
    writePartners({
      ...content.partners,
      [nextSlug]: {
        name: "New partner",
        category: "Processing & technology partner",
        url: "https://example.com",
        tagline: "Add a short partner tagline.",
        longDescription: "Add the complete partner description here.",
        image: "/favicon.png",
        custom: true,
      },
    });
    setSelected(nextSlug);
    setAutoSlug(nextSlug);
  };

  const deletePartner = () => {
    if (!partner) return;
    const permanent = Boolean(partner.custom);
    const question = permanent
      ? `Permanently delete “${partner.name}”? This cannot be undone.`
      : `Remove “${partner.name}” from the partner page? You can restore it later.`;
    if (!window.confirm(question)) return;
    const nextPartners = { ...content.partners };
    if (permanent) delete nextPartners[slug];
    else nextPartners[slug] = { ...partner, deleted: true };
    writePartners(nextPartners);
    setSelected(Object.entries(nextPartners).find(([, item]) => !item.deleted)?.[0] ?? "");
  };

  const restorePartner = (itemSlug: string) => {
    const item = content.partners[itemSlug];
    if (!item) return;
    const { deleted: _deleted, ...rest } = item;
    writePartners({ ...content.partners, [itemSlug]: rest });
    setSelected(itemSlug);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[16rem_minmax(0,1fr)]">
      <RecordList
        label="Select partner"
        createLabel="Create partner"
        onCreate={createPartner}
        items={available.map(([itemSlug, item]) => ({
          slug: itemSlug,
          name: item.name,
          custom: Boolean(item.custom),
        }))}
        removed={removed.map(([itemSlug, item]) => ({ slug: itemSlug, name: item.name }))}
        activeSlug={slug}
        onSelect={setSelected}
        onRestore={restorePartner}
      />

      {partner ? (
        <EditorSection
          title={partner.name || "Untitled partner"}
          description="Partner profile and lead gallery image."
          defaultOpen
        >
          <div className="grid gap-5">
            <RecordHeader
              slug={slug}
              editable={Boolean(partner.custom)}
              isTaken={(candidate) => isSlugTaken(content.partners, candidate, slug)}
              onRename={renameSlug}
              onDelete={deletePartner}
              deleteLabel="Delete partner"
            />
            <ImageField
              id={`partner-${slug}`}
              label="Lead image"
              value={partner.image}
              defaultValue={original?.image ?? "/favicon.png"}
              onChange={(v) => update("image", v)}
            />
            <TextField label="Partner name" value={partner.name} onChange={updateName} />
            <TextField
              label="Partner category"
              value={partner.category}
              onChange={(v) => update("category", v)}
            />
            <TextField label="Website URL" value={partner.url} onChange={(v) => update("url", v)} />
            <TextField
              label="Tagline"
              value={partner.tagline}
              onChange={(v) => update("tagline", v)}
              multiline
            />
            <TextField
              label="Long description"
              value={partner.longDescription}
              onChange={(v) => update("longDescription", v)}
              multiline
            />
          </div>
        </EditorSection>
      ) : (
        <EmptyRecordState
          title="No partners published"
          description="Create a partner profile, or restore one you removed."
          actionLabel="Create partner"
          onAction={createPartner}
        />
      )}
    </div>
  );
}

type EditorProps = {
  content: SiteContent;
  setContent: (content: SiteContent) => void;
};

function SaveStatus({
  ready,
  saveState,
  saveError,
}: {
  ready: boolean;
  saveState: SaveState;
  saveError: string;
}) {
  if (saveError) {
    return (
      <span
        role="alert"
        className="flex max-w-[22rem] items-start gap-1.5 text-xs font-semibold text-red-700"
      >
        <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        {saveError}
      </span>
    );
  }
  const saving = !ready || saveState === "saving";
  return (
    <span className="hidden items-center gap-1.5 text-xs font-medium text-[#587060] sm:flex">
      {saving ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
      ) : (
        <Check className="h-3.5 w-3.5" />
      )}
      {!ready ? "Loading content" : saveState === "saving" ? "Saving…" : "Changes saved"}
    </span>
  );
}

type RecordListItem = { slug: string; name: string; custom: boolean };

function RecordList({
  label,
  createLabel,
  onCreate,
  items,
  removed,
  activeSlug,
  onSelect,
  onRestore,
}: {
  label: string;
  createLabel: string;
  onCreate: () => void;
  items: RecordListItem[];
  removed: { slug: string; name: string }[];
  activeSlug: string;
  onSelect: (slug: string) => void;
  onRestore: (slug: string) => void;
}) {
  const [query, setQuery] = useState("");
  const listRef = useRef<HTMLDivElement>(null);
  const term = query.trim().toLowerCase();
  const visible = term
    ? items.filter(
        (item) => item.name.toLowerCase().includes(term) || item.slug.toLowerCase().includes(term),
      )
    : items;

  // Records created or renamed while scrolled away must stay visible.
  useEffect(() => {
    listRef.current?.querySelector('[data-active="true"]')?.scrollIntoView({ block: "nearest" });
  }, [activeSlug]);

  return (
    <div className="h-fit rounded-2xl border border-[#dce2db]/90 bg-white/90 p-3 shadow-[0_18px_45px_-25px_rgba(24,39,28,0.35)] backdrop-blur-sm lg:sticky lg:top-24">
      <span className="px-2 text-[10px] font-bold uppercase tracking-[0.16em] text-[#78847a]">
        {label}
      </span>
      <button
        type="button"
        onClick={onCreate}
        className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#1d4a2c] px-3 py-2.5 text-xs font-semibold text-white hover:bg-[#173d24]"
      >
        <Plus className="h-3.5 w-3.5" /> {createLabel}
      </button>

      {items.length > 6 && (
        <div className="relative mt-2">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#93a096]" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search"
            aria-label={`Search ${label.toLowerCase()}`}
            className={`${inputClass} py-2.5 pl-9 text-xs`}
          />
        </div>
      )}

      <select
        aria-label={label}
        value={activeSlug}
        onChange={(event) => onSelect(event.target.value)}
        className={`${inputClass} mt-2 lg:hidden`}
      >
        {items.map((item) => (
          <option key={item.slug} value={item.slug}>
            {item.name || item.slug}
          </option>
        ))}
      </select>

      <div ref={listRef} className="mt-2 hidden max-h-[55vh] space-y-1 overflow-y-auto lg:block">
        {visible.map((item) => (
          <button
            key={item.slug}
            type="button"
            data-active={item.slug === activeSlug}
            onClick={() => onSelect(item.slug)}
            className={`flex w-full items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-left text-xs font-semibold ${
              item.slug === activeSlug
                ? "bg-[#e9efe9] text-[#1d4a2c]"
                : "text-[#657068] hover:bg-[#f4f6f3]"
            }`}
          >
            <span className="truncate">{item.name || item.slug}</span>
            {item.custom && (
              <span className="shrink-0 rounded-full bg-[#e7dcc2] px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.1em] text-[#7a5c14]">
                New
              </span>
            )}
          </button>
        ))}
        {visible.length === 0 && (
          <p className="px-3 py-4 text-xs text-[#8b968d]">No matches for “{query}”.</p>
        )}
      </div>

      {removed.length > 0 && (
        <details className="mt-3 border-t border-[#e8ece7] pt-3">
          <summary className="cursor-pointer px-2 text-[10px] font-bold uppercase tracking-[0.16em] text-[#78847a]">
            Removed ({removed.length})
          </summary>
          <div className="mt-2 space-y-1">
            {removed.map((item) => (
              <div
                key={item.slug}
                className="flex items-center justify-between gap-2 rounded-xl px-3 py-2 text-xs text-[#8b968d]"
              >
                <span className="truncate line-through">{item.name || item.slug}</span>
                <button
                  type="button"
                  onClick={() => onRestore(item.slug)}
                  className="inline-flex shrink-0 items-center gap-1 rounded-lg px-2 py-1 font-semibold text-[#1d4a2c] hover:bg-[#eef2ed]"
                >
                  <Undo2 className="h-3 w-3" /> Restore
                </button>
              </div>
            ))}
          </div>
        </details>
      )}
    </div>
  );
}

function RecordHeader({
  slug,
  editable,
  isTaken,
  onRename,
  onDelete,
  deleteLabel,
  publicPath,
}: {
  slug: string;
  editable: boolean;
  isTaken: (candidate: string) => boolean;
  onRename: (slug: string) => void;
  onDelete: () => void;
  deleteLabel: string;
  publicPath?: string;
}) {
  const [draft, setDraft] = useState(slug);
  useEffect(() => setDraft(slug), [slug]);

  const cleaned = slugify(draft);
  const error = !cleaned
    ? "Enter a record ID."
    : isTaken(cleaned)
      ? "That record ID is already in use."
      : "";

  const commit = () => {
    if (error) {
      setDraft(slug);
      return;
    }
    if (cleaned !== slug) onRename(cleaned);
    else setDraft(slug);
  };

  return (
    <div className="rounded-xl bg-[#f6f8f5] p-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {editable ? (
          <label className="flex min-w-0 flex-1 items-center gap-2 text-xs text-[#718076]">
            <span className="shrink-0">Record ID</span>
            <input
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onBlur={commit}
              onKeyDown={(event) => {
                if (event.key === "Enter") event.currentTarget.blur();
                if (event.key === "Escape") setDraft(slug);
              }}
              aria-invalid={Boolean(error)}
              className={`min-w-0 flex-1 rounded-lg border bg-white px-2.5 py-1.5 font-mono text-xs text-[#34463a] outline-none ${
                error ? "border-red-400" : "border-[#d5ddd6] focus:border-[#688270]"
              }`}
            />
          </label>
        ) : (
          <p className="text-xs text-[#718076]">
            Record ID: <span className="font-mono text-[#34463a]">{slug}</span>
          </p>
        )}
        <button
          type="button"
          onClick={onDelete}
          className="inline-flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-50"
        >
          <Trash2 className="h-3.5 w-3.5" /> {deleteLabel}
        </button>
      </div>
      {editable && (error || publicPath) && (
        <p className={`mt-2 text-xs ${error ? "font-semibold text-red-700" : "text-[#8b968d]"}`}>
          {error || `Public address: ${publicPath}`}
        </p>
      )}
    </div>
  );
}

function EmptyRecordState({
  title,
  description,
  actionLabel,
  onAction,
}: {
  title: string;
  description: string;
  actionLabel: string;
  onAction: () => void;
}) {
  return (
    <div className="grid place-items-center rounded-2xl border border-dashed border-[#c9d3ca] bg-white/85 p-10 text-center backdrop-blur-sm">
      <div className="max-w-sm">
        <h2 className="text-base font-bold tracking-tight">{title}</h2>
        <p className="mt-2 text-sm leading-relaxed text-[#748077]">{description}</p>
        <button
          type="button"
          onClick={onAction}
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#1d4a2c] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#173d24]"
        >
          <Plus className="h-3.5 w-3.5" /> {actionLabel}
        </button>
      </div>
    </div>
  );
}

function EditorSection({
  title,
  description,
  children,
  defaultOpen = false,
}: {
  title: string;
  description: string;
  children: ReactNode;
  defaultOpen?: boolean;
}) {
  return (
    <details
      open={defaultOpen}
      className="group rounded-2xl border border-[#dce2db]/90 bg-white/90 shadow-[0_18px_45px_-25px_rgba(24,39,28,0.35)] backdrop-blur-sm transition-shadow hover:shadow-[0_22px_55px_-25px_rgba(24,39,28,0.4)]"
    >
      <summary className="cursor-pointer list-none px-5 py-5 marker:hidden md:px-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold tracking-tight">{title}</h2>
            <p className="mt-1 text-xs text-[#748077]">{description}</p>
          </div>
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#f0f3ef] text-lg transition-transform group-open:rotate-45">
            +
          </span>
        </div>
      </summary>
      <div className="border-t border-[#e4e9e3] p-5 md:p-6">{children}</div>
    </details>
  );
}

const inputClass =
  "w-full rounded-xl border border-[#d5ddd6] bg-[#fbfcfa] px-3.5 py-3 text-sm text-[#1c271f] outline-none transition focus:border-[#688270] focus:ring-2 focus:ring-[#688270]/15";

function TextField({
  label,
  value,
  onChange,
  multiline = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.16em] text-[#718076]">
        {label}
      </span>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={4}
          className={`${inputClass} resize-y leading-relaxed`}
        />
      ) : (
        <input value={value} onChange={(e) => onChange(e.target.value)} className={inputClass} />
      )}
    </label>
  );
}

/** Validates and compresses a picked file, reporting problems back to the UI. */
async function readPickedImages(
  files: FileList | null,
  onError: (message: string) => void,
): Promise<string[]> {
  const picked = Array.from(files ?? []);
  const ready: string[] = [];
  for (const file of picked) {
    if (!file.type.startsWith("image/")) {
      onError("Choose a JPG, PNG or WebP image.");
      continue;
    }
    if (file.size > 8 * 1024 * 1024) {
      onError(`“${file.name}” is larger than 8 MB.`);
      continue;
    }
    try {
      ready.push(await compressImage(file));
    } catch {
      onError("This image could not be processed. Try a JPG or PNG file.");
    }
  }
  return ready;
}

function ImageField({
  id,
  label,
  value,
  defaultValue,
  onChange,
  onRemove,
  compact = false,
}: {
  id: string;
  label: string;
  value: string;
  defaultValue: string;
  onChange: (value: string) => void;
  onRemove?: () => void;
  compact?: boolean;
}) {
  const [error, setError] = useState("");

  const onFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    event.target.value = "";
    setError("");
    const [image] = await readPickedImages(files, setError);
    if (image) onChange(image);
  };

  return (
    <div>
      <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.16em] text-[#718076]">
        {label}
      </span>
      <div
        className={`grid gap-4 rounded-2xl border border-[#dce2db] bg-[#f7f9f6] p-3 ${compact ? "grid-cols-[7rem_minmax(0,1fr)]" : "sm:grid-cols-[12rem_minmax(0,1fr)]"}`}
      >
        <div
          className={`overflow-hidden rounded-xl bg-[#e8ece7] ${compact ? "aspect-square" : "aspect-[4/3]"}`}
        >
          {value ? (
            <img
              src={value}
              alt="Current content"
              onError={(event) => {
                event.currentTarget.src = "/favicon.png";
              }}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="grid h-full place-items-center">
              <ImageIcon className="h-7 w-7 text-[#9aa59c]" />
            </div>
          )}
        </div>
        <div className="flex min-w-0 flex-col justify-center">
          <p className="text-xs leading-relaxed text-[#718076]">
            Images are optimized before saving. JPG, PNG and WebP up to 8 MB.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <label
              htmlFor={id}
              className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-[#1d4a2c] px-3.5 py-2.5 text-xs font-semibold text-white hover:bg-[#173d24]"
            >
              <Upload className="h-3.5 w-3.5" /> Replace image
            </label>
            <input
              id={id}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={onFile}
              className="sr-only"
            />
            {value !== defaultValue && (
              <button
                type="button"
                onClick={() => onChange(defaultValue)}
                className="rounded-xl border border-[#d5ddd6] bg-white px-3.5 py-2.5 text-xs font-semibold text-[#657068] hover:border-[#a5b1a7]"
              >
                Restore original
              </button>
            )}
            {onRemove && value && (
              <button
                type="button"
                onClick={onRemove}
                className="inline-flex items-center gap-2 rounded-xl border border-[#e7cccc] bg-white px-3.5 py-2.5 text-xs font-semibold text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-3.5 w-3.5" /> Remove
              </button>
            )}
          </div>
          {error && (
            <p role="alert" className="mt-2 text-xs font-semibold text-red-700">
              {error}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function GalleryField({
  id,
  label,
  description,
  images,
  onChange,
}: {
  id: string;
  label: string;
  description: string;
  images: string[];
  onChange: (images: string[]) => void;
}) {
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const onFiles = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    event.target.value = "";
    setError("");
    setBusy(true);
    const added = await readPickedImages(files, setError);
    setBusy(false);
    if (added.length > 0) onChange([...images, ...added]);
  };

  const move = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= images.length) return;
    const next = [...images];
    [next[index], next[target]] = [next[target]!, next[index]!];
    onChange(next);
  };

  return (
    <div>
      <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.16em] text-[#718076]">
        {label}
      </span>
      <div className="rounded-2xl border border-[#dce2db] bg-[#f7f9f6] p-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs leading-relaxed text-[#718076]">{description}</p>
          <label
            htmlFor={id}
            className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-[#1d4a2c] px-3.5 py-2.5 text-xs font-semibold text-white hover:bg-[#173d24]"
          >
            {busy ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Plus className="h-3.5 w-3.5" />
            )}
            Add pictures
          </label>
          <input
            id={id}
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp"
            onChange={onFiles}
            className="sr-only"
          />
        </div>

        {images.length > 0 ? (
          <ul className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-4">
            {images.map((image, index) => (
              <li
                key={`${image.slice(0, 32)}-${index}`}
                className="group relative overflow-hidden rounded-xl border border-[#dce2db] bg-[#e8ece7]"
              >
                <img
                  src={image}
                  alt={`Picture ${index + 1}`}
                  onError={(event) => {
                    event.currentTarget.src = "/favicon.png";
                  }}
                  className="aspect-square w-full object-cover"
                />
                <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-1 bg-[#17231b]/80 px-1.5 py-1 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
                  <div className="flex gap-0.5">
                    <button
                      type="button"
                      onClick={() => move(index, -1)}
                      disabled={index === 0}
                      aria-label={`Move picture ${index + 1} earlier`}
                      className="rounded px-1.5 py-0.5 text-xs text-white disabled:opacity-30"
                    >
                      ←
                    </button>
                    <button
                      type="button"
                      onClick={() => move(index, 1)}
                      disabled={index === images.length - 1}
                      aria-label={`Move picture ${index + 1} later`}
                      className="rounded px-1.5 py-0.5 text-xs text-white disabled:opacity-30"
                    >
                      →
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => onChange(images.filter((_, i) => i !== index))}
                    aria-label={`Delete picture ${index + 1}`}
                    className="rounded p-1 text-white hover:text-red-300"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 rounded-xl border border-dashed border-[#c9d3ca] px-4 py-6 text-center text-xs text-[#8b968d]">
            No extra pictures yet.
          </p>
        )}

        {error && (
          <p role="alert" className="mt-2 text-xs font-semibold text-red-700">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}

async function compressImage(file: File): Promise<string> {
  const bitmap = await createImageBitmap(file);
  const maxDimension = 1800;
  const scale = Math.min(1, maxDimension / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(bitmap.width * scale));
  canvas.height = Math.max(1, Math.round(bitmap.height * scale));
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Canvas is unavailable");
  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/webp", 0.82),
  );
  if (!blob) throw new Error("Image compression failed");
  return await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}

function humanize(value: string) {
  return value.replace(/([A-Z])/g, " $1").replace(/^./, (letter) => letter.toUpperCase());
}

function uniqueSlug(base: string, records: Record<string, unknown>) {
  let slug = base;
  let suffix = 2;
  while (slug in records) {
    slug = `${base}-${suffix}`;
    suffix += 1;
  }
  return slug;
}
