import { useState } from "react";

function Assessment() {
  const [currentQuestion, setCurrentQuestion] = useState(0);

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          Mental Health Assessment
        </h1>

        <p className="text-gray-600 mt-2">
          Answer each question honestly. Your responses help us
          understand your current wellbeing and provide appropriate
          recommendations.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow p-8">
        <p className="text-gray-500">
          Question {currentQuestion + 1}
        </p>

        <h2 className="text-xl font-semibold mt-3">
          Assessment questions will appear here.
        </h2>

        <div className="flex justify-between mt-10">
          <button
            disabled
            className="px-5 py-2 rounded bg-gray-300 text-gray-600"
          >
            Previous
          </button>

          <button
            className="px-5 py-2 rounded bg-blue-600 text-white"
            onClick={() => setCurrentQuestion(currentQuestion + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default Assessment;