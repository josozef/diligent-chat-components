import { Mark, mergeAttributes } from "@tiptap/core";

/** Green insertions — chat-driven additions (track changes). */
export const TrackInsert = Mark.create({
  name: "trackInsert",
  inclusive: false,
  parseHTML() {
    return [{ tag: "ins" }];
  },
  renderHTML({ HTMLAttributes }) {
    return ["ins", mergeAttributes(HTMLAttributes, { class: "track-insert" }), 0];
  },
});

/** Red strikethrough removals — chat-driven deletions (track changes). */
export const TrackDelete = Mark.create({
  name: "trackDelete",
  inclusive: false,
  parseHTML() {
    return [{ tag: "del" }];
  },
  renderHTML({ HTMLAttributes }) {
    return ["del", mergeAttributes(HTMLAttributes, { class: "track-delete" }), 0];
  },
});
