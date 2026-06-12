export default function SolutionEditor() {
  return (
    <div className="mt-8">
      <h3 className="text-[32px] font-medium mb-5">
        Add Solution
      </h3>

      <textarea
        placeholder="Type here"
        className="
          w-full
          h-[220px]
          rounded-xl
          border
          p-5
          resize-none
        "
      />
    </div>
  );
}