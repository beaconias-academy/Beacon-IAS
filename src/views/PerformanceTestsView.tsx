import React, { useState, useEffect } from 'react';
import { ScreenId, MockTest, QuizQuestion, TestAttemptResult } from '../types';
import { MOCK_TESTS_DATA } from '../data/mockData';
import { useToast } from '../components/Toast';

interface PerformanceTestsViewProps {
  onNavigate: (screen: ScreenId) => void;
  testAttempts: TestAttemptResult[];
  onRecordTestAttempt: (attempt: TestAttemptResult) => void;
}

export const PerformanceTestsView: React.FC<PerformanceTestsViewProps> = ({
  onNavigate,
  testAttempts,
  onRecordTestAttempt,
}) => {
  const { showToast } = useToast();
  const [activeTest, setActiveTest] = useState<MockTest | null>(null);
  const [currentQIndex, setCurrentQIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [qId: number]: number }>({});
  const [showExplanation, setShowExplanation] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(600);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [scorecard, setScorecard] = useState<TestAttemptResult | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>('All');

  // Timer countdown
  useEffect(() => {
    if (!activeTest || isCompleted) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [activeTest, isCompleted]);

  const handleStartTest = (test: MockTest) => {
    setActiveTest(test);
    setCurrentQIndex(0);
    setSelectedAnswers({});
    setShowExplanation(false);
    setTimeLeft(test.durationMinutes * 60);
    setIsCompleted(false);
    setScorecard(null);
  };

  const handleSelectOption = (optionIndex: number) => {
    if (!activeTest || isCompleted) return;
    const currentQ = activeTest.questions[currentQIndex];
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQ.id]: optionIndex,
    }));
  };

  const handleSubmitTest = () => {
    if (!activeTest) return;

    let correctCount = 0;
    const subjectMap: { [s: string]: { correct: number; total: number } } = {};

    activeTest.questions.forEach((q) => {
      if (!subjectMap[q.subject]) {
        subjectMap[q.subject] = { correct: 0, total: 0 };
      }
      subjectMap[q.subject].total += 1;

      if (selectedAnswers[q.id] === q.correctIndex) {
        correctCount += 1;
        subjectMap[q.subject].correct += 1;
      }
    });

    const scorePct = Math.round((correctCount / activeTest.questions.length) * 100);
    const timeSpent = activeTest.durationMinutes * 60 - timeLeft;

    const result: TestAttemptResult = {
      testId: activeTest.id,
      testTitle: activeTest.title,
      totalQuestions: activeTest.questions.length,
      correctAnswers: correctCount,
      scorePercentage: scorePct,
      timeSpentSeconds: Math.max(15, timeSpent),
      completedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      subjectBreakdown: subjectMap,
    };

    setScorecard(result);
    setIsCompleted(true);
    onRecordTestAttempt(result);
    showToast(`Test Finished! Scored ${scorePct}%`, 'success', 'emoji_events');
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Compute aggregate stats from testAttempts
  const totalAttempts = testAttempts.length;
  const avgScore =
    totalAttempts > 0
      ? Math.round(testAttempts.reduce((acc, t) => acc + t.scorePercentage, 0) / totalAttempts)
      : 76;

  // Active Test Simulator View
  if (activeTest) {
    const currentQ = activeTest.questions[currentQIndex];
    const userSelected = selectedAnswers[currentQ?.id];
    const totalQ = activeTest.questions.length;
    const answeredCount = Object.keys(selectedAnswers).length;

    return (
      <div className="flex flex-col w-full pb-24 p-3.5 sm:p-4 space-y-3.5 animate-in fade-in duration-200">
        {/* Simulator Top Bar */}
        <div className="rounded-2xl p-3.5 bg-slate-900 text-white flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2 min-w-0">
            <span className="font-bold text-xs truncate max-w-[180px]">{activeTest.title}</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-600 font-bold shrink-0">
              {formatTime(timeLeft)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to end this test simulation?')) {
                  handleSubmitTest();
                }
              }}
              className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs"
            >
              Submit
            </button>
            <button
              onClick={() => {
                if (window.confirm('Quit test? Your progress will be discarded.')) {
                  setActiveTest(null);
                }
              }}
              className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-xs"
              title="Exit Test"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Scorecard Results Overlay (When finished) */}
        {isCompleted && scorecard ? (
          <div className="rounded-2xl p-5 bg-white space-y-4 shadow-xl border border-blue-200 animate-in zoom-in-95">
            <div className="text-center space-y-1">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-sm">
                <span className="material-symbols-outlined text-3xl">emoji_events</span>
              </div>
              <h2 className="text-xl font-extrabold text-slate-900">Diagnostic Scorecard</h2>
              <p className="text-xs text-slate-500 font-mono">Completed at {scorecard.completedAt}</p>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2.5 rounded-2xl bg-blue-50 border border-blue-100">
                <span className="text-2xl font-extrabold text-blue-700">{scorecard.scorePercentage}%</span>
                <span className="block text-[10px] font-bold text-slate-500 uppercase mt-0.5">Score</span>
              </div>
              <div className="p-2.5 rounded-2xl bg-emerald-50 border border-emerald-100">
                <span className="text-2xl font-extrabold text-emerald-700">
                  {scorecard.correctAnswers}/{scorecard.totalQuestions}
                </span>
                <span className="block text-[10px] font-bold text-slate-500 uppercase mt-0.5">Correct</span>
              </div>
              <div className="p-2.5 rounded-2xl bg-purple-50 border border-purple-100">
                <span className="text-2xl font-extrabold text-purple-700">{formatTime(scorecard.timeSpentSeconds)}</span>
                <span className="block text-[10px] font-bold text-slate-500 uppercase mt-0.5">Time</span>
              </div>
            </div>

            {/* Subject Accuracy Breakdown */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <h4 className="text-xs font-bold text-slate-800">Subject Diagnostics</h4>
              {Object.entries(scorecard.subjectBreakdown).map(([subj, val]) => {
                const data = val as { correct: number; total: number };
                const pct = Math.round((data.correct / data.total) * 100);
                return (
                  <div key={subj} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-700">{subj}</span>
                      <span className="font-mono text-slate-500">{data.correct}/{data.total} ({pct}%)</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${pct >= 70 ? 'bg-emerald-500' : 'bg-amber-500'}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => handleStartTest(activeTest)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-colors"
              >
                Retake Test
              </button>
              <button
                onClick={() => setActiveTest(null)}
                className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
              >
                Back to Tests
              </button>
            </div>
          </div>
        ) : (
          /* Question View */
          <div className="space-y-3">
            {/* Question Progress Header */}
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-900">
                  Question {currentQIndex + 1} of {totalQ}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.2 rounded bg-blue-50 text-blue-700">
                  {currentQ?.subject}
                </span>
              </div>
              <span className="text-xs font-mono font-semibold text-slate-400">
                {answeredCount}/{totalQ} Answered
              </span>
            </div>

            {/* Question Box */}
            <div className="rounded-2xl p-4 bg-white border border-slate-200 shadow-xs space-y-3">
              <p className="text-sm font-semibold text-slate-900 leading-relaxed">
                {currentQ?.question}
              </p>

              {/* Options */}
              <div className="space-y-2 pt-1">
                {currentQ?.options.map((opt, oIdx) => {
                  const isSelected = userSelected === oIdx;
                  return (
                    <button
                      key={oIdx}
                      onClick={() => handleSelectOption(oIdx)}
                      className={`w-full text-left p-3 rounded-2xl text-xs font-medium border flex items-start gap-3 transition-all active:scale-[0.98] ${
                        isSelected
                          ? 'bg-blue-50/80 border-blue-600 text-blue-900 shadow-2xs font-semibold'
                          : 'bg-slate-50/60 border-slate-200 hover:border-blue-300 text-slate-800'
                      }`}
                    >
                      <div
                        className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                          isSelected
                            ? 'bg-blue-600 text-white'
                            : 'bg-white border border-slate-300 text-slate-600'
                        }`}
                      >
                        {String.fromCharCode(65 + oIdx)}
                      </div>
                      <span className="flex-1 leading-relaxed">{opt}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bottom Nav Stepper */}
            <div className="flex items-center justify-between gap-2 pt-1">
              <button
                onClick={() => setCurrentQIndex((prev) => Math.max(0, prev - 1))}
                disabled={currentQIndex === 0}
                className="px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-700 text-xs font-bold transition-all flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                Prev
              </button>

              <div className="flex items-center gap-2">
                {currentQIndex === totalQ - 1 ? (
                  <button
                    onClick={handleSubmitTest}
                    className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs active:scale-95 transition-all flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[16px]">check_circle</span>
                    Submit Test
                  </button>
                ) : (
                  <button
                    onClick={() => setCurrentQIndex((prev) => Math.min(totalQ - 1, prev + 1))}
                    className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs active:scale-95 transition-all flex items-center gap-1"
                  >
                    Next
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Test List & Performance Overview Mode
  return (
    <div className="flex flex-col w-full pb-24 p-3.5 sm:p-4 space-y-4 animate-in fade-in duration-200">
      {/* Performance Analytics Bento Banner */}
      <section className="grid grid-cols-2 gap-2">
        <div className="rounded-2xl p-3.5 flex flex-col justify-between bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Avg Accuracy</span>
            <span className="material-symbols-outlined text-blue-600 text-base">monitoring</span>
          </div>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="text-2xl font-extrabold text-slate-900">{avgScore}%</span>
            <span className="text-[10px] text-emerald-600 font-bold">Top 8%</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-0.5">Across {totalAttempts || 4} attempts</p>
        </div>

        <div className="rounded-2xl p-3.5 flex flex-col justify-between bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Percentile</span>
            <span className="material-symbols-outlined text-amber-500 text-base">workspace_premium</span>
          </div>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="text-2xl font-extrabold text-amber-600">94.2</span>
            <span className="text-[10px] text-slate-400 font-mono">th</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-0.5">State Rank: #34 / 1,248</p>
        </div>
      </section>

      {/* Filter Chips */}
      <section className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-sm font-bold text-slate-900">Available Mock Tests</h2>
          <span className="text-[11px] font-mono text-slate-500">{MOCK_TESTS_DATA.length} Tests Ready</span>
        </div>

        <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
          {['All', 'Polity', 'Economy', 'Geography', 'Full Length'].map((f) => (
            <button
              key={f}
              onClick={() => setCategoryFilter(f)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 ${
                categoryFilter === f
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </section>

      {/* Tests Catalog */}
      <section className="space-y-2.5">
        {MOCK_TESTS_DATA.map((test, tIdx) => (
          <div
            key={test.id}
            className="rounded-2xl p-4 bg-white border border-slate-200 flex flex-col justify-between space-y-3 hover:border-blue-300 transition-all shadow-xs"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded uppercase tracking-wider bg-blue-50 text-blue-700">
                    {test.subject}
                  </span>
                  <span className="text-[9px] font-bold px-1.5 py-0.2 rounded uppercase tracking-wider bg-emerald-50 text-emerald-700">
                    Active Drill #{tIdx + 1}
                  </span>
                </div>
                <h3 className="text-xs font-bold text-slate-900 leading-snug">{test.title}</h3>
                <p className="text-[11px] text-slate-500 mt-0.5">High-yield standard exam format questions.</p>
              </div>

              <div className="text-right shrink-0">
                <span className="font-mono text-xs font-bold text-slate-700 block">
                  {test.questions.length} MCQs
                </span>
                <span className="text-[10px] text-slate-400 font-mono">{test.durationMinutes} Mins</span>
              </div>
            </div>

            <button
              onClick={() => handleStartTest(test)}
              className="w-full py-2.5 bg-slate-900 hover:bg-blue-600 text-white text-xs font-bold rounded-xl shadow-xs active:scale-95 transition-all flex items-center justify-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">play_circle</span>
              Start Test Simulator
            </button>
          </div>
        ))}
      </section>
    </div>
  );
};
