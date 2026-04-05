/**
 * Shared chat UI density for surfaces that reuse the same components in different layouts.
 *
 * - **relaxed** — Full-page / general-purpose chat: full `ChatPrompt` toolbar, roomier thread spacing,
 *   neutral “prompt card” bubbles for the main composer flow.
 * - **compact** — Narrow rails (e.g. appointment workspace): minimal `ChatPrompt` (attach + send),
 *   tighter gaps, conversational user/assistant bubbles.
 */
export type ChatPresentationDensity = "compact" | "relaxed";
