import { useMemo, useState } from "react";
import { Box } from "@mui/material";
import { Link as RouterLink } from "react-router";

import { ChatBubbleOutlineIcon, ChevronRightIcon } from "@/icons";
import TradAtlasText from "@/components/common/TradAtlasText";
import { SF } from "@/tokens/tradAtlasSemanticTypography";
import { useTokens } from "@/hooks/useTokens";

import CorpSecSideNavLayout from "./CorpSecSideNavLayout";
import { useCorpsecChats } from "./sideNavData";
import SearchField from "./components/SearchField";

/**
 * Past-chats archive. Renders every governance chat — newly-created ones the
 * user kicked off via `+ chat` plus the seeded Q&A threads — in a single
 * scannable list with a sticky search filter on top. Mirrors the
 * "Workflow History" page so the two archives feel like siblings.
 */
export default function AllChatsPage() {
  const { color, weight, radius } = useTokens();
  const { allChats, newChats } = useCorpsecChats();
  const [query, setQuery] = useState("");

  const items = useMemo(() => {
    return allChats.map((c) => {
      const persisted = newChats.find((n) => n.id === c.id);
      return {
        id: c.id,
        title: c.title,
        createdAt: persisted?.createdAt ?? null,
        href: `/corpsec/chats/${c.id}`,
      };
    });
  }, [allChats, newChats]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((c) => c.title.toLowerCase().includes(q));
  }, [items, query]);

  return (
    <CorpSecSideNavLayout>
      <Box sx={{ width: "100%", maxWidth: 960, mx: "auto", display: "flex", flexDirection: "column", gap: "16px" }}>
        <Box>
          <TradAtlasText
            semanticFont={SF.titleH3Emphasis}
            sx={{ fontWeight: weight.semiBold, color: color.type.default }}
          >
            Your chats
          </TradAtlasText>
          <TradAtlasText
            semanticFont={SF.textMd}
            sx={{ color: color.type.muted, mt: "4px" }}
          >
            Every governance Q&amp;A thread you've started — search by topic
            or scroll the most recent first.
          </TradAtlasText>
        </Box>

        <SearchField
          placeholder="Search chats..."
          value={query}
          onChange={setQuery}
        />

        <Box
          sx={{
            background: color.surface.default,
            border: `1px solid ${color.outline.fixed}`,
            borderRadius: radius.lg,
            overflow: "hidden",
          }}
        >
          {filtered.length === 0 ? (
            <Box sx={{ p: "32px", textAlign: "center" }}>
              <TradAtlasText
                semanticFont={SF.textMd}
                sx={{ color: color.type.muted }}
              >
                No chats match "{query}".
              </TradAtlasText>
            </Box>
          ) : (
            filtered.map((c, i) => (
              <Box
                key={c.id}
                component={RouterLink}
                to={c.href}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                  px: "20px",
                  py: "16px",
                  borderBottom:
                    i < filtered.length - 1
                      ? `1px solid ${color.outline.fixed}`
                      : "none",
                  textDecoration: "none",
                  color: "inherit",
                  transition: "background-color 120ms ease",
                  "&:hover": { background: color.surface.subtle },
                }}
              >
                <Box
                  aria-hidden
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: radius.sm,
                    background: color.surface.variant,
                    color: color.type.muted,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <ChatBubbleOutlineIcon sx={{ fontSize: 18 }} />
                </Box>

                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <TradAtlasText
                    semanticFont={SF.textMdEmphasis}
                    sx={{
                      color: color.type.default,
                      fontWeight: weight.semiBold,
                      letterSpacing: "-0.005em",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {c.title}
                  </TradAtlasText>
                </Box>

                <TradAtlasText
                  semanticFont={SF.textSm}
                  sx={{
                    color: color.type.muted,
                    flexShrink: 0,
                    whiteSpace: "nowrap",
                  }}
                >
                  {formatChatTimestamp(c.createdAt)}
                </TradAtlasText>

                <ChevronRightIcon
                  sx={{ fontSize: 18, color: color.type.muted, flexShrink: 0 }}
                />
              </Box>
            ))
          )}
        </Box>
      </Box>
    </CorpSecSideNavLayout>
  );
}

/* ── Helpers ─────────────────────────────────────────────────────── */

/** Locale-aware short timestamp; falls back to "Recent" for seeded data. */
function formatChatTimestamp(iso: string | null): string {
  if (!iso) return "Recent";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "Recent";
  const now = new Date();
  const sameDay =
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate();
  if (sameDay) {
    return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  }
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
