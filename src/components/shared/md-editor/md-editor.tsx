import { EditorContent } from "@tiptap/react";
import {
  EditorDropOverlay,
  TableToolbar,
  useTableToolbar,
  useMdEditor,
} from ".";
interface MdEditorProps {
  initialContent?: string;
  placeholder?: string;
  editable?: boolean;
  onSave: (description: string, tempImageUrls: string[]) => Promise<void>;
  onSaveStatusChange?: (status: "idle" | "saving" | "saved") => void;
}

export default function MdEditor({
  initialContent = "",
  placeholder,
  editable = true,
  onSave,
  onSaveStatusChange,
}: MdEditorProps) {
  const { editor, saveStatus, isDragActive } = useMdEditor({
    initialContent,
    placeholder,
    editable,
    onSave,
    onSaveStatusChange,
  });

  const { position: tableToolbarPos, containerRef } = useTableToolbar(editor);

  return (
    <div>
      <div
        ref={containerRef}
        className={[
          "relative rounded-md border border-transparent px-2 py-1 transition-colors",
          !editable ? "cursor-default" : "",
          isDragActive ? "border-primary/60 bg-primary/5" : "",
        ].join(" ")}
      >
        {editable && editor && tableToolbarPos && (
          <TableToolbar
            editor={editor}
            top={tableToolbarPos.top}
            left={tableToolbarPos.left}
          />
        )}
        <EditorContent editor={editor} />
        <EditorDropOverlay visible={isDragActive} />
      </div>
      <div className="sr-only" aria-live="polite">
        {saveStatus === "saving" && "작성중"}
        {saveStatus === "saved" && "저장됨"}
      </div>
    </div>
  );
}
