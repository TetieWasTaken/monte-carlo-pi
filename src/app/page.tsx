"use client";

import { useState } from "react";
import { Point } from "@/types";

export default function Home() {
  const [points, setPoints] = useState<Point[]>([]);
  const [iterations, setIterations] = useState(1000);

  const randomPoint = (): Point => {
    const x = Math.random();
    const y = Math.random();
    const isInsideCircle = x ** 2 + (1 - y) ** 2 <= 1;
    return { x, y, isInsideCircle };
  };

  const startSimulation = async (): Promise<void> => {
    const newPoints: Point[] = [];
    for (let i = 0; i < iterations; i++) {
      newPoints.push(randomPoint());
      setPoints([...newPoints]);
      await new Promise((resolve) => setTimeout(resolve, 1000 / iterations));
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-900 text-white flex-col">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-title">Monte Carlo Pi</h1>
        <p className="text-lg">
          Testing testing
        </p>
      </div>
      <div className="flex relative">
        <svg width="500" height="500">
          <rect
            x="0"
            y="0"
            width="500"
            height="500"
            fill="none"
            stroke="white"
            strokeWidth="3"
          />
          <path
            d="M 500 500 A 500 500 0 0 0 0 0"
            fill="none"
            stroke="white"
            strokeWidth="3"
          />
          {points.map(({ x, y, isInsideCircle }) => (
            <circle
              cx={x * 500}
              cy={y * 500}
              r="5"
              fill={isInsideCircle ? "#ff7f7f" : "#7f7fff"}
              key={`${x}-${y}`}
            />
          ))}
        </svg>
        <div
          className={`absolute top-0 left-full ml-4 p-4 rounded w-64`}
        >
          <p className="text-lg">
            Total points: <span className="text-white">{points.length}</span>
          </p>
          <p className="text-lg">
            Points inside circle:{" "}
            <span className="text-[#ff7f7f]">
              {points.filter((p) => p.isInsideCircle).length}
            </span>
          </p>
          <p className="text-lg">
            Points outside circle:{" "}
            <span className="text-[#7f7fff]">
              {points.filter((p) => !p.isInsideCircle).length}
            </span>
          </p>
          <p className="text-lg">
            Estimated value of Pi:{" "}
            <span className="text-[#7fff7f]">
              {(4 * (points.filter((p) =>
                p.isInsideCircle
              ).length / points.length)).toPrecision(
                points.length.toString().length,
              )}
            </span>
          </p>
        </div>
      </div>
      <div className="mt-8">
        <button
          className="bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none"
          onClick={() => startSimulation()}
        >
          Start
        </button>
        <input
          type="number"
          placeholder="iterations (1000)"
          className="ml-4 p-2 border border-gray-300 rounded bg-gray-800 text-white"
          value={iterations}
          onChange={(e) => setIterations(parseInt(e.target.value))}
        />
      </div>
    </div>
  );
}
