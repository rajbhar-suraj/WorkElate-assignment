

const Toolbar = ({ color, setColor, strokeWidth, setStrokeWidth, clearCanvas }) => {
  const colorMap = {
    black: "bg-black",
    red: "bg-red-500",
    blue: "bg-blue-500",
    green: "bg-green-500",
  };
  return (
    <div className="flex justify-center fixed w-full space-x-1.5 md:space-x-10 p-4 bg-gray-100 ">
      {/* Colors */}
      <div className="flex flex-row space-x-2 md:space-x-10  justify-evenly">
        {Object.keys(colorMap).map((c) => (
        <button
          key={c}
          onClick={() => setColor(c)}
          className={`w-10 h-8 rounded-md ${colorMap[c]} border-2 border-gray-300`}
        ></button>
      ))}
      </div>

      {/* Stroke width */}
      <div className="flex flex-col">
        <label className="text-sm">Stroke Width</label>
        <input
          type="range"
          min="1"
          max="10"
          value={strokeWidth}
          onChange={(e) => setStrokeWidth(e.target.value)}
          className="w-full"
        />
      </div>

      {/* Clear canvas */}
      <button
        onClick={clearCanvas}
        className="bg-green-800 text-white px-3 py-1 rounded hover:bg-green-950"
      >
        Clear
      </button>
    </div>
  );
};

export default Toolbar;
