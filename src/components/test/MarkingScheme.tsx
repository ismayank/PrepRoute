export default function MarkingScheme() {
  return (
    <div>
      <h3 className="mb-4 font-medium">
        Marking Scheme
      </h3>

      <div className="grid grid-cols-5 gap-4">
        <Input label="Wrong Answer" value="-1" />
        <Input label="Unattempted" value="0" />
        <Input label="Correct Answer" value="+5" />
        <Input label="No of Questions" />
        <Input label="Total Marks" />
      </div>
    </div>
  );
}

function Input({
  label,
  value,
}: {
  label: string;
  value?: string;
}) {
  return (
    <div>
      <label className="block mb-2 text-sm">
        {label}
      </label>

      <input
        defaultValue={value}
        className="w-full h-12 border rounded-lg px-4"
      />
    </div>
  );
}