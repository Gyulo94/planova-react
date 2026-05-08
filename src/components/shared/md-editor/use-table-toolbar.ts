import { useEffect, useRef, useState } from "react";
import { Editor } from "@tiptap/react";

interface TableToolbarPosition {
  top: number;
  left: number;
}

export function useTableToolbar(editor: Editor | null) {
  const [position, setPosition] = useState<TableToolbarPosition | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!editor) return;

    const update = () => {
      if (!editor.isActive("table")) {
        setPosition(null);
        return;
      }

      const { from } = editor.state.selection;
      const domAtPos = editor.view.domAtPos(from);
      let node: Node | null = domAtPos.node;

      // Walk up to find the <table> element
      while (node && (node as Element).tagName !== "TABLE") {
        node = node.parentElement;
      }

      if (!node || !containerRef.current) {
        setPosition(null);
        return;
      }

      const tableEl = node as HTMLElement;
      const containerEl = containerRef.current;
      const tableRect = tableEl.getBoundingClientRect();
      const containerRect = containerEl.getBoundingClientRect();

      setPosition({
        top: tableRect.top - containerRect.top - 36, // 툴바 높이만큼 위
        left: tableRect.left - containerRect.left,
      });
    };

    editor.on("selectionUpdate", update);
    editor.on("transaction", update);

    return () => {
      editor.off("selectionUpdate", update);
      editor.off("transaction", update);
    };
  }, [editor]);

  return { position, containerRef };
}
