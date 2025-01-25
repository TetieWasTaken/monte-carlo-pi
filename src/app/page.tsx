"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Point } from "@/types";
import katex from "katex";
import { Line } from "react-chartjs-2";
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import Link from "next/link";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

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
  const [piData, setPiData] = useState<number[]>([]);

  const piChart = useMemo(() => ({
    labels: piData.map((_, i) => i * Math.floor(simulationIterations / 50)),
    datasets: [
      {
        label: "Approx. π",
        pointRadius: 0,
        data: piData,
        borderColor: "#7fff7f",
        backgroundColor: "rgba(0, 255, 0, 0.2)",
        fill: false,
      },
      {
        label: "π",
        pointRadius: 0,
        data: piData.map(() => Math.PI),
        borderColor: "#ff7f7f",
        backgroundColor: "rgba(255, 0, 0, 0.2)",
        borderDash: [10, 5],
        fill: false,
      },
    ],
  }), [piData, simulationIterations]);

  const piChartOptions = useMemo(() => ({
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Convergence of π Approximation",
      },
    },
    scales: {
      x: {
        type: "linear" as const,
        title: {
          display: true,
          text: "Points",
        },
        min: 0,
        max: piData.length * Math.floor(simulationIterations / 50),
      },
      y: {
        title: {
          display: true,
          text: "Approximated π",
        },
        min: 2.9,
        max: 3.4,
      },
    },
    animation: {
      duration: 0,
    },
  }), [piData, simulationIterations]);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const simulationId = useRef<number | null>(null);

  const drawPoint = useCallback(
    (ctx: CanvasRenderingContext2D, point: Point) => {
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
    },
    [simulationIterations],
  );

  const startSimulation = useCallback(async (): Promise<void> => {
    if (simulationId.current !== null) {
      cancelAnimationFrame(simulationId.current);
    }

    setPoints([]);
    setPiData([]);
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

          if (i % Math.floor(iterations / 50) === 0) {
            setPiData((data) => {
              const pointsInsideCircle = newPoints.filter((p) =>
                p.isInsideCircle
              )
                .length;
              const estimatedPi = (
                4 *
                (pointsInsideCircle / newPoints.length)
              ).toPrecision(newPoints.length.toString().length);
              return [...data, parseFloat(estimatedPi)];
            });
          }

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
  }, [drawPoint, iterations, simulationMode]);

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
  }, [points, drawPoint]);

  const pointsInsideCircle = points.filter((p) => p.isInsideCircle).length;
  const estimatedPi = points.length > 0
    ? (4 * (pointsInsideCircle / points.length)).toPrecision(
      points.length.toString().length,
    )
    : "0";

  return (
    <div className="flex justify-center items-center h-screen bg-gray-900 text-white flex-col">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-title">Monte Carlo Pi</h1>
        <p className="text-lg">
          Approximate{" "}
          <span
            className="text-white"
            dangerouslySetInnerHTML={{
              __html: katex.renderToString("\\pi", {
                output: "mathml",
              }),
            }}
          />{" "}
          using the{" "}
          <Link
            href="https://en.wikipedia.org/wiki/Monte_Carlo_method"
            className="text-red-400 underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Monte Carlo method
          </Link>
        </p>
      </div>
      <div className="flex relative">
        <div className="absolute top-0 right-full mr-4 p-4 rounded w-96">
          <p className="text-lg">
            The Monte Carlo method is a statistical method that uses{" "}
            <span className="text-red-400 font-medium">random</span>{" "}
            sampling to estimate numerical results.
          </p>
          <p className="text-lg mt-4">
            In this simulation, a circle is inscribed in a quadrant. The ratio
            between the area of the circle and the{" "}
            <span className="text-red-400 font-medium">area</span>{" "}
            of the square is
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
            quadrant and calculating the{" "}
            <span className="text-red-400 font-medium">ratio</span>{" "}
            of points inside the circle to the total number of points.
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
            Total points:{" "}
            <span className="text-white font-medium">{points.length}</span>
          </p>
          <p className="text-lg">
            Points inside circle:{" "}
            <span className="text-[#ff7f7f] font-medium">
              {pointsInsideCircle}
            </span>
          </p>
          <p className="text-lg">
            Points outside circle:{" "}
            <span className="text-[#7f7fff] font-medium">
              {points.length - pointsInsideCircle}
            </span>
          </p>
          {!isNaN(parseFloat(estimatedPi)) && (
            <>
              <p className="text-lg">
                Approximated value of Pi:{" "}
                <span className="text-[#7fff7f] font-medium">
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
                    : "text-[#ff7f7f]" + " font-medium"}
                >
                  {Math.abs(Math.PI - parseFloat(estimatedPi)).toPrecision(
                    points.length.toString().length,
                  )}
                </span>
              </p>
              {piData.length > 0 && (
                <div className="mt-4">
                  <Line data={piChart} options={piChartOptions} />
                </div>
              )}
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
          placeholder="points (1000)"
          className="p-2 border border-gray-300 rounded bg-gray-800 text-white"
          onChange={(e) => {
            const value = parseInt(e.target.value, 10);
            setIterations(value);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              startSimulation();
            }
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
