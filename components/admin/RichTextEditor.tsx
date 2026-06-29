"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import { useEffect } from "react";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading2,
  Link as LinkIcon,
  Unlink,
  Undo2,
  Redo2,
} from "lucide-react";

/**
 * Themed rich-text editor (Tiptap). Emits HTML via onChange. The output HTML
 * is what gets injected into the branded email shell on send.
 */
export function RichTextEditor({
  value,
  onChange,
  placeholder = "Write your message…",
  onInsertReady,
}: {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  /** Receives an `insertHtml(html)` fn so the parent can inject content. */
  onInsertReady?: (insertHtml: (html: string) => void) => void;
}) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [2] } }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { rel: "noopener noreferrer" },
      }),
    ],
    content: value,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "prose-email min-h-[12rem] max-h-[24rem] overflow-y-auto px-4 py-3 focus:outline-none",
      },
    },
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  // Sync external resets (e.g. after send clears the field).
  useEffect(() => {
    if (editor && value === "" && editor.getHTML() !== "<p></p>") {
      editor.commands.clearContent();
    }
  }, [value, editor]);

  // Expose an insert helper to the parent (used to drop in a scheduling block).
  useEffect(() => {
    if (!editor || !onInsertReady) return;
    onInsertReady((html: string) => {
      editor.chain().focus().insertContent(html).run();
    });
  }, [editor, onInsertReady]);

  if (!editor) {
    return (
      <div className="min-h-[14rem] border border-outline-variant bg-surface-container-lowest" />
    );
  }

  function setLink() {
    const prev = editor!.getAttributes("link").href as string | undefined;
    const url = window.prompt("Link URL", prev ?? "https://");
    if (url === null) return;
    if (url === "") {
      editor!.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor!.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }

  const btn = (active: boolean) =>
    `flex h-8 w-8 items-center justify-center transition-colors ${
      active
        ? "bg-primary/15 text-primary"
        : "text-on-surface-variant hover:text-on-surface"
    }`;

  return (
    <div className="border border-outline-variant bg-surface-container-lowest focus-within:border-primary">
      <div className="flex flex-wrap items-center gap-1 border-b border-outline-variant px-2 py-1.5">
        <button
          type="button"
          aria-label="Bold"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={btn(editor.isActive("bold"))}
        >
          <Bold className="h-4 w-4" />
        </button>
        <button
          type="button"
          aria-label="Italic"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={btn(editor.isActive("italic"))}
        >
          <Italic className="h-4 w-4" />
        </button>
        <button
          type="button"
          aria-label="Heading"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={btn(editor.isActive("heading", { level: 2 }))}
        >
          <Heading2 className="h-4 w-4" />
        </button>
        <span className="mx-1 h-5 w-px bg-outline-variant" />
        <button
          type="button"
          aria-label="Bullet list"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={btn(editor.isActive("bulletList"))}
        >
          <List className="h-4 w-4" />
        </button>
        <button
          type="button"
          aria-label="Numbered list"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={btn(editor.isActive("orderedList"))}
        >
          <ListOrdered className="h-4 w-4" />
        </button>
        <button
          type="button"
          aria-label="Link"
          onClick={setLink}
          className={btn(editor.isActive("link"))}
        >
          <LinkIcon className="h-4 w-4" />
        </button>
        <button
          type="button"
          aria-label="Remove link"
          title="Remove link"
          disabled={!editor.isActive("link")}
          onClick={() =>
            editor.chain().focus().extendMarkRange("link").unsetLink().run()
          }
          className={`${btn(false)} disabled:opacity-30`}
        >
          <Unlink className="h-4 w-4" />
        </button>
        <span className="mx-1 h-5 w-px bg-outline-variant" />
        <button
          type="button"
          aria-label="Undo"
          onClick={() => editor.chain().focus().undo().run()}
          className={btn(false)}
        >
          <Undo2 className="h-4 w-4" />
        </button>
        <button
          type="button"
          aria-label="Redo"
          onClick={() => editor.chain().focus().redo().run()}
          className={btn(false)}
        >
          <Redo2 className="h-4 w-4" />
        </button>
      </div>
      <EditorContent editor={editor} data-placeholder={placeholder} />
    </div>
  );
}
