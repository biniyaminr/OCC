import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { hasSupabaseCredentials } from "@/lib/supabase/env";

/**
 * Inquiries submitted through the contact form and the RFQ modal.
 *
 * With Supabase credentials present, this uses the shared `messages` table.
 * Without credentials, it keeps a localStorage fallback so the site still works
 * during unconfigured local development.
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

type MessageRow = {
  id: string;
  kind: "contact" | "rfq";
  created_at: string;
  read: boolean;
  subject: string | null;
  name: string | null;
  email: string | null;
  company: string | null;
  country: string | null;
  fields: InboxField[] | null;
};

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
export async function addMessage(message: NewMessage): Promise<boolean> {
  if (hasSupabaseCredentials()) {
    try {
      const { error } = await createClient()
        .from("messages")
        .insert({
          kind: message.kind,
          subject: message.subject,
          name: message.name,
          email: message.email,
          company: message.company,
          country: message.country,
          fields: message.fields,
        });
      return !error;
    } catch {
      return false;
    }
  }

  const entry: InboxMessage = {
    ...message,
    id: globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    createdAt: new Date().toISOString(),
    read: false,
  };
  return writeInbox([entry, ...readInbox()]);
}

function rowToMessage(row: MessageRow): InboxMessage {
  return {
    id: row.id,
    kind: row.kind,
    createdAt: row.created_at,
    read: row.read,
    subject: row.subject ?? "",
    name: row.name ?? "",
    email: row.email ?? "",
    company: row.company ?? "",
    country: row.country ?? "",
    fields: Array.isArray(row.fields) ? row.fields : [],
  };
}

async function readSupabaseInbox(): Promise<InboxMessage[]> {
  const { data, error } = await createClient()
    .from("messages")
    .select("id, kind, created_at, read, subject, name, email, company, country, fields")
    .order("created_at", { ascending: false })
    .limit(MAX_MESSAGES);
  if (error) throw error;
  return ((data ?? []) as MessageRow[]).map(rowToMessage);
}

export function useInbox() {
  const [messages, setMessages] = useState<InboxMessage[]>([]);
  const [ready, setReady] = useState(false);
  const useSupabase = hasSupabaseCredentials();

  const refresh = useCallback(async () => {
    if (useSupabase) {
      try {
        setMessages(await readSupabaseInbox());
      } catch {
        setMessages([]);
      }
      return;
    }
    setMessages(readInbox());
  }, [useSupabase]);

  useEffect(() => {
    let active = true;
    void refresh().finally(() => {
      if (active) setReady(true);
    });
    const onStorage = (event: StorageEvent) => {
      if (event.key === INBOX_KEY) void refresh();
    };
    window.addEventListener("storage", onStorage);
    window.addEventListener(CHANGE_EVENT, refresh);
    return () => {
      active = false;
      window.removeEventListener("storage", onStorage);
      window.removeEventListener(CHANGE_EVENT, refresh);
    };
  }, [refresh]);

  const update = useCallback((next: InboxMessage[]) => {
    writeInbox(next);
    setMessages(next);
  }, []);

  const setRead = useCallback(
    (id: string, read: boolean) => {
      if (useSupabase) {
        void createClient()
          .from("messages")
          .update({ read })
          .eq("id", id)
          .then(() => refresh());
        return;
      }
      update(readInbox().map((item) => (item.id === id ? { ...item, read } : item)));
    },
    [refresh, update, useSupabase],
  );

  const remove = useCallback(
    (id: string) => {
      if (useSupabase) {
        void createClient()
          .from("messages")
          .delete()
          .eq("id", id)
          .then(() => refresh());
        return;
      }
      update(readInbox().filter((item) => item.id !== id));
    },
    [refresh, update, useSupabase],
  );

  const clearAll = useCallback(() => {
    if (useSupabase) {
      const ids = messages.map((item) => item.id);
      if (ids.length === 0) return;
      void createClient()
        .from("messages")
        .delete()
        .in("id", ids)
        .then(() => refresh());
      return;
    }
    update([]);
  }, [messages, refresh, update, useSupabase]);

  return {
    messages,
    ready,
    unread: messages.filter((item) => !item.read).length,
    databaseBacked: useSupabase,
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
