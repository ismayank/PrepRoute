import DifficultySelector from "./DifficultySelector";
import MarkingScheme from "./MarkingScheme";

export default function TestForm() {
  return (
    <form className="space-y-8">
      {/* Tabs */}
      <div className="flex border rounded-xl overflow-hidden w-fit">
        <button
          type="button"
          className="px-6 py-3 bg-[#F3F6FF] text-[#3559E0]"
        >
          Chapter Wise
        </button>

        <button
          type="button"
          className="px-6 py-3 text-[#98A2B3]"
        >
          PYQ
        </button>

        <button
          type="button"
          className="px-6 py-3 text-[#98A2B3]"
        >
          Mock Test
        </button>
      </div>

      {/* Form Grid */}
      <div className="grid grid-cols-2 gap-6">
        <Field label="Subject" />

        <InputField
          label="Name of Test"
          placeholder="Enter name of Test"
        />

        <Field label="Topic" />

        <Field label="Sub Topic" />

        <InputField
          label="Duration (Minutes)"
          placeholder="Enter duration"
        />

        <DifficultySelector />
      </div>

      <MarkingScheme />

      {/* Footer */}
      <div className="flex justify-end gap-4">
        <button
          type="button"
          className="w-28 h-11 rounded-lg bg-gray-100"
        >
          Cancel
        </button>

        <button
          type="submit"
          className="w-28 h-11 rounded-lg bg-[#6C7CFF] text-white"
        >
          Save
        </button>
      </div>
    </form>
  );
}

function Field({ label }: { label: string }) {
  return (
    <div>
      <label className="block mb-2 text-sm text-[#344054]">
        {label}
      </label>

      <select className="w-full h-12 border rounded-lg px-4">
        <option>Choose from Drop-down</option>
      </select>
    </div>
  );
}

function InputField({
  label,
  placeholder,
}: {
  label: string;
  placeholder: string;
}) {
  return (
    <div>
      <label className="block mb-2 text-sm text-[#344054]">
        {label}
      </label>

      <input
        placeholder={placeholder}
        className="w-full h-12 border rounded-lg px-4"
      />
    </div>
  );
}