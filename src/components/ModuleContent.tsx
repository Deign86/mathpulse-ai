import { useState } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, CheckCircle, XCircle, ArrowRight, ArrowLeft, Award, Star } from 'lucide-react';
import { Module } from '../types';

interface ModuleContentProps {
  module: Module;
  onComplete: () => void;
  onBack: () => void;
}

export function ModuleContent({ module, onComplete, onBack }: ModuleContentProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, string>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [exerciseAnswers, setExerciseAnswers] = useState<Record<number, string>>({});
  const [exerciseSubmitted, setExerciseSubmitted] = useState(false);

  // Mock quiz questions
  const quizQuestions = [
    {
      id: 1,
      question: "What is the derivative of f(x) = x²?",
      options: ["x", "2x", "x²", "2"],
      correct: "2x"
    },
    {
      id: 2,
      question: "What is the power rule for derivatives?",
      options: ["d/dx[xⁿ] = nxⁿ⁻¹", "d/dx[xⁿ] = xⁿ⁺¹", "d/dx[xⁿ] = nxⁿ", "d/dx[xⁿ] = xⁿ"],
      correct: "d/dx[xⁿ] = nxⁿ⁻¹"
    },
    {
      id: 3,
      question: "What is the derivative of f(x) = 5x³ + 2x?",
      options: ["15x² + 2", "5x² + 2", "15x³ + 2x", "5x⁴ + x²"],
      correct: "15x² + 2"
    },
    {
      id: 4,
      question: "The derivative represents the _____ of change.",
      options: ["speed", "rate", "average", "total"],
      correct: "rate"
    }
  ];

  // Mock exercise problems
  const exerciseProblems = [
    {
      id: 1,
      problem: "Find the derivative of f(x) = 3x⁴",
      solution: "12x³"
    },
    {
      id: 2,
      problem: "Find the derivative of g(x) = 7x² - 4x + 1",
      solution: "14x - 4"
    },
    {
      id: 3,
      problem: "If f(x) = x⁵, what is f'(x)?",
      solution: "5x⁴"
    },
    {
      id: 4,
      problem: "Find the derivative of h(x) = 2x³ + 5x² - 3x + 8",
      solution: "6x² + 10x - 3"
    },
    {
      id: 5,
      problem: "What is the derivative of f(x) = 10x at x = 2?",
      solution: "10"
    }
  ];

  const handleQuizSubmit = () => {
    setQuizSubmitted(true);
    const correctCount = quizQuestions.filter(q => quizAnswers[q.id] === q.correct).length;
    if (correctCount === quizQuestions.length) {
      setTimeout(() => {
        onComplete();
      }, 2000);
    }
  };

  const handleExerciseSubmit = () => {
    setExerciseSubmitted(true);
    const correctCount = exerciseProblems.filter(p => 
      exerciseAnswers[p.id]?.toLowerCase().replace(/\s/g, '') === p.solution.toLowerCase().replace(/\s/g, '')
    ).length;
    if (correctCount === exerciseProblems.length) {
      setTimeout(() => {
        onComplete();
      }, 2000);
    }
  };

  const calculateQuizScore = () => {
    const correctCount = quizQuestions.filter(q => quizAnswers[q.id] === q.correct).length;
    return Math.round((correctCount / quizQuestions.length) * 100);
  };

  const calculateExerciseScore = () => {
    const correctCount = exerciseProblems.filter(p => 
      exerciseAnswers[p.id]?.toLowerCase().replace(/\s/g, '') === p.solution.toLowerCase().replace(/\s/g, '')
    ).length;
    return Math.round((correctCount / exerciseProblems.length) * 100);
  };

  // Video Player Content
  if (module.type === 'video') {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-500 to-purple-700 p-6 text-white">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-white/90 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Modules
          </button>
          <h2 className="text-white mb-2">{module.title}</h2>
          <p className="text-white/90">Video Lesson • {module.duration}</p>
        </div>

        {/* Video Player */}
        <div className="relative bg-slate-900 aspect-video">
          {/* Placeholder Video Screen */}
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900">
            <div className="text-center">
              <div className="bg-white/10 backdrop-blur-sm p-8 rounded-full mb-4 mx-auto w-32 h-32 flex items-center justify-center">
                {isPlaying ? (
                  <Pause className="w-16 h-16 text-white" />
                ) : (
                  <Play className="w-16 h-16 text-white ml-2" />
                )}
              </div>
              <p className="text-white/75">Video Player Placeholder</p>
            </div>
          </div>

          {/* Video Controls */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
            {/* Progress Bar */}
            <div className="mb-3">
              <input
                type="range"
                min="0"
                max="100"
                value={videoProgress}
                onChange={(e) => setVideoProgress(Number(e.target.value))}
                className="w-full h-1 bg-white/30 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #a855f7 0%, #a855f7 ${videoProgress}%, rgba(255,255,255,0.3) ${videoProgress}%, rgba(255,255,255,0.3) 100%)`
                }}
              />
            </div>

            {/* Control Buttons */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="text-white hover:text-purple-300 transition-colors"
                >
                  {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                </button>
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="text-white hover:text-purple-300 transition-colors"
                >
                  {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
                </button>
                <span className="text-white text-sm">
                  {Math.floor(videoProgress * 0.12)}:{String(Math.floor((videoProgress * 0.12 * 60) % 60)).padStart(2, '0')} / 12:00
                </span>
              </div>
              <button className="text-white hover:text-purple-300 transition-colors">
                <Maximize className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Video Info */}
        <div className="p-6 space-y-4">
          <div>
            <h3 className="text-slate-900 mb-2">About this lesson</h3>
            <p className="text-slate-600">
              In this video, you'll learn the fundamental concepts of derivatives and the power rule. 
              We'll work through several examples to help you understand how to apply these concepts to various functions.
            </p>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h4 className="text-purple-900 mb-2">Key Topics Covered:</h4>
            <ul className="space-y-2 text-purple-800">
              <li className="flex items-start gap-2">
                <span className="text-purple-500 mt-1">•</span>
                <span>Understanding what derivatives represent</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-500 mt-1">•</span>
                <span>The power rule and when to use it</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-500 mt-1">•</span>
                <span>Step-by-step derivative calculations</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-500 mt-1">•</span>
                <span>Common mistakes to avoid</span>
              </li>
            </ul>
          </div>

          <button
            onClick={onComplete}
            className="w-full bg-gradient-to-r from-purple-500 to-purple-700 text-white py-3 rounded-lg hover:from-purple-600 hover:to-purple-800 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
          >
            <CheckCircle className="w-5 h-5" />
            Mark as Complete & Earn 50 XP
          </button>
        </div>
      </div>
    );
  }

  // Quiz Content
  if (module.type === 'quiz') {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-green-700 p-6 text-white">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-white/90 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Modules
          </button>
          <h2 className="text-white mb-2">{module.title}</h2>
          <p className="text-white/90">Quiz Assessment • {quizQuestions.length} Questions</p>
        </div>

        {/* Quiz Content */}
        <div className="p-6 space-y-6">
          {!quizSubmitted ? (
            <>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-900">
                  <strong>Instructions:</strong> Answer all questions to the best of your ability. 
                  You'll receive immediate feedback once you submit.
                </p>
              </div>

              {quizQuestions.map((question, index) => (
                <div key={question.id} className="border border-slate-200 rounded-lg p-5">
                  <p className="text-slate-900 mb-4">
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded mr-2 text-sm">
                      Q{index + 1}
                    </span>
                    {question.question}
                  </p>
                  <div className="space-y-2">
                    {question.options.map((option) => (
                      <label
                        key={option}
                        className={`flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer transition-all ${
                          quizAnswers[question.id] === option
                            ? 'border-green-500 bg-green-50'
                            : 'border-slate-200 hover:border-green-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name={`question-${question.id}`}
                          value={option}
                          checked={quizAnswers[question.id] === option}
                          onChange={() => setQuizAnswers({ ...quizAnswers, [question.id]: option })}
                          className="w-4 h-4 text-green-600"
                        />
                        <span className="text-slate-700">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}

              <button
                onClick={handleQuizSubmit}
                disabled={Object.keys(quizAnswers).length !== quizQuestions.length}
                className="w-full bg-gradient-to-r from-green-500 to-green-700 text-white py-3 rounded-lg hover:from-green-600 hover:to-green-800 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Submit Quiz
              </button>
            </>
          ) : (
            <>
              {/* Results */}
              <div className={`border-2 rounded-xl p-6 text-center ${
                calculateQuizScore() >= 75 ? 'border-green-500 bg-green-50' : 'border-amber-500 bg-amber-50'
              }`}>
                <div className="flex items-center justify-center mb-4">
                  {calculateQuizScore() >= 75 ? (
                    <div className="bg-green-500 p-4 rounded-full">
                      <Award className="w-12 h-12 text-white" />
                    </div>
                  ) : (
                    <div className="bg-amber-500 p-4 rounded-full">
                      <Star className="w-12 h-12 text-white" />
                    </div>
                  )}
                </div>
                <h3 className={calculateQuizScore() >= 75 ? 'text-green-900' : 'text-amber-900'}>
                  Quiz Complete!
                </h3>
                <p className={`text-4xl my-4 ${calculateQuizScore() >= 75 ? 'text-green-600' : 'text-amber-600'}`}>
                  {calculateQuizScore()}%
                </p>
                <p className={calculateQuizScore() >= 75 ? 'text-green-700' : 'text-amber-700'}>
                  You got {quizQuestions.filter(q => quizAnswers[q.id] === q.correct).length} out of {quizQuestions.length} correct
                </p>
              </div>

              {/* Answer Review */}
              <div>
                <h4 className="text-slate-900 mb-4">Answer Review</h4>
                <div className="space-y-4">
                  {quizQuestions.map((question, index) => {
                    const isCorrect = quizAnswers[question.id] === question.correct;
                    return (
                      <div
                        key={question.id}
                        className={`border-2 rounded-lg p-4 ${
                          isCorrect ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'
                        }`}
                      >
                        <div className="flex items-start gap-3 mb-3">
                          {isCorrect ? (
                            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                          ) : (
                            <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-1" />
                          )}
                          <div className="flex-1">
                            <p className={isCorrect ? 'text-green-900' : 'text-red-900'}>
                              <strong>Q{index + 1}:</strong> {question.question}
                            </p>
                          </div>
                        </div>
                        <div className="ml-8 space-y-1 text-sm">
                          <p className={isCorrect ? 'text-green-700' : 'text-red-700'}>
                            Your answer: <strong>{quizAnswers[question.id]}</strong>
                          </p>
                          {!isCorrect && (
                            <p className="text-green-700">
                              Correct answer: <strong>{question.correct}</strong>
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setQuizAnswers({});
                    setQuizSubmitted(false);
                  }}
                  className="flex-1 bg-slate-200 text-slate-700 py-3 rounded-lg hover:bg-slate-300 transition-colors"
                >
                  Retry Quiz
                </button>
                <button
                  onClick={onComplete}
                  className="flex-1 bg-gradient-to-r from-green-500 to-green-700 text-white py-3 rounded-lg hover:from-green-600 hover:to-green-800 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-5 h-5" />
                  Complete & Earn 75 XP
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  // Exercise Content
  if (module.type === 'exercise') {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-700 p-6 text-white">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-white/90 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Modules
          </button>
          <h2 className="text-white mb-2">{module.title}</h2>
          <p className="text-white/90">Practice Exercises • {exerciseProblems.length} Problems</p>
        </div>

        {/* Exercise Content */}
        <div className="p-6 space-y-6">
          {!exerciseSubmitted ? (
            <>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-900">
                  <strong>Instructions:</strong> Solve each problem and enter your answer. 
                  Show your work on paper for better understanding.
                </p>
              </div>

              {exerciseProblems.map((problem, index) => (
                <div key={problem.id} className="border border-slate-200 rounded-lg p-5">
                  <p className="text-slate-900 mb-4">
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded mr-2 text-sm">
                      Problem {index + 1}
                    </span>
                    {problem.problem}
                  </p>
                  <input
                    type="text"
                    value={exerciseAnswers[problem.id] || ''}
                    onChange={(e) => setExerciseAnswers({ ...exerciseAnswers, [problem.id]: e.target.value })}
                    placeholder="Enter your answer..."
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              ))}

              <button
                onClick={handleExerciseSubmit}
                disabled={Object.keys(exerciseAnswers).length !== exerciseProblems.length}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white py-3 rounded-lg hover:from-blue-600 hover:to-blue-800 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Submit Exercises
              </button>
            </>
          ) : (
            <>
              {/* Results */}
              <div className={`border-2 rounded-xl p-6 text-center ${
                calculateExerciseScore() >= 75 ? 'border-blue-500 bg-blue-50' : 'border-amber-500 bg-amber-50'
              }`}>
                <div className="flex items-center justify-center mb-4">
                  {calculateExerciseScore() >= 75 ? (
                    <div className="bg-blue-500 p-4 rounded-full">
                      <Award className="w-12 h-12 text-white" />
                    </div>
                  ) : (
                    <div className="bg-amber-500 p-4 rounded-full">
                      <Star className="w-12 h-12 text-white" />
                    </div>
                  )}
                </div>
                <h3 className={calculateExerciseScore() >= 75 ? 'text-blue-900' : 'text-amber-900'}>
                  Exercises Complete!
                </h3>
                <p className={`text-4xl my-4 ${calculateExerciseScore() >= 75 ? 'text-blue-600' : 'text-amber-600'}`}>
                  {calculateExerciseScore()}%
                </p>
                <p className={calculateExerciseScore() >= 75 ? 'text-blue-700' : 'text-amber-700'}>
                  You got {exerciseProblems.filter(p => 
                    exerciseAnswers[p.id]?.toLowerCase().replace(/\s/g, '') === p.solution.toLowerCase().replace(/\s/g, '')
                  ).length} out of {exerciseProblems.length} correct
                </p>
              </div>

              {/* Answer Review */}
              <div>
                <h4 className="text-slate-900 mb-4">Solution Review</h4>
                <div className="space-y-4">
                  {exerciseProblems.map((problem, index) => {
                    const isCorrect = exerciseAnswers[problem.id]?.toLowerCase().replace(/\s/g, '') === 
                                     problem.solution.toLowerCase().replace(/\s/g, '');
                    return (
                      <div
                        key={problem.id}
                        className={`border-2 rounded-lg p-4 ${
                          isCorrect ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'
                        }`}
                      >
                        <div className="flex items-start gap-3 mb-3">
                          {isCorrect ? (
                            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                          ) : (
                            <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-1" />
                          )}
                          <div className="flex-1">
                            <p className={isCorrect ? 'text-green-900' : 'text-red-900'}>
                              <strong>Problem {index + 1}:</strong> {problem.problem}
                            </p>
                          </div>
                        </div>
                        <div className="ml-8 space-y-1 text-sm">
                          <p className={isCorrect ? 'text-green-700' : 'text-red-700'}>
                            Your answer: <strong>{exerciseAnswers[problem.id] || '(No answer)'}</strong>
                          </p>
                          {!isCorrect && (
                            <p className="text-green-700">
                              Correct answer: <strong>{problem.solution}</strong>
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setExerciseAnswers({});
                    setExerciseSubmitted(false);
                  }}
                  className="flex-1 bg-slate-200 text-slate-700 py-3 rounded-lg hover:bg-slate-300 transition-colors"
                >
                  Retry Exercises
                </button>
                <button
                  onClick={onComplete}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-blue-700 text-white py-3 rounded-lg hover:from-blue-600 hover:to-blue-800 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-5 h-5" />
                  Complete & Earn 100 XP
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  return null;
}
