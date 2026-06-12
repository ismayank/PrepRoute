export default function DifficultySelector() {
  return (
    <div>
      <label className="block mb-4 text-sm text-[#344054]">
        Test Difficulty Level
      </label>

      <div className="flex gap-8">
        {["Easy", "Medium", "Difficult"].map((item) => (
          <label
            key={item}
            className="flex items-center gap-2"
          >
            <input type="radio" name="difficulty" />
            {item}
          </label>
        ))}
      </div>
    </div>
  );
}