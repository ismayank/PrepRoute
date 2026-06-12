export default function OptionsList() {
  return (
    <div className="mt-10">
      <h3 className="text-2xl font-medium mb-6">
        Type the options below
      </h3>

      {[1, 2, 3, 4].map((item) => (
        <div
          key={item}
          className="flex items-center gap-6 mb-8"
        >
          <input
            type="radio"
            className="h-7 w-7"
          />

          <input
            placeholder="Type Option here"
            className="
              flex-1
              h-[56px]
              rounded-xl
              border
              px-6
            "
          />
        </div>
      ))}
    </div>
  );
}