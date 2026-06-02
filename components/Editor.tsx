"use client";

import { Markdown } from "tiptap-markdown";
import { useEditor, EditorContent, useEditorState } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import { useCallback } from "react";
import { FaLink, FaListUl, FaListOl, FaCode } from "react-icons/fa";
import { BulletList, ListItem, OrderedList } from "@tiptap/extension-list";
import Heading from "@tiptap/extension-heading";
import { all, createLowlight } from "lowlight";
import css from "highlight.js/lib/languages/css";
import js from "highlight.js/lib/languages/javascript";
import ts from "highlight.js/lib/languages/typescript";
import html from "highlight.js/lib/languages/xml";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import "highlight.js/styles/github-dark.css";

const lowlight = createLowlight(all);
lowlight.register("html", html);
lowlight.register("css", css);
lowlight.register("js", js);
lowlight.register("ts", ts);

const Editor = ({
  value,
  onChange,
  label,
}: {
  value: string;
  onChange: (value: string) => void;
  label?: string;
}) => {
  const editor = useEditor({
    editorProps: {
      attributes: {
        class: "prose prose-invert max-w-none focus:outline-none min-h-[150px]",
      },
    },
    extensions: [
      StarterKit.configure({
        heading: false,
        bulletList: false,
        orderedList: false,
        listItem: false,
        codeBlock: false,
        bold: {},
        italic: {},
      }),
      Markdown,
      Heading.configure({
        levels: [1, 2, 3],
      }).extend({
        renderHTML({ node, HTMLAttributes }) {
          const classes: Record<number, string> = {
            1: "text-4xl font-extrabold mt-8 mb-4",
            2: "text-3xl font-bold mt-6 mb-3",
            3: "text-2xl font-semibold mt-4 mb-2",
          };
          return [
            `h${node.attrs.level}`,
            {
              ...HTMLAttributes,
              class: classes[node.attrs.level as number] || "",
            },
            0,
          ];
        },
      }),
      BulletList.configure({
        HTMLAttributes: {
          class: "list-disc ml-6 mb-4 space-y-2",
        },
      }),
      OrderedList.configure({
        HTMLAttributes: {
          class: "list-decimal ml-6 mb-4 space-y-2",
        },
      }),
      ListItem.configure({
        HTMLAttributes: {
          class: "pl-1",
        },
      }),
      CodeBlockLowlight.configure({
        lowlight,
        HTMLAttributes: {
          class:
            "rounded-md p-4 font-mono text-sm leading-relaxed my-4 border border-border",
        },
      }),
      Link.configure({
        HTMLAttributes: {
          class: "text-accent underline underline-offset-4 cursor-pointer",
        },
        openOnClick: false,
        autolink: true,
        defaultProtocol: "https",
        protocols: ["http", "https"],
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      const markdown =
        (
          editor.storage as { markdown?: { getMarkdown: () => string } }
        ).markdown?.getMarkdown() || "";

      onChange(markdown);
    },
    // Don't render immediately on the server to avoid SSR issues
    immediatelyRender: false,
  });

  const setLink = useCallback(() => {
    const previousUrl = editor?.getAttributes("link").href;
    const url = window.prompt("URL", previousUrl);

    // cancelled
    if (url === null) {
      return;
    }

    // empty
    if (url === "") {
      editor?.chain().focus().extendMarkRange("link").unsetLink().run();

      return;
    }

    // update link
    try {
      editor
        ?.chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: url })
        .run();
    } catch (e) {
      if (e instanceof Error) {
        alert(e.message);
      }
    }
  }, [editor]);

  const editorState = useEditorState({
    editor,
    selector: (ctx) => ({
      isLink: ctx.editor?.isActive("link"),
    }),
  });

  if (!editor) {
    return null;
  }

  return (
    <>
      <label className="block text-secondary-text text-sm font-medium mb-3">
        {label}
      </label>
      <div className="border border-border rounded-md overflow-hidden bg-primary">
        <div className="flex items-center gap-2 p-2 border-b border-border bg-input-background">
          {/* Bold */}
          <button
            type="button"
            onClick={() => editor?.chain().focus().toggleBold().run()}
            className={`p-2 rounded hover:bg-hover transition-colors ${
              editor?.isActive("bold")
                ? "bg-accent text-white"
                : "text-secondary-text"
            }`}
            title="Bold"
          >
            <span className="font-bold">B</span>
          </button>

          {/* Italic */}
          <button
            type="button"
            onClick={() => editor?.chain().focus().toggleItalic().run()}
            className={`p-2 rounded hover:bg-hover transition-colors ${
              editor?.isActive("italic")
                ? "bg-accent text-white"
                : "text-secondary-text"
            }`}
            title="Italic"
          >
            <span className="italic">I</span>
          </button>

          <div className="w-px h-6 bg-border mx-1" />

          {/* Heading */}
          <button
            type="button"
            onClick={() =>
              editor?.chain().focus().toggleHeading({ level: 1 }).run()
            }
            className={`p-2 rounded hover:bg-hover transition-colors ${
              editor?.isActive("heading", { level: 1 })
                ? "bg-accent text-white"
                : "text-secondary-text"
            }`}
            title="Heading 1"
          >
            H1
          </button>
          <button
            type="button"
            onClick={() =>
              editor?.chain().focus().toggleHeading({ level: 2 }).run()
            }
            className={`p-2 rounded hover:bg-hover transition-colors ${
              editor?.isActive("heading", { level: 2 })
                ? "bg-accent text-white"
                : "text-secondary-text"
            }`}
            title="Heading 2"
          >
            H2
          </button>
          <button
            type="button"
            onClick={() =>
              editor?.chain().focus().toggleHeading({ level: 3 }).run()
            }
            className={`p-2 rounded hover:bg-hover transition-colors ${
              editor?.isActive("heading", { level: 3 })
                ? "bg-accent text-white"
                : "text-secondary-text"
            }`}
            title="Heading 3"
          >
            H3
          </button>
          {/* Link */}
          <button
            onClick={setLink}
            className={`p-2 rounded hover:bg-hover transition-colors ${
              editorState?.isLink ? "text-accent" : "text-secondary-text"
            }`}
            title="Add Link"
          >
            <FaLink />
          </button>
          {/* List */}
          <button
            type="button"
            onClick={() => editor?.chain().focus().toggleBulletList().run()}
            className={`p-2 rounded hover:bg-hover transition-colors ${
              editor?.isActive("bulletList")
                ? "bg-accent text-white"
                : "text-secondary-text"
            }`}
            title="Bullet List"
          >
            <FaListUl />
          </button>
          <button
            type="button"
            onClick={() => editor?.chain().focus().toggleOrderedList().run()}
            className={`p-2 rounded hover:bg-hover transition-colors ${
              editor?.isActive("orderedList")
                ? "bg-accent text-white"
                : "text-secondary-text"
            }`}
            title="Ordered List"
          >
            <FaListOl />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            className={`p-2 rounded hover:bg-hover transition-colors ${
              editor?.isActive("codeBlock")
                ? "bg-accent text-white"
                : "text-secondary-text"
            }`}
            title="Code Block"
          >
            <FaCode />
          </button>
        </div>
        <div className="p-4 min-h-[150px]">
          <EditorContent editor={editor} />
        </div>
      </div>
    </>
  );
};

export default Editor;
