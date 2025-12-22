export type DrawContext =
  | CanvasRenderingContext2D
  | OffscreenCanvasRenderingContext2D;

type DrawFrameOptions = {
  reducedMotion?: boolean;
};

const duration = (60000 / 140) * 4;
const outerEffectCount = 4;
const outerEffectDuration = duration;
const particleDuration = duration;
const particleBurstCount = 16;
const particleFadeTime = particleDuration * 2;

type Particle = {
  x: number;
  y: number;
  velocityX: number;
  velocityY: number;
  size: number;
  spin: number;
  bornAt: number;
};

const particles: Particle[] = [];
const particlePool: Particle[] = [];
let lastCornerIndex: number | null = null;

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
  options: DrawFrameOptions = {},
) => {
  ctx.clearRect(0, 0, width, height);
  const reducedMotion = options.reducedMotion ?? false;

  if (reducedMotion) {
    particles.length = 0;
    lastCornerIndex = null;
    drawInnerSquare(ctx, width, height, 0);
    drawOuterSquare(ctx, width, height, 0);
    return;
  }

  drawInnerSnare(ctx, width, height, time % duration);
  drawOuterEffectSquare(ctx, width, height, time % duration, outerEffectCount);
  drawInnerSquare(ctx, width, height, time % duration);
  drawCornerBurstSquares(ctx, width, height, time);
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

function drawCornerBurstSquares(
  ctx: DrawContext,
  width: number,
  height: number,
  time: number,
) {
  const progress = (time % particleDuration) / particleDuration;
  const cornerIndex = Math.floor(progress / 0.25) % 4;

  if (cornerIndex !== lastCornerIndex) {
    const origin = getOuterCirclePoint(width, height, cornerIndex * 0.25);
    emitCornerBurst(origin, width, height, time);
    lastCornerIndex = cornerIndex;
  }

  updateAndDrawParticles(ctx, time);
}

function drawOuterCircle(
  ctx: DrawContext,
  width: number,
  height: number,
  time: number,
) {
  using _state = drawState(ctx);
  ctx.strokeStyle = "transparent";
  ctx.fillStyle = "#48b0d5";
  const progress = (time % duration) / duration;
  const { x, y } = getOuterCirclePoint(width, height, progress);
  const circleRadius = 6;
  ctx.beginPath();
  ctx.ellipse(x, y, circleRadius, circleRadius, 0, 0, Math.PI * 2);
  ctx.fill();
}

const easeOutQuint = (t: number) => 1 - Math.pow(1 - t, 5);

const emitCornerBurst = (
  origin: { x: number; y: number },
  width: number,
  height: number,
  time: number,
) => {
  const travelScale = Math.min(width, height);

  for (let index = 0; index < particleBurstCount; index += 1) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 0.08 + Math.random() * 0.2;
    const size = 4 + Math.random() * 6;
    const spin = (Math.random() - 0.5) * Math.PI * 2;
    const velocity = travelScale * speed;
    const particle = particlePool.pop();

    if (particle) {
      particle.x = origin.x;
      particle.y = origin.y;
      particle.velocityX = Math.cos(angle) * velocity;
      particle.velocityY = Math.sin(angle) * velocity;
      particle.size = size;
      particle.spin = spin;
      particle.bornAt = time;
      particles.push(particle);
    } else {
      particles.push({
        x: origin.x,
        y: origin.y,
        velocityX: Math.cos(angle) * velocity,
        velocityY: Math.sin(angle) * velocity,
        size,
        spin,
        bornAt: time,
      });
    }
  }
};

const updateAndDrawParticles = (ctx: DrawContext, time: number) => {
  let writeIndex = 0;

  for (let index = 0; index < particles.length; index += 1) {
    const particle = particles[index];
    const age = time - particle.bornAt;
    if (age < 0) {
      particlePool.push(particle);
      continue;
    }

    const progress = Math.min(age / particleFadeTime, 1);
    const eased = easeOutQuint(progress);
    const x = particle.x + particle.velocityX * eased;
    const y = particle.y + particle.velocityY * eased;
    const alpha = Math.floor(220 * (1 - Math.min(progress * 2, 1)));
    if (alpha <= 0) {
      particlePool.push(particle);
      continue;
    }
    const size = particle.size * (1 - 0.3 * progress);

    using _state = drawState(ctx);
    ctx.translate(x, y);
    ctx.rotate(progress * particle.spin);
    ctx.fillStyle = `#48b0d5${alpha.toString(16).padStart(2, "0")}`;
    ctx.fillRect(-size / 2, -size / 2, size, size);

    particles[writeIndex] = particle;
    writeIndex += 1;
  }

  particles.length = writeIndex;
};

const getOuterCirclePoint = (
  width: number,
  height: number,
  progress: number,
) => {
  const rectSize = Math.min(width, height) * (2 / 5) * 2.1;
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
  return {
    x: width / 2 + x,
    y: height / 2 + y,
  };
};
