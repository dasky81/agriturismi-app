"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import {
  Bold,
  Italic,
  Strikethrough,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Minus,
  Undo,
  Redo,
} from "lucide-react";

interface Props {
  contenuto: string;
  onChange: (html: string) => void;
}

interface ToolbarButtonProps {
  onClick: () => void;
  attivo?: boolean;
  titolo: string;
  children: React.ReactNode;
}

function ToolbarButton({ onClick, attivo, titolo, children }: ToolbarButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={titolo}
      className={`p-1.5 rounded text-sm transition-colors ${
        attivo
          ? "bg-[#2D6A4F] text-white"
          : "text-gray-600 hover:bg-gray-100"
      }`}
    >
      {children}
    </button>
  );
}

export default function EditorPost({ contenuto, onChange }: Props) {
  const editor = useEditor(
    {
      extensions: [
        StarterKit,
        Link.configure({ openOnClick: false }),
        Image,
      ],
      content: contenuto,
      immediatelyRender: false,
      onUpdate({ editor: e }) {
        onChange(e.getHTML());
      },
    },
    [contenuto]
  );

  if (!editor) return null;

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      {/* Toolbar */}
      <div className="tiptap-toolbar flex flex-wrap items-center gap-0.5 px-3 py-2 border-b border-gray-200 bg-gray-50">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          attivo={editor.isActive("bold")}
          titolo="Grassetto"
        >
          <Bold size={15} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          attivo={editor.isActive("italic")}
          titolo="Corsivo"
        >
          <Italic size={15} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          attivo={editor.isActive("strike")}
          titolo="Barrato"
        >
          <Strikethrough size={15} />
        </ToolbarButton>

        <div className="w-px h-5 bg-gray-200 mx-1" />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          attivo={editor.isActive("heading", { level: 2 })}
          titolo="Titolo H2"
        >
          <Heading2 size={15} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          attivo={editor.isActive("heading", { level: 3 })}
          titolo="Titolo H3"
        >
          <Heading3 size={15} />
        </ToolbarButton>

        <div className="w-px h-5 bg-gray-200 mx-1" />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          attivo={editor.isActive("bulletList")}
          titolo="Elenco puntato"
        >
          <List size={15} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          attivo={editor.isActive("orderedList")}
          titolo="Elenco numerato"
        >
          <ListOrdered size={15} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          attivo={editor.isActive("blockquote")}
          titolo="Citazione"
        >
          <Quote size={15} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          titolo="Riga orizzontale"
        >
          <Minus size={15} />
        </ToolbarButton>

        <div className="w-px h-5 bg-gray-200 mx-1" />

        <ToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
          titolo="Annulla"
        >
          <Undo size={15} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().redo().run()}
          titolo="Ripristina"
        >
          <Redo size={15} />
        </ToolbarButton>
      </div>

      {/* Area di testo */}
      <EditorContent
        editor={editor}
        className="blog-content min-h-[320px] px-5 py-4 focus-within:outline-none text-sm"
      />
    </div>
  );
}
