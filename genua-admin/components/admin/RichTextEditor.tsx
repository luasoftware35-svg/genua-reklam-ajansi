'use client';

import { useEffect, useState } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';

export function RichTextEditor({ name, defaultValue }: { name: string; defaultValue?: string }) {
  const [html, setHtml] = useState(defaultValue ?? '');
  const editor = useEditor({
    extensions: [StarterKit, Image, Link.configure({ openOnClick: false })],
    content: defaultValue ?? '',
    immediatelyRender: false,
    editorProps: {
      attributes: { class: 'textarea', style: 'min-height: 220px; outline: none;' },
    },
    onUpdate({ editor }) {
      setHtml(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && defaultValue && editor.getHTML() !== defaultValue) editor.commands.setContent(defaultValue);
  }, [editor, defaultValue]);

  return (
    <div>
      <input type="hidden" name={name} value={html} />
      <div className="actions" style={{ marginBottom: 8 }}>
        <button className="btn" type="button" onClick={() => editor?.chain().focus().toggleBold().run()}>Bold</button>
        <button className="btn" type="button" onClick={() => editor?.chain().focus().toggleItalic().run()}>Italic</button>
        <button className="btn" type="button" onClick={() => editor?.chain().focus().toggleBulletList().run()}>Liste</button>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
