import { useEffect, useMemo, useState } from "react";

import type {
  SideNavChatItem,
  SideNavWorkflowItem,
} from "@/components/common/CommandCenterSideNav";

/* ── Seeded mock data ─────────────────────────────────────────────
 *
 * The static rows shown in the side-nav variant of the corp-sec command
 * center. These represent in-flight agentic work and recent governance
 * Q&A threads — kept in one module so every page that hosts the side nav
 * (command center, new chat, workflow history, etc.) reads the same list.
 */

export const SEED_WORKFLOWS: SideNavWorkflowItem[] = [
  {
    id: "wf-priya-nair",
    title: "Replace director David Chen at Pacific Polymer Logistics",
    status: "Filing Form 45 with ACRA",
    tone: "info",
    href: "/corpsec/appointment/conversation",
  },
  {
    id: "wf-pacific-disclosures",
    title: "Pacific Polymer Logistics — refresh director disclosures",
    status: "Awaiting permission to update Entities DB",
    tone: "warning",
    emphasizeStatus: true,
  },
  {
    id: "wf-entity-sync",
    title: "Entity records sync — Pacific Polymer Logistics UEN 201812345K",
    status: "Reconciling Workday → Entities",
    tone: "info",
  },
];

export const SEED_CHATS: SideNavChatItem[] = [
  { id: "c1", title: "Replace a director in Singapore — what do I need before ACRA?" },
  { id: "c2", title: "Board resolution vs written resolution — when can we use each?" },
  { id: "c3", title: "How do I evidence consent to act and keep an audit trail?" },
  { id: "c4", title: "NRIC / ID collection for directors — what's acceptable under our policy?" },
  { id: "c5", title: "Who must approve this appointment on our side vs the board?" },
  { id: "c6", title: "ACRA Form 45 timing — what's the 14-day rule in practice?" },
  { id: "c7", title: "Entity management: updating registers after a director change" },
  { id: "c8", title: "Board portal: when to publish materials vs circulate by email" },
  { id: "c9", title: "Conflict of interest declaration for a new NED — template checklist" },
  { id: "c10", title: "Diligent vs manual process — what should stay human-in-the-loop?" },
];

/* ── Persisted "new chat" store ───────────────────────────────────
 *
 * When the user clicks the `+ chat` affordance in the side nav we record a
 * fresh entry and prepend it to the chats list. The store is a tiny
 * localStorage-backed pub/sub so every mounted side nav stays in sync
 * across route transitions.
 */

export interface PersistedChat {
  id: string;
  title: string;
  createdAt: string;
}

const STORAGE_KEY = "corpsec.chats.v1";

function readPersisted(): PersistedChat[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as PersistedChat[]) : [];
  } catch {
    return [];
  }
}

function writePersisted(items: PersistedChat[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    /* localStorage may be disabled — ignore. */
  }
}

const subscribers = new Set<() => void>();
function notify() {
  subscribers.forEach((fn) => fn());
}

/**
 * Append a new chat to the top of the persisted list. Returns the created
 * record so callers can navigate to its URL immediately.
 */
export function addNewChat(title?: string): PersistedChat {
  const now = new Date();
  const record: PersistedChat = {
    id: `chat-${now.getTime()}`,
    title:
      title ??
      `New chat — ${now.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      })}`,
    createdAt: now.toISOString(),
  };
  const next = [record, ...readPersisted()];
  writePersisted(next);
  notify();
  return record;
}

/**
 * Read+subscribe hook for the corp-sec chats list. Returns the merged list
 * (newest first) of user-added chats followed by the seeded governance Q&A
 * threads, plus a setter that creates a new chat record.
 */
export function useCorpsecChats(): {
  /** User-added chats only (most recent first). */
  newChats: PersistedChat[];
  /** Side-nav-shaped list: persisted chats first, then seeded chats. */
  sideNavChats: SideNavChatItem[];
  /** Same merged list — useful when callers don't care about the source split. */
  allChats: SideNavChatItem[];
  addChat: (title?: string) => PersistedChat;
} {
  const [persisted, setPersisted] = useState<PersistedChat[]>(readPersisted);

  useEffect(() => {
    const fn = () => setPersisted(readPersisted());
    subscribers.add(fn);
    return () => {
      subscribers.delete(fn);
    };
  }, []);

  const sideNavChats = useMemo<SideNavChatItem[]>(
    () => [
      ...persisted.map((c) => ({
        id: c.id,
        title: c.title,
        href: `/corpsec/chats/${c.id}`,
      })),
      ...SEED_CHATS,
    ],
    [persisted],
  );

  return {
    newChats: persisted,
    sideNavChats,
    allChats: sideNavChats,
    addChat: addNewChat,
  };
}
