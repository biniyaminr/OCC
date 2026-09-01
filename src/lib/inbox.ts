import { useCallback, useEffect, useState } from "react";

/**
 * Inquiries submitted through the contact form and the RFQ modal.
 *
 * IMPORTANT: this is browser storage, not a mailbox. A message is only visible
 * in the browser it was submitted from, so the studio inbox shows your own test
 * submissions — not inquiries sent by buyers on their own machines. Wire the
 * forms to a server endpoint before relying on this for real leads.
 */
const INBOX_KEY = "occ-inbox-v1";
const CHANGE_EVENT = "occ-inbox-change";
const MAX_MESSAGES = 200;

export type InboxField = { label: string; value: string };

export type InboxMessage = {
  id: string;
  kind: "contact" | "rfq";
  createdAt: string;
  read: boolean;
  subject: string;
  name: string;
  email: string;
  company: string;
  country: string;
  fields: InboxField[];
};

export type NewMessage = Omit<InboxMessage, "id" | "createdAt" | "read">;

function readInbox(): InboxMessage[] {
  try {
    const raw = window.localStorage.getItem(INBOX_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? (parsed as InboxMessage[]) : [];
  } catch {
    return [];
  }
}

function writeInbox(messages: InboxMessage[]) {
  try {
    window.localStorage.setItem(INBOX_KEY, JSON.stringify(messages.slice(0, MAX_MESSAGES)));
    window.dispatchEvent(new CustomEvent(CHANGE_EVENT));
    return true;
  } catch {
    return false;
  }
}

/** Called by the public forms. Newest message first. */
export function addMessage(message: NewMessage): boolean {
  const entry: InboxMessage = {
    ...message,
    id: globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    createdAt: new Date().toISOString(),
    read: false,
  };
  return writeInbox([entry, ...readInbox()]);
}

export function useInbox() {
  const [messages, setMessages] = useState<InboxMessage[]>([]);
  const [ready, setReady] = useState(false);

  const refresh = useCallback(() => setMessages(readInbox()), []);

  useEffect(() => {
    refresh();
    setReady(true);
    const onStorage = (event: StorageEvent) => {
      if (event.key === INBOX_KEY) refresh();
    };
    window.addEventListener("storage", onStorage);
    window.addEventListener(CHANGE_EVENT, refresh);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener(CHANGE_EVENT, refresh);
    };
  }, [refresh]);

  const update = useCallback((next: InboxMessage[]) => {
    writeInbox(next);
    setMessages(next);
  }, []);

  const setRead = useCallback(
    (id: string, read: boolean) =>
      update(readInbox().map((item) => (item.id === id ? { ...item, read } : item))),
    [update],
  );

  const remove = useCallback(
    (id: string) => update(readInbox().filter((item) => item.id !== id)),
    [update],
  );

  const clearAll = useCallback(() => update([]), [update]);

  return {
    messages,
    ready,
    unread: messages.filter((item) => !item.read).length,
    setRead,
    remove,
    clearAll,
  };
}

/** Pre-filled reply, since the studio cannot send mail itself. */
export function replyHref(message: InboxMessage) {
  const subject =
    message.kind === "rfq"
      ? `Re: RFQ — ${message.subject}`
      : `Re: Your inquiry — ${message.subject}`;
  const quoted = message.fields
    .filter((field) => field.value)
    .map((field) => `${field.label}: ${field.value}`)
    .join("\n");
  const body = `Dear ${message.name || "buyer"},\n\nThank you for your inquiry.\n\n---\n${quoted}\n`;
  return `mailto:${encodeURIComponent(message.email)}?subject=${encodeURIComponent(
    subject,
  )}&body=${encodeURIComponent(body)}`;
}

export function formatReceived(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "Unknown date";
  return date.toLocaleString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
