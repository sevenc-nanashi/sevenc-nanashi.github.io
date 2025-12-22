<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import { drawFrame } from "./backgroundCanvasDraw";

const canvasRef = ref<HTMLCanvasElement | null>(null);

let animationId = 0;
let cleanup: (() => void) | null = null;
let offscreenCanvas: OffscreenCanvas | HTMLCanvasElement | null = null;
let offscreenCtx:
  | CanvasRenderingContext2D
  | OffscreenCanvasRenderingContext2D
  | null = null;
let worker: Worker | null = null;
let useWorker = false;

type CanvasSize = {
  width: number;
  height: number;
  dpr: number;
};

const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const getCanvasSize = (): CanvasSize => ({
  width: window.innerWidth,
  height: window.innerHeight,
  dpr: Math.max(1, window.devicePixelRatio || 1),
});

const applyCanvasStyle = (canvas: HTMLCanvasElement, size: CanvasSize) => {
  canvas.style.width = `${size.width}px`;
  canvas.style.height = `${size.height}px`;
};

const syncCanvasResolution = (canvas: HTMLCanvasElement, size: CanvasSize) => {
  canvas.width = Math.floor(size.width * size.dpr);
  canvas.height = Math.floor(size.height * size.dpr);
};

const blitFrame = (
  ctx: CanvasRenderingContext2D,
  source: OffscreenCanvas | HTMLCanvasElement,
) => {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.drawImage(source, 0, 0);
};

const tick = (
  ctx: CanvasRenderingContext2D,
  width: () => number,
  height: () => number,
  time: number,
) => {
  if (!offscreenCtx || !offscreenCanvas) return;
  const currentWidth = width();
  const currentHeight = height();

  drawFrame(offscreenCtx, currentWidth, currentHeight, time);
  blitFrame(ctx, offscreenCanvas);
  animationId = window.requestAnimationFrame((nextTime) => {
    tick(ctx, width, height, nextTime);
  });
};

onMounted(() => {
  const canvas = canvasRef.value;
  if (!canvas) return;

  let size = getCanvasSize();
  let ctx: CanvasRenderingContext2D | null = null;
  const reducedMotion = prefersReducedMotion();

  const setCanvasSize = () => {
    size = getCanvasSize();
    applyCanvasStyle(canvas, size);
  };

  const ensureOffscreen = () => {
    if (!offscreenCanvas) {
      offscreenCanvas =
        typeof OffscreenCanvas === "undefined"
          ? document.createElement("canvas")
          : new OffscreenCanvas(canvas.width, canvas.height);
    }
    offscreenCanvas.width = canvas.width;
    offscreenCanvas.height = canvas.height;
    offscreenCtx = offscreenCanvas.getContext("2d");
    if (!offscreenCtx) return false;
    offscreenCtx.setTransform(size.dpr, 0, 0, size.dpr, 0, 0);
    return true;
  };

  const resize = () => {
    setCanvasSize();
    if (useWorker) {
      worker?.postMessage({ type: "resize", ...size });
      return;
    }

    if (!ctx) return;
    syncCanvasResolution(canvas, size);
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    if (!ensureOffscreen()) return;
    if (!offscreenCtx || !offscreenCanvas) return;

    drawFrame(offscreenCtx, size.width, size.height, performance.now(), {
      reducedMotion,
    });
    blitFrame(ctx, offscreenCanvas);
  };

  const supportsWorker =
    typeof OffscreenCanvas !== "undefined" &&
    "transferControlToOffscreen" in canvas;

  if (supportsWorker) {
    try {
      const offscreen = canvas.transferControlToOffscreen();
      worker = new Worker(
        new URL("./backgroundCanvas.worker.ts", import.meta.url),
        { type: "module" },
      );
      setCanvasSize();
      worker.postMessage(
        {
          type: "init",
          canvas: offscreen,
          ...size,
          reducedMotion,
        },
        [offscreen],
      );
      useWorker = true;
    } catch {
      worker?.terminate();
      worker = null;
      useWorker = false;
    }
  }

  if (!useWorker) {
    ctx = canvas.getContext("2d");
    if (!ctx) return;
  }

  resize();
  window.addEventListener("resize", resize);

  if (!useWorker && !reducedMotion) {
    animationId = window.requestAnimationFrame((time) =>
      tick(
        ctx as CanvasRenderingContext2D,
        () => size.width,
        () => size.height,
        time,
      ),
    );
  }

  cleanup = () => {
    window.removeEventListener("resize", resize);
    if (animationId) window.cancelAnimationFrame(animationId);
    if (worker) {
      worker.postMessage({ type: "dispose" });
      worker.terminate();
      worker = null;
    }
  };
});

onBeforeUnmount(() => {
  cleanup?.();
});
</script>

<template>
  <canvas ref="canvasRef" class="background-canvas" aria-hidden="true" />
</template>

<style scoped>
.background-canvas {
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;
}
</style>
