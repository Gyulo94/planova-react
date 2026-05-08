import { useCallback, useEffect, useRef, useState } from "react";
import { useEditor, Extension } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { Table } from "@tiptap/extension-table/table";
import { TableRow } from "@tiptap/extension-table/row";
import { TableCell } from "@tiptap/extension-table/cell";
import { TableHeader } from "@tiptap/extension-table/header";
import { Markdown } from "tiptap-markdown";
import TextAlign from "@tiptap/extension-text-align";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { all, createLowlight } from "lowlight";
import Image from "@tiptap/extension-image";
import { DOMParser as PMDOMParser } from "@tiptap/pm/model";
import { toast } from "sonner";
import { imageUpload } from "@/features/image/api";

const TableMarkdownShortcut = Extension.create({
  name: "tableMarkdownShortcut",
  addKeyboardShortcuts() {
    return {
      Enter: () => {
        const { state, view, storage } = this.editor;
        const { $from } = state.selection;

        if ($from.parent.type.name !== "paragraph") return false;
        if ($from.parentOffset !== $from.parent.content.size) return false;

        const sepText = $from.parent.textContent.trim();
        if (!/^\|(\s*:?-+:?\s*\|)+$/.test(sepText)) return false;

        const currentParaStart = $from.before($from.depth);
        if (currentParaStart <= 0) return false;

        const $prevPos = state.doc.resolve(currentParaStart - 1);
        const prevNode = $prevPos.parent;
        if (prevNode.type.name !== "paragraph") return false;

        const headerText = prevNode.textContent.trim();
        if (!/^\|([^|\n]+\|)+$/.test(headerText)) return false;

        const headerCols = headerText
          .split("|")
          .slice(1, -1)
          .map((s) => s.trim());
        const sepCols = sepText
          .split("|")
          .filter((s) => /^:?-+:?$/.test(s.trim()));
        if (headerCols.length === 0 || headerCols.length !== sepCols.length)
          return false;

        const cols = headerCols.length;
        const emptyRow = "| " + Array(cols).fill("   ").join(" | ") + " |";
        const fullTable = `${headerText}\n${sepText}\n${emptyRow}`;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const parsedHTML = (storage as any).markdown.parser.parse(fullTable);
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = parsedHTML;
        const slice = PMDOMParser.fromSchema(state.schema).parse(tempDiv);

        const prevParaStart = $prevPos.before($prevPos.depth);
        const deleteFrom = prevParaStart;
        const deleteTo = $from.after($from.depth);

        const { tr } = state;
        tr.delete(deleteFrom, deleteTo);
        tr.insert(deleteFrom, slice.content);
        view.dispatch(tr);
        return true;
      },
    };
  },
});

const lowlight = createLowlight(all);

interface UseDescriptionEditorOptions {
  initialContent?: string;
  placeholder?: string;
  editable?: boolean;
  onSave: (description: string, tempImageUrls: string[]) => Promise<void>;
  onSaveStatusChange?: (status: "idle" | "saving" | "saved") => void;
}

export function useMdEditor({
  initialContent = "",
  placeholder = "내용을 입력하세요...",
  editable = true,
  onSave,
  onSaveStatusChange,
}: UseDescriptionEditorOptions) {
  const tempImageUrlsRef = useRef<string[]>([]);
  const dragDepthRef = useRef(0);
  const onSaveRef = useRef(onSave);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">(
    "idle",
  );
  const [isDragActive, setIsDragActive] = useState(false);

  const hasImageFiles = useCallback((event: DragEvent): boolean => {
    const types = event.dataTransfer?.types;
    if (!types) return false;
    return Array.from(types).includes("Files");
  }, []);

  const updateSaveStatus = useCallback(
    (status: "idle" | "saving" | "saved") => {
      setSaveStatus(status);
      onSaveStatusChange?.(status);
    },
    [onSaveStatusChange],
  );

  const uploadImageFile = useCallback(
    async (file: File): Promise<string | null> => {
      try {
        const formData = new FormData();
        formData.append("files", file);
        const urls = await imageUpload(formData);
        if (urls?.[0]) {
          tempImageUrlsRef.current = [...tempImageUrlsRef.current, urls[0]];
          return urls[0];
        }
        return null;
      } catch {
        toast.error("이미지 업로드에 실패했습니다.");
        return null;
      }
    },
    [],
  );

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ codeBlock: false }),
      CodeBlockLowlight.configure({ lowlight }),
      Table.configure({ resizable: true, renderWrapper: true }),
      TableMarkdownShortcut,
      TableRow,
      TableCell,
      TableHeader,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Image.configure({ inline: false, allowBase64: false }),
      Markdown.configure({
        html: true,
        transformPastedText: true,
        transformCopiedText: true,
      }),
      Placeholder.configure({ placeholder }),
    ],
    editable,
    content: initialContent,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm dark:prose-invert max-w-none focus:outline-none min-h-[120px] text-foreground/90 leading-7",
      },
      handleDOMEvents: {
        dragenter: (_view, event) => {
          if (!editable || !hasImageFiles(event)) return false;
          dragDepthRef.current += 1;
          setIsDragActive(true);
          return false;
        },
        dragleave: (_view, event) => {
          if (!editable || !hasImageFiles(event)) return false;
          dragDepthRef.current = Math.max(0, dragDepthRef.current - 1);
          if (dragDepthRef.current === 0) setIsDragActive(false);
          return false;
        },
        dragover: (_view, event) => {
          if (!editable || !hasImageFiles(event)) return false;
          event.preventDefault();
          setIsDragActive(true);
          return false;
        },
        drop: () => {
          dragDepthRef.current = 0;
          setIsDragActive(false);
          return false;
        },
      },
      handleDrop: (view, event) => {
        dragDepthRef.current = 0;
        setIsDragActive(false);
        if (!editable) return false;
        const files = Array.from(event.dataTransfer?.files ?? []).filter((f) =>
          f.type.startsWith("image/"),
        );
        if (!files.length) return false;
        event.preventDefault();
        files.forEach(async (file) => {
          const url = await uploadImageFile(file);
          if (url)
            view.dispatch(
              view.state.tr.replaceSelectionWith(
                view.state.schema.nodes.image.create({ src: url }),
              ),
            );
        });
        return true;
      },
      handlePaste: (_view, event) => {
        if (!editable) return false;
        const files = Array.from(event.clipboardData?.files ?? []).filter((f) =>
          f.type.startsWith("image/"),
        );
        if (!files.length) return false;
        event.preventDefault();
        files.forEach(async (file) => {
          const url = await uploadImageFile(file);
          if (url) editor?.chain().focus().setImage({ src: url }).run();
        });
        return true;
      },
    },
  });

  useEffect(() => {
    onSaveRef.current = onSave;
  }, [onSave]);

  useEffect(() => {
    if (!editor) return;

    const handleUpdate = () => {
      if (!editable) return;
      updateSaveStatus("saving");
      if (debounceRef.current) clearTimeout(debounceRef.current);

      debounceRef.current = setTimeout(async () => {
        try {
          await onSaveRef.current(editor.getHTML(), tempImageUrlsRef.current);
          tempImageUrlsRef.current = [];
          updateSaveStatus("saved");
        } catch {
          toast.error("자동 저장에 실패했습니다.");
          updateSaveStatus("idle");
        }
      }, 1500);
    };

    editor.on("update", handleUpdate);
    return () => {
      editor.off("update", handleUpdate);
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [editor, updateSaveStatus, editable]);

  return { editor, saveStatus, isDragActive };
}
