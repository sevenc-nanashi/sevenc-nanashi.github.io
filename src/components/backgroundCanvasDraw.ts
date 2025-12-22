export type DrawContext =
  | CanvasRenderingContext2D
  | OffscreenCanvasRenderingContext2D;

const duration = (60000 / 140) * 4;
const outerEffectCount = 4;
const outerEffectDuration = duration;

function drawState(ctx: DrawContext) {
  ctx.save();
  return {
    [Symbol.dispose]() {
      ctx.restore();
    },
  };
}

export const drawFrame = (
  ctx: DrawContext,
  width: number,
  height: number,
  time: number,
) => {
  ctx.clearRect(0, 0, width, height);

  drawInnerSnare(ctx, width, height, time % duration);
  drawOuterEffectSquare(ctx, width, height, time % duration, outerEffectCount);
  drawInnerSquare(ctx, width, height, time % duration);
  drawOuterSquare(ctx, width, height, time % duration);
  drawOuterCircle(ctx, width, height, time % duration);
};

function drawInnerSnare(
  ctx: DrawContext,
  width: number,
  height: number,
  time: number,
) {
  using _state = drawState(ctx);
  const progress = ((time + duration / 4) % (duration / 2)) / (duration / 2);

  const rectSize =
    Math.min(width, height) * (2 / 5) * (1 - 0.3 * easeOutQuint(progress));

  ctx.strokeStyle = `#48b0d5${Math.floor(128 * (1 - Math.min(progress * 3, 1)))
    .toString(16)
    .padStart(2, "0")}`;
  ctx.lineWidth = 3;
  ctx.fillStyle = "transparent";
  ctx.translate(width / 2, height / 2);

  ctx.beginPath();
  ctx.moveTo(-rectSize / 2, -rectSize / 2);
  ctx.lineTo(rectSize / 2, -rectSize / 2);
  ctx.lineTo(rectSize / 2, rectSize / 2);
  ctx.lineTo(-rectSize / 2, rectSize / 2);
  ctx.closePath();
  ctx.stroke();
}

function drawOuterEffectSquare(
  ctx: DrawContext,
  width: number,
  height: number,
  time: number,
  count = 1,
) {
  const phaseStep = duration / 4;
  for (let index = 0; index < count; index += 1) {
    const progress =
      ((time + phaseStep * index) % outerEffectDuration) / outerEffectDuration;
    const rectSize =
      Math.min(width, height) * (2 / 5) * (1 + 0.4 * easeOutQuint(progress));
    const alpha = Math.floor(128 * (1 - Math.min(progress * 2, 1)));

    using _state = drawState(ctx);

    ctx.strokeStyle = `#48b0d5${alpha.toString(16).padStart(2, "0")}`;
    ctx.lineWidth = 3;
    ctx.fillStyle = "transparent";
    ctx.translate(width / 2, height / 2);

    ctx.beginPath();
    ctx.moveTo(-rectSize / 2, -rectSize / 2);
    ctx.lineTo(rectSize / 2, -rectSize / 2);
    ctx.lineTo(rectSize / 2, rectSize / 2);
    ctx.lineTo(-rectSize / 2, rectSize / 2);
    ctx.closePath();
    ctx.stroke();
  }
}

function drawInnerSquare(
  ctx: DrawContext,
  width: number,
  height: number,
  time: number,
) {
  using _state = drawState(ctx);
  const rectSize =
    Math.min(width, height) *
    (2 / 5) *
    (1 + 0.1 * (1 - easeOutQuint((time % (duration / 4)) / (duration / 4))));

  ctx.strokeStyle = "#48b0d5";
  ctx.lineWidth = 3;
  ctx.fillStyle = "transparent";
  ctx.translate(width / 2, height / 2);

  ctx.beginPath();
  ctx.moveTo(-rectSize / 2, -rectSize / 2);
  ctx.lineTo(rectSize / 2, -rectSize / 2);
  ctx.lineTo(rectSize / 2, rectSize / 2);
  ctx.lineTo(-rectSize / 2, rectSize / 2);
  ctx.closePath();
  ctx.stroke();
}

function drawOuterSquare(
  ctx: DrawContext,
  width: number,
  height: number,
  _time: number,
) {
  using _state = drawState(ctx);
  const rectSize = Math.min(width, height) * (2 / 5) * 2.1;
  ctx.strokeStyle = "#48b0d540";
  ctx.lineWidth = 2;
  ctx.fillStyle = "transparent";
  ctx.translate(width / 2, height / 2);

  ctx.beginPath();
  ctx.moveTo(0, -rectSize / 2);
  ctx.lineTo(rectSize / 2, 0);
  ctx.lineTo(0, rectSize / 2);
  ctx.lineTo(-rectSize / 2, 0);
  ctx.closePath();
  ctx.stroke();
}

function drawOuterCircle(
  ctx: DrawContext,
  width: number,
  height: number,
  time: number,
) {
  using _state = drawState(ctx);
  const rectSize = Math.min(width, height) * (2 / 5) * 2.1;
  ctx.strokeStyle = "transparent";
  ctx.fillStyle = "#48b0d5";
  ctx.translate(width / 2, height / 2);

  const progress = (time % duration) / duration;
  let x: number;
  let y: number;
  if (progress < 0.25) {
    x = (rectSize / 2) * (progress / 0.25);
    y = -rectSize / 2 + (rectSize / 2) * (progress / 0.25);
  } else if (progress < 0.5) {
    x = rectSize / 2 - (rectSize / 2) * ((progress - 0.25) / 0.25);
    y = (rectSize / 2) * ((progress - 0.25) / 0.25);
  } else if (progress < 0.75) {
    x = -(rectSize / 2) * ((progress - 0.5) / 0.25);
    y = rectSize / 2 - (rectSize / 2) * ((progress - 0.5) / 0.25);
  } else {
    x = -rectSize / 2 + (rectSize / 2) * ((progress - 0.75) / 0.25);
    y = -(rectSize / 2) * ((progress - 0.75) / 0.25);
  }
  const circleRadius = 6;
  ctx.beginPath();
  ctx.ellipse(x, y, circleRadius, circleRadius, 0, 0, Math.PI * 2);
  ctx.fill();
}

const easeOutQuint = (t: number) => 1 - Math.pow(1 - t, 5);
