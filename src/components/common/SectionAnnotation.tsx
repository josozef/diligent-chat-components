import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { KeyboardEvent, MouseEvent } from "react";
import { Box, Button, IconButton, Stack, TextField, Tooltip } from "@mui/material";

import { atlasSemanticColor, atlasSemanticRadius } from "../../tokens/atlasLight";
import { EditOutlinedIcon } from "../../icons";
import TradAtlasText from "./TradAtlasText";
import { SF } from "../../tokens/tradAtlasSemanticTypography";

/** localStorage key namespace. Versioned so future schema changes can migrate cleanly. */
const STORAGE_PREFIX = "atlas-ai.system-page.annotation.v1.";

function storageKey(sectionId: string): string {
  return `${STORAGE_PREFIX}${sectionId}`;
}

function readAnnotation(sectionId: string): string {
  if (typeof window === "undefined") return "";
  try {
    return window.localStorage.getItem(storageKey(sectionId)) ?? "";
  } catch {
    return "";
  }
}

function writeAnnotation(sectionId: string, value: string): void {
  if (typeof window === "undefined") return;
  try {
    const key = storageKey(sectionId);
    if (value.trim().length === 0) window.localStorage.removeItem(key);
    else window.localStorage.setItem(key, value);
  } catch {
    // quota / private mode — silently ignore; annotation simply won't persist.
  }
}

export interface SectionAnnotationProps {
  /** Stable id for the section (used as the localStorage key suffix). */
  sectionId: string;
  /** Human-readable name of the section; used in aria-labels. */
  sectionLabel: string;
  /** Placeholder prompt shown in the edit field when there's no saved content. */
  placeholder?: string;
}

/**
 * Per-section free-text annotation.
 *
 * Three UI states:
 *   - **empty**   — a subtle "Add annotation" affordance with pencil icon.
 *   - **reading** — saved content rendered as read-only prose, with a hover
 *                   edit icon; double-clicking the body also enters edit mode.
 *   - **editing** — multiline `TextField` plus Save / Cancel (Cmd/Ctrl+Enter
 *                   saves, Esc cancels).
 *
 * Persists per-section to `localStorage`. No backend wiring.
 */
export default function SectionAnnotation({
  sectionId,
  sectionLabel,
  placeholder = "Add notes, decisions, or open questions for this component…",
}: SectionAnnotationProps) {
  const [saved, setSaved] = useState<string>(() => readAnnotation(sectionId));
  const [editing, setEditing] = useState<boolean>(false);
  const [draft, setDraft] = useState<string>("");
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  // Re-read if the sectionId ever changes (defensive — shouldn't normally happen).
  useEffect(() => {
    setSaved(readAnnotation(sectionId));
    setEditing(false);
  }, [sectionId]);

  // Autofocus the textarea when entering edit mode.
  useEffect(() => {
    if (!editing) return;
    const id = window.setTimeout(() => {
      const el = inputRef.current;
      if (!el) return;
      el.focus();
      const len = el.value.length;
      el.setSelectionRange(len, len);
    }, 0);
    return () => window.clearTimeout(id);
  }, [editing]);

  const startEditing = useCallback(() => {
    setDraft(saved);
    setEditing(true);
  }, [saved]);

  const cancel = useCallback(() => {
    setEditing(false);
    setDraft("");
  }, []);

  const save = useCallback(() => {
    const next = draft.trim();
    writeAnnotation(sectionId, next);
    setSaved(next);
    setEditing(false);
    setDraft("");
  }, [draft, sectionId]);

  const clear = useCallback(() => {
    writeAnnotation(sectionId, "");
    setSaved("");
    setEditing(false);
    setDraft("");
  }, [sectionId]);

  const onKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "Escape") {
        event.preventDefault();
        cancel();
        return;
      }
      if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        save();
      }
    },
    [cancel, save],
  );

  // Avoid promoting to edit mode when the user is selecting text inside the
  // read-only panel. Only a true double-click with no text selection counts.
  const onReadingDoubleClick = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      if (event.defaultPrevented) return;
      const selection = window.getSelection();
      if (selection && selection.toString().length > 0) return;
      startEditing();
    },
    [startEditing],
  );

  /** Light blue panel so annotations read as “notes” vs. neutral doc callouts. */
  const panelSx = useMemo(
    () => ({
      position: "relative" as const,
      borderRadius: atlasSemanticRadius.md,
      border: `1px solid #c5d8f0`,
      borderLeft: `3px solid ${atlasSemanticColor.status.notification.default}`,
      background: atlasSemanticColor.status.notification.background,
      px: "18px",
      py: "14px",
    }),
    [],
  );

  /* ── editing ── */
  if (editing) {
    return (
      <Box
        component="section"
        aria-label={`${sectionLabel} annotation editor`}
        sx={panelSx}
        onKeyDown={onKeyDown}
      >
        <TradAtlasText
          semanticFont={SF.textMicroEmphasis}
          sx={{ color: atlasSemanticColor.type.muted, mb: "8px", letterSpacing: "0.04em", textTransform: "uppercase" }}
        >
          Annotation · {sectionLabel}
        </TradAtlasText>
        <TextField
          inputRef={inputRef}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={placeholder}
          multiline
          fullWidth
          minRows={3}
          variant="outlined"
          size="small"
          aria-label={`${sectionLabel} annotation text`}
          sx={{
            "& .MuiOutlinedInput-root": {
              background: atlasSemanticColor.surface.default,
              fontSize: "14px",
              lineHeight: 1.5,
            },
          }}
        />
        <Stack direction="row" spacing={1} sx={{ mt: "8px", alignItems: "center", justifyContent: "space-between" }}>
          <TradAtlasText semanticFont={SF.textXs} sx={{ color: atlasSemanticColor.type.muted }}>
            ⌘/Ctrl + Enter to save · Esc to cancel
          </TradAtlasText>
          <Stack direction="row" spacing={1}>
            {saved && (
              <Button size="small" color="inherit" onClick={clear} sx={{ textTransform: "none" }}>
                Delete
              </Button>
            )}
            <Button size="small" color="inherit" onClick={cancel} sx={{ textTransform: "none" }}>
              Cancel
            </Button>
            <Button
              size="small"
              variant="contained"
              color="primary"
              onClick={save}
              disabled={draft.trim() === saved.trim()}
              sx={{ textTransform: "none" }}
            >
              Save
            </Button>
          </Stack>
        </Stack>
      </Box>
    );
  }

  /* ── empty (no saved content) ── */
  if (!saved) {
    return (
      <Box
        component="button"
        type="button"
        onClick={startEditing}
        aria-label={`Add annotation for ${sectionLabel}`}
        sx={{
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          px: "12px",
          py: "8px",
          borderRadius: atlasSemanticRadius.md,
          border: `1px dashed #a8c4eb`,
          background: "transparent",
          color: atlasSemanticColor.type.muted,
          cursor: "pointer",
          font: "inherit",
          transition: "background-color 120ms ease, border-color 120ms ease, color 120ms ease",
          "&:hover": {
            background: atlasSemanticColor.status.notification.background,
            borderColor: atlasSemanticColor.status.notification.default,
            color: atlasSemanticColor.type.default,
          },
          "&:focus-visible": {
            outline: `2px solid ${atlasSemanticColor.outline.active}`,
            outlineOffset: "2px",
          },
        }}
      >
        <EditOutlinedIcon sx={{ fontSize: 16 }} />
        <TradAtlasText semanticFont={SF.textSm} sx={{ color: "inherit" }}>
          Add annotation
        </TradAtlasText>
      </Box>
    );
  }

  /* ── reading ── */
  return (
    <Box
      sx={{
        ...panelSx,
        cursor: "text",
        "&:hover .annotation-edit-btn": { opacity: 1 },
      }}
      onDoubleClick={onReadingDoubleClick}
      role="group"
      aria-label={`${sectionLabel} annotation`}
    >
      <Stack direction="row" spacing={1} sx={{ alignItems: "flex-start", justifyContent: "space-between", mb: "6px" }}>
        <TradAtlasText
          semanticFont={SF.textMicroEmphasis}
          sx={{ color: atlasSemanticColor.type.muted, letterSpacing: "0.04em", textTransform: "uppercase" }}
        >
          Annotation · {sectionLabel}
        </TradAtlasText>
        <Tooltip title="Edit annotation" placement="top" arrow>
          <IconButton
            className="annotation-edit-btn"
            size="small"
            onClick={startEditing}
            aria-label={`Edit annotation for ${sectionLabel}`}
            sx={{
              opacity: 0.5,
              transition: "opacity 120ms ease, background-color 120ms ease",
              ml: "8px",
              mt: "-4px",
              color: atlasSemanticColor.type.muted,
              "&:focus-visible": { opacity: 1 },
            }}
          >
            <EditOutlinedIcon sx={{ fontSize: 16 }} />
          </IconButton>
        </Tooltip>
      </Stack>
      <TradAtlasText
        semanticFont={SF.textSm}
        sx={{
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          color: atlasSemanticColor.type.default,
        }}
      >
        {saved}
      </TradAtlasText>
    </Box>
  );
}
