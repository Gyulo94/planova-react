interface PropertyRowProps {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}

export default function PropertyRow({
  icon,
  label,
  children,
}: PropertyRowProps) {
  return (
    <div className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-muted/40 transition-colors group cursor-default">
      <div className="flex items-center gap-2 w-36 flex-shrink-0 text-muted-foreground">
        {icon}
        <span className="text-sm">{label}</span>
      </div>
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}
