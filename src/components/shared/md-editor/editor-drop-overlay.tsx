interface EditorDropOverlayProps {
  visible: boolean;
}

export default function EditorDropOverlay({ visible }: EditorDropOverlayProps) {
  if (!visible) return null;

  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-md border-2 border-dashed border-primary/70 bg-primary/5">
      <span className="text-sm font-medium text-primary">
        이미지를 놓으면 업로드됩니다
      </span>
    </div>
  );
}
