import { getStatusSoftColor, getStatusStrongColor, roundedBar } from "../utils";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function ProgressBar(props: any) {
  const { x, y, width, height, fill, remainingDuration } = props;
  if (!width || !height) return null;

  const hasRemaining = (remainingDuration ?? 0) > 0;
  const path = roundedBar(
    x,
    y,
    width,
    height,
    6,
    hasRemaining ? 0 : 6,
    hasRemaining ? 0 : 6,
    6,
  );

  return <path d={path} fill={fill} />;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function RemainingBar(props: any) {
  const { x, y, width, height, fill, progressDuration } = props;
  if (!width || !height) return null;

  const hasProgress = (progressDuration ?? 0) > 0;
  const path = roundedBar(
    x,
    y,
    width,
    height,
    hasProgress ? 0 : 6,
    6,
    6,
    hasProgress ? 0 : 6,
  );

  return <path d={path} fill={fill} />;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function CombinedTaskBar(props: any) {
  const { x, y, width, height, payload } = props;
  const { progress, status } = payload;

  const progressWidth = (width * progress) / 100;
  const remainingWidth = width - progressWidth;

  return (
    <g>
      {progressWidth > 0 && (
        <ProgressBar
          x={x}
          y={y}
          width={progressWidth}
          height={height}
          fill={getStatusStrongColor(status)}
          remainingDuration={remainingWidth}
        />
      )}
      {remainingWidth > 0 && (
        <RemainingBar
          x={x + progressWidth}
          y={y}
          width={remainingWidth}
          height={height}
          fill={getStatusSoftColor(status)}
          progressDuration={progressWidth}
        />
      )}
    </g>
  );
}
