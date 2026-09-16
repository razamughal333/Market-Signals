import { useEffect, useRef } from 'react';

interface Candle {
  x: number;
  open: number;
  close: number;
  high: number;
  low: number;
  bullish: boolean;
}

/**
 * Full-viewport animated background: a faint grid + slowly scrolling
 * candlesticks drifting right-to-left, like a trading terminal ticker
 * running behind the actual UI. Pure canvas, no dependencies, low CPU
 * (redraws are simple rects/lines, one requestAnimationFrame loop).
 *
 * Sits fixed behind everything via z-index; the app content needs a
 * transparent/semi-transparent background above it to let it show through.
 */
export default function TradingBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let candles: Candle[] = [];
    const candleWidth = 14;
    const candleGap = 8;

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas!.width = width;
      canvas!.height = height;
    }

    function makeCandle(x: number, prevClose: number): Candle {
      const drift = (Math.random() - 0.48) * 30;
      const open = prevClose;
      const close = prevClose + drift;
      const high = Math.max(open, close) + Math.random() * 12;
      const low = Math.min(open, close) - Math.random() * 12;
      return { x, open, close, high, low, bullish: close >= open };
    }

    function seedCandles() {
      candles = [];
      let price = height * 0.5;
      const count = Math.ceil(width / (candleWidth + candleGap)) + 2;
      for (let i = 0; i < count; i++) {
        const c = makeCandle(i * (candleWidth + candleGap), price);
        candles.push(c);
        price = c.close;
        // keep the random walk roughly centered on screen
        if (price < height * 0.2) price = height * 0.5;
        if (price > height * 0.8) price = height * 0.5;
      }
    }

    resize();
    seedCandles();
    window.addEventListener('resize', () => {
      resize();
      seedCandles();
    });

    let scrollX = 0;
    let frameId: number;

    function draw() {
      ctx!.clearRect(0, 0, width, height);

      // background gradient — deep navy/black, trading-terminal feel
      const gradient = ctx!.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, '#05070d');
      gradient.addColorStop(1, '#0a0f1e');
      ctx!.fillStyle = gradient;
      ctx!.fillRect(0, 0, width, height);

      // faint grid
      ctx!.strokeStyle = 'rgba(255,255,255,0.03)';
      ctx!.lineWidth = 1;
      const gridSize = 60;
      for (let x = -((scrollX * 0.2) % gridSize); x < width; x += gridSize) {
        ctx!.beginPath();
        ctx!.moveTo(x, 0);
        ctx!.lineTo(x, height);
        ctx!.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx!.beginPath();
        ctx!.moveTo(0, y);
        ctx!.lineTo(width, y);
        ctx!.stroke();
      }

      // candlesticks, scrolling slowly right-to-left
      candles.forEach((c) => {
        const x = c.x - scrollX;
        if (x < -candleWidth || x > width + candleWidth) return;

        const color = c.bullish ? 'rgba(34,197,94,0.18)' : 'rgba(248,113,113,0.18)';
        const wickColor = c.bullish ? 'rgba(34,197,94,0.28)' : 'rgba(248,113,113,0.28)';

        // wick
        ctx!.strokeStyle = wickColor;
        ctx!.lineWidth = 1.5;
        ctx!.beginPath();
        ctx!.moveTo(x + candleWidth / 2, height - c.high);
        ctx!.lineTo(x + candleWidth / 2, height - c.low);
        ctx!.stroke();

        // body
        const bodyTop = height - Math.max(c.open, c.close);
        const bodyHeight = Math.max(Math.abs(c.close - c.open), 2);
        ctx!.fillStyle = color;
        ctx!.fillRect(x, bodyTop, candleWidth, bodyHeight);
      });

      scrollX += 0.35; // slow drift — subtle, not distracting
      // recycle candles that have scrolled off-screen by extending the walk on the right
      const rightmost = candles[candles.length - 1];
      if (rightmost.x - scrollX < width) {
        const next = makeCandle(rightmost.x + candleWidth + candleGap, rightmost.close);
        candles.push(next);
        candles.shift();
      }

      frameId = requestAnimationFrame(draw);
    }

    frameId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 h-full w-full"
      aria-hidden="true"
    />
  );
}
