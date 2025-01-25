"use client";

import { useEffect, useRef, useState } from "react";
import { Point } from "@/types";
import katex from "katex";

const randomPoint = (): Point => {
  const x = Math.random();
  const y = Math.random();
  const isInsideCircle = x ** 2 + (1 - y) ** 2 <= 1;
  return { x, y, isInsideCircle };
};

export default function Home() {
  const [points, setPoints] = useState<Point[]>([]);
  const [iterations, setIterations] = useState(1000);
  const [simulationIterations, setSimulationIterations] = useState(0);
  const [skipSimulation, setSkipSimulation] = useState(true);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const simulationId = useRef<number | null>(null);

  const drawPoint = (ctx: CanvasRenderingContext2D, point: Point) => {
    const { x, y, isInsideCircle } = point;
    ctx.fillStyle = isInsideCircle ? "#ff7f7f" : "#7f7fff";
    ctx.beginPath();
    ctx.arc(
      x * 500,
      y * 500,
      Math.max(2, Math.min(5, 5000 / simulationIterations)),
      0,
      2 * Math.PI,
    );
    ctx.fill();
  };

  const startSimulation = async (): Promise<void> => {
    if (simulationId.current !== null) {
      cancelAnimationFrame(simulationId.current);
    }

    setPoints([]);
    setSimulationIterations(iterations);
    const newPoints: Point[] = [];
    let i = 0;

    if (skipSimulation) {
      for (i = 0; i < iterations; i++) {
        newPoints.push(randomPoint());
      }
      setPoints(newPoints);
      if (canvasRef.current) {
        const ctx = canvasRef.current.getContext("2d");
        if (ctx) {
          ctx.clearRect(0, 0, 500, 500);
          newPoints.forEach((point) => drawPoint(ctx, point));
        }
      }
    } else {
      const simulate = () => {
        if (i < iterations) {
          const point = randomPoint();
          newPoints.push(point);
          setPoints([...newPoints]);
          if (canvasRef.current) {
            const ctx = canvasRef.current.getContext("2d");
            if (ctx) {
              drawPoint(ctx, point);
            }
          }
          i++;
          simulationId.current = requestAnimationFrame(simulate);
        }
      };
      simulate();
    }
  };

  useEffect(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, 500, 500);

        points.forEach((point) => drawPoint(ctx, point));

        ctx.lineWidth = 6;
        ctx.strokeStyle = "#ffffff";
        ctx.strokeRect(0, 0, 500, 500);

        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 500, 500, Math.PI / 2, 0);
        ctx.stroke();
      }
    }
  }, [points]);

  const pointsInsideCircle = points.filter((p) => p.isInsideCircle).length;
  const estimatedPi = (4 * (pointsInsideCircle / points.length)).toPrecision(
    points.length.toString().length,
  );

  return (
    <div className="flex justify-center items-center h-screen bg-gray-900 text-white flex-col">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-title">Monte Carlo Pi</h1>
        <p className="text-lg">
          Testing testing
        </p>
      </div>
      <div className="flex relative">
        <canvas ref={canvasRef} width="500" height="500" />
        <div className="absolute top-0 left-full ml-4 p-4 rounded w-64">
          <p className="text-lg">
            Total points: <span className="text-white">{points.length}</span>
          </p>
          <p className="text-lg">
            Points inside circle:{" "}
            <span className="text-[#ff7f7f]">
              {pointsInsideCircle}
            </span>
          </p>
          <p className="text-lg">
            Points outside circle:{" "}
            <span className="text-[#7f7fff]">
              {points.length - pointsInsideCircle}
            </span>
          </p>
          <p className="text-lg">
            Estimated value of Pi:{" "}
            <span className="text-[#7fff7f]">
              {estimatedPi}
            </span>
          </p>
          <p className="text-lg mt-4">
            <span
              className="text-white"
              dangerouslySetInnerHTML={{
                __html: katex.renderToString(
                  `\\pi \\approx 4 \\cdot \\frac{r}{n} = 4 \\cdot \\frac{${pointsInsideCircle}}{${points.length}}= \\color{#7fff7f} ${estimatedPi}`,
                  { throwOnError: false, displayMode: true, output: "mathml" },
                ),
              }}
            />
          </p>
        </div>
      </div>
      <div className="mt-8">
        <button
          className="bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none"
          onClick={startSimulation}
        >
          Start
        </button>
        <input
          type="number"
          placeholder="iterations (1000)"
          className="m-4 mt-0 p-2 border border-gray-300 rounded bg-gray-800 text-white"
          value={iterations}
          onChange={(e) => setIterations(parseInt(e.target.value, 10))}
        />
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none"
          onClick={() => setSkipSimulation((prev) => !prev)}
        >
          Skip
        </button>
      </div>
    </div>
  );
}
