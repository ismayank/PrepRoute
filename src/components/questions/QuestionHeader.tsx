export default function QuestionHeader() {
  return (
    <>
      <div className="h-[72px] border-b px-6 flex items-center justify-between">
        <div className="text-[#667085]">
          Test Creation / Create Test / Chapter Wise
        </div>

        <button className="bg-[#6D80F7] text-white px-12 py-3 rounded-xl">
          Publish
        </button>
      </div>

      <div className="p-6">
        <div className="border rounded-2xl p-6">
          <span className="bg-[#0D1B65] text-white px-4 py-1 rounded-full">
            Chapter Wise
          </span>

          <div className="mt-6 flex items-center gap-3">
            <h2 className="font-semibold text-2xl">
              Chapter 1
            </h2>

            <span className="bg-[#35C3B4] text-white px-4 py-1 rounded-lg">
              Easy
            </span>
          </div>

          <div className="grid grid-cols-2 mt-8 gap-y-4">
            <div>Subject : English</div>

            <div className="flex justify-end gap-8">
              <span>60 Min</span>
              <span>50 Q's</span>
              <span>250 Marks</span>
            </div>

            <div>
              Topic :
              <span className="ml-3 border border-yellow-400 rounded-lg px-3 py-1">
                Grammar
              </span>

              <span className="ml-2 border border-yellow-400 rounded-lg px-3 py-1">
                Writing
              </span>
            </div>

            <div>
              Sub Topic :
              <span className="ml-3 border border-yellow-400 rounded-lg px-3 py-1">
                Application
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}