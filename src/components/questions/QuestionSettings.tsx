import { FiChevronDown } from "react-icons/fi";

export default function QuestionSettings() {
  return (
    <div className="mt-20">
      <h2 className="text-[32px] font-medium mb-10">
        Question settings
      </h2>

      {[
        "Level of Difficulty",
        "Topic",
        "Sub-topic",
      ].map((label) => (
        <div key={label} className="mb-8">
          <label className="block mb-3 text-lg">
            {label}
          </label>

          <div className="relative">
            <input
              placeholder="Select from Drop-down"
              className="
                w-full
                h-[56px]
                rounded-xl
                border
                px-5
              "
            />

            <FiChevronDown
              className="
                absolute
                right-5
                top-1/2
                -translate-y-1/2
              "
            />
          </div>
        </div>
      ))}
    </div>
  );
}