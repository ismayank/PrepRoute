export default function QuestionEditor() {
  return (
    <>
      <h2 className="text-[34px] font-semibold mb-8">
        Question
        <span className="text-[#7A9AF8] ml-2">
          4/50
        </span>
      </h2>

      <button className="text-[#FF6B6B] mb-6">
        Delete All Edits
      </button>

      <div
        className="
          border
          border-[#C7D7FF]
          rounded-xl
          overflow-hidden
        "
      >
        <div className="h-[48px] border-b bg-[#F9FAFB]" />

        <textarea
          placeholder="Type here"
          className="
            w-full
            h-[220px]
            p-5
            resize-none
            outline-none
          "
        />
      </div>
    </>
  );
}