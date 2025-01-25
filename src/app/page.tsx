import { Point } from "@/types";

export default function Home() {
  const points: Point[] = [
    { x: 0.1, y: 0.2, isInsideCircle: true },
    { x: 0.3, y: 0.4, isInsideCircle: false },
    { x: 0.5, y: 0.6, isInsideCircle: true },
  ];

  return (
    <div className="flex justify-center items-center h-screen bg-gray-900 text-white flex-col">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-title">Monte Carlo Pi</h1>
        <p className="text-lg">
          Testing testing
        </p>
      </div>
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
      <div className="mt-8">
        <button className="bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded transition duration-300 ease-in-out transform hover:scale-105">
          Start
        </button>
        <input
          type="number"
          placeholder="iterations (1000)"
          className="ml-4 p-2 border border-gray-300 rounded bg-gray-800 text-white"
        />
      </div>
    </div>
  );
}
