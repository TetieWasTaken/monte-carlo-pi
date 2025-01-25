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

const enum SimulationMode {
  Simulate,
  NoSimulate,
  Automatic,
}

const SimulationModeLabels = {
  [SimulationMode.Simulate]: "Simulate",
  [SimulationMode.NoSimulate]: "Instant",
  [SimulationMode.Automatic]: "Automatic",
};

export default function Home() {
  const [points, setPoints] = useState<Point[]>([]);
  const [iterations, setIterations] = useState(1000);
  const [simulationIterations, setSimulationIterations] = useState(0);
  const [simulationMode, setSimulationMode] = useState(
    SimulationMode.Automatic,
  );

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const simulationId = useRef<number | null>(null);

  const drawPoint = (ctx: CanvasRenderingContext2D, point: Point) => {
    const { x, y, isInsideCircle } = point;
    ctx.fillStyle = isInsideCircle ? "#ff7f7f" : "#7f7fff";
    ctx.beginPath();
    ctx.arc(
      x * 500,
      y * 500,
      Math.max(1, Math.min(5, 4000 / simulationIterations)),
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

    let runSimulation: boolean;
    if (simulationMode === SimulationMode.Simulate) runSimulation = true;
    else if (simulationMode === SimulationMode.NoSimulate) {
      runSimulation = false;
    } else runSimulation = iterations <= 1000;

    if (runSimulation) {
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
    } else {
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
          Approximate pi using the{" "}
          <a
            href="https://en.wikipedia.org/wiki/Monte_Carlo_method"
            className="text-red-400 underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Monte Carlo method
          </a>
        </p>
      </div>
      <div className="flex relative">
        <div className="absolute top-0 right-full mr-4 p-4 rounded w-80">
          <p className="text-lg">
            The Monte Carlo method is a statistical method that uses random
            sampling to estimate numerical results.
          </p>
          <p className="text-lg mt-4">
            In this simulation, a circle is inscribed in a quadrant. The ratio
            between the area of the circle and the area of the square is
            <span
              className="text-white"
              dangerouslySetInnerHTML={{
                __html: katex.renderToString(
                  `\\frac{\\pi r^2}{(2r)^2} = \\frac{\\pi}{4}`,
                  { throwOnError: false, displayMode: true, output: "mathml" },
                ),
              }}
            />
            This means we can approximate pi by generating random points in the
            quadrant and calculating the ratio of points inside the circle to
            the total number of points.
            <span
              className="text-white"
              dangerouslySetInnerHTML={{
                __html: katex.renderToString(
                  `\\frac{\\pi}{4} \\approx \\frac{r}{n}`,
                  { throwOnError: false, displayMode: true, output: "mathml" },
                ),
              }}
            />
            <span
              className="text-white"
              dangerouslySetInnerHTML={{
                __html: katex.renderToString(
                  `r = \\text{points inside circle}`,
                  { throwOnError: false, displayMode: true, output: "mathml" },
                ),
              }}
            />
            <span
              className="text-white"
              dangerouslySetInnerHTML={{
                __html: katex.renderToString(
                  `n = \\text{total points}`,
                  { throwOnError: false, displayMode: true, output: "mathml" },
                ),
              }}
            />
          </p>
        </div>
        <canvas ref={canvasRef} width="500" height="500" />
        <div className="absolute top-0 left-full ml-4 p-4 rounded w-80">
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
          {!isNaN(parseFloat(estimatedPi)) && (
            <>
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
                      {
                        throwOnError: false,
                        displayMode: true,
                        output: "mathml",
                      },
                    ),
                  }}
                />
              </p>
              <p className="text-lg mt-4">
                <span className="text-white">
                  Difference:{" "}
                </span>
                <span
                  className={Math.abs(Math.PI - parseFloat(estimatedPi)) < 0.01
                    ? "text-[#7fff7f]"
                    : Math.abs(Math.PI - parseFloat(estimatedPi)) < 0.1
                    ? "text-[#ffff7f]"
                    : "text-[#ff7f7f]"}
                >
                  {Math.abs(Math.PI - parseFloat(estimatedPi)).toPrecision(
                    points.length.toString().length,
                  )}
                </span>
              </p>
            </>
          )}
        </div>
      </div>
      <div className="mt-8">
        <button
          className="bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none mr-4"
          onClick={startSimulation}
        >
          Start
        </button>
        <input
          type="number"
          placeholder="iterations (1000)"
          className="p-2 border border-gray-300 rounded bg-gray-800 text-white"
          value={iterations.toString()}
          onChange={(e) => {
            setIterations(parseInt(e.target.value, 10));
          }}
        />
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none ml-4"
          onClick={() => {
            setSimulationMode((mode) => (mode + 1) % 3);
          }}
        >
          {SimulationModeLabels[simulationMode]}
        </button>
      </div>
    </div>
  );
}
