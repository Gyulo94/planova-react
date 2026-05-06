// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function GanttBarLabel(props: any) {
  const x = Number(props.x ?? 0);
  const y = Number(props.y ?? 0);
  const height = Number(props.height ?? 0);
  const width = Number(props.width ?? 0);
  const value = props.value != null ? String(props.value) : "";

  if (!value || width < 30) return null;

  const cx = x + 12;
  const cy = y + height / 2;
  const maxChars = Math.floor((width - 24) / 7.5);
  const label =
    value.length > maxChars ? value.slice(0, maxChars - 1) + "…" : value;

  return (
    <g style={{ pointerEvents: "none", userSelect: "none" }}>
      <text
        x={cx}
        y={cy}
        fill="rgba(0,0,0,0.6)"
        fontSize={12.5}
        fontWeight={600}
        dominantBaseline="middle"
        stroke="rgba(0,0,0,0.7)"
        strokeWidth={3.5}
        strokeLinejoin="round"
        paintOrder="stroke"
      >
        {label}
      </text>
      <text
        x={cx}
        y={cy}
        fill="#ffffff"
        fontSize={12.5}
        fontWeight={600}
        dominantBaseline="middle"
      >
        {label}
      </text>
    </g>
  );
}
