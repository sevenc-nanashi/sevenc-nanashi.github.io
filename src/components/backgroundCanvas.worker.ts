import { drawFrame } from "./backgroundCanvasDraw";

type InitMessage = {
  type: "init";
  canvas: OffscreenCanvas;
  width: number;
  height: number;
  dpr: number;
  reducedMotion: boolean;
};

type ResizeMessage = {
  type: "resize";
  width: number;
  height: number;
  dpr: number;
};

type ControlMessage = {
  type: "start" | "stop" | "dispose";
};

type WorkerMessage = InitMessage | ResizeMessage | ControlMessage;

type CanvasSize = {
  width: number;
  height: number;
  dpr: number;
};

let canvas: OffscreenCanvas | null = null;
let ctx: OffscreenCanvasRenderingContext2D | null = null;
let size: CanvasSize = { width: 0, height: 0, dpr: 1 };
let running = false;
let frameHandle: number | null = null;

const applyCanvasSize = (nextSize: CanvasSize) => {
  size = nextSize;
  if (!canvas || !ctx) return;
  canvas.width = Math.floor(size.width * size.dpr);
  canvas.height = Math.floor(size.height * size.dpr);
  ctx.setTransform(size.dpr, 0, 0, size.dpr, 0, 0);
};

const render = (time: number) => {
  if (!ctx) return;
  drawFrame(ctx, size.width, size.height, time);
};

const scheduleNextFrame = () => {
  if (!running) return;
  if (typeof self.requestAnimationFrame === "function") {
    frameHandle = self.requestAnimationFrame(loop);
    return;
  }
  frameHandle = self.setTimeout(() => loop(performance.now()), 1000 / 60);
};

const cancelFrame = () => {
  if (frameHandle === null) return;
  if (typeof self.cancelAnimationFrame === "function") {
    self.cancelAnimationFrame(frameHandle);
  } else {
    self.clearTimeout(frameHandle);
  }
  frameHandle = null;
};

const loop = (time: number) => {
  if (!running) return;
  render(time);
  scheduleNextFrame();
};

const start = () => {
  if (running) return;
  running = true;
  cancelFrame();
  scheduleNextFrame();
};

const stop = () => {
  running = false;
  cancelFrame();
};

self.onmessage = (event: MessageEvent<WorkerMessage>) => {
  const message = event.data;
  if (message.type === "init") {
    canvas = message.canvas;
    ctx = canvas.getContext("2d");
    if (!ctx) return;
    applyCanvasSize({
      width: message.width,
      height: message.height,
      dpr: message.dpr,
    });
    render(performance.now());
    if (!message.reducedMotion) start();
    return;
  }

  if (message.type === "resize") {
    applyCanvasSize({
      width: message.width,
      height: message.height,
      dpr: message.dpr,
    });
    render(performance.now());
    return;
  }

  if (message.type === "start") start();
  if (message.type === "stop") stop();
  if (message.type === "dispose") stop();
};
