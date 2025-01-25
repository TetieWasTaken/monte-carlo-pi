export default function Home() {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-900 text-white flex-col">
      <h1 className="text-4xl font-title">Monte Carlo Pi</h1>
      <p className="text-lg">
        Testing testing
      </p>
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
      </svg>
    </div>
  );
}
