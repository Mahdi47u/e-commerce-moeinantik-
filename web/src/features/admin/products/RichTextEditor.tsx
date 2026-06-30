"use client";

import { useEffect, useState } from "react";
import { TextArea } from "@/components/ui/field";

export function RichTextEditor({
  id,
  value,
  onChange,
  minHeight = 220,
  "aria-describedby": ariaDescribedBy,
  "aria-invalid": ariaInvalid,
}: {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  minHeight?: number;
  "aria-describedby"?: string;
  "aria-invalid"?: boolean;
}) {
  const [editorModules, setEditorModules] = useState<{ CKEditor: any; ClassicEditor: any } | null>(null);

  useEffect(() => {
    let active = true;

    Promise.all([import("@ckeditor/ckeditor5-react"), import("@ckeditor/ckeditor5-build-classic")])
      .then(([reactModule, classicModule]) => {
        if (active) {
          setEditorModules({
            CKEditor: reactModule.CKEditor,
            ClassicEditor: classicModule.default,
          });
        }
      })
      .catch(() => {
        if (active) {
          setEditorModules(null);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  if (!editorModules) {
    return (
      <TextArea
        id={id}
        value={value}
        aria-describedby={ariaDescribedBy}
        aria-invalid={ariaInvalid}
        className="min-h-52"
        style={{ minHeight }}
        onChange={(event) => onChange(event.target.value)}
      />
    );
  }

  const { CKEditor, ClassicEditor } = editorModules;

  return (
    <div
      id={id}
      aria-describedby={ariaDescribedBy}
      aria-invalid={ariaInvalid}
      className="overflow-hidden rounded-md border border-input bg-background text-foreground focus-within:border-primary focus-within:ring-2 focus-within:ring-ring"
      style={{ ["--ck-border-radius" as string]: "0", ["--ck-color-base-border" as string]: "transparent", ["--ck-color-base-background" as string]: "hsl(var(--background))", ["--ck-color-text" as string]: "hsl(var(--foreground))" }}
    >
      <CKEditor
        editor={ClassicEditor}
        data={value}
        config={{
          toolbar: ["heading", "|", "bold", "italic", "link", "bulletedList", "numberedList", "blockQuote", "insertTable", "undo", "redo"],
          language: "fa",
        }}
        onChange={(_: unknown, editor: { getData: () => string }) => onChange(editor.getData())}
      />
      <style jsx global>{`
        .ck-editor__editable_inline {
          min-height: ${minHeight}px;
          padding: 0.75rem 1rem !important;
          line-height: 1.8;
        }
        .ck.ck-toolbar {
          border-bottom: 1px solid hsl(var(--border)) !important;
          background: hsl(var(--card)) !important;
        }
      `}</style>
    </div>
  );
}

