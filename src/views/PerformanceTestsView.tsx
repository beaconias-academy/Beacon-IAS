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
      <div className="w-full max-w-7xl mx-auto pb-24 md:pb-12 p-3 sm:p-4 md:p-6 lg:p-8 space-y-4 animate-in fade-in duration-200">
        {/* Simulator Top Bar */}
        <div className="rounded-3xl p-4 md:p-5 bg-slate-900 text-white flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-3 min-w-0">
            <span className="font-bold text-xs md:text-sm truncate max-w-md">{activeTest.title}</span>
            <span className="text-xs font-mono px-3 py-1 rounded-xl bg-blue-600 font-bold shrink-0 shadow-xs">
              ⏱️ {formatTime(timeLeft)}
            </span>
          </div>
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to end this test simulation?')) {
                  handleSubmitTest();
                }
              }}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              Submit Test
            </button>
            <button
              onClick={() => {
                if (window.confirm('Quit test? Your progress will be discarded.')) {
                  setActiveTest(null);
                }
              }}
              className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-xs font-bold"
              title="Exit Test"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Scorecard Results Overlay (When finished) */}
        {isCompleted && scorecard ? (
          <div className="rounded-3xl p-6 md:p-8 bg-white space-y-6 shadow-xl border border-blue-200 animate-in zoom-in-95 max-w-3xl mx-auto">
            <div className="text-center space-y-1.5">
              <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-sm">
                <span className="material-symbols-outlined text-4xl">emoji_events</span>
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900 font-sans">Diagnostic Scorecard</h2>
              <p className="text-xs text-slate-500 font-mono">Completed at {scorecard.completedAt}</p>
            </div>

            <div className="grid grid-cols-3 gap-3 md:gap-4 text-center">
              <div className="p-4 rounded-3xl bg-blue-50 border border-blue-100">
                <span className="text-3xl font-extrabold text-blue-700 font-mono">{scorecard.scorePercentage}%</span>
                <span className="block text-[11px] font-bold text-slate-500 uppercase mt-1">Accuracy</span>
              </div>
              <div className="p-4 rounded-3xl bg-emerald-50 border border-emerald-100">
                <span className="text-3xl font-extrabold text-emerald-700 font-mono">
                  {scorecard.correctAnswers}/{scorecard.totalQuestions}
                </span>
                <span className="block text-[11px] font-bold text-slate-500 uppercase mt-1">Correct</span>
              </div>
              <div className="p-4 rounded-3xl bg-purple-50 border border-purple-100">
                <span className="text-3xl font-extrabold text-purple-700 font-mono">{formatTime(scorecard.timeSpentSeconds)}</span>
                <span className="block text-[11px] font-bold text-slate-500 uppercase mt-1">Time Spent</span>
              </div>
            </div>

            {/* Subject Accuracy Breakdown */}
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <h4 className="text-xs md:text-sm font-bold text-slate-800 uppercase tracking-wider font-mono">Subject Diagnostics</h4>
              {Object.entries(scorecard.subjectBreakdown).map(([subj, val]) => {
                const data = val as { correct: number; total: number };
                const pct = Math.round((data.correct / data.total) * 100);
                return (
                  <div key={subj} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-700">{subj}</span>
                      <span className="font-mono text-slate-500">{data.correct}/{data.total} ({pct}%)</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${pct >= 70 ? 'bg-emerald-500' : 'bg-amber-500'}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setActiveTest(null)}
                className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs md:text-sm font-bold rounded-2xl shadow-xs transition-colors cursor-pointer"
              >
                Back to Tests Dashboard
              </button>
            </div>
          </div>
        ) : (
          /* Live Test 2-Column Split: Question on Left (7-8 cols) + Question Palette on Right (4-5 cols) */
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
            {/* Question Area (7-8 cols on md/lg) */}
            <div className="md:col-span-7 lg:col-span-8 bg-white rounded-3xl p-5 md:p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-100 uppercase">
                  Question {currentQIndex + 1} of {totalQ}
                </span>
                <span className="text-xs font-mono text-slate-400 font-bold">{currentQ.subject}</span>
              </div>

              <p className="text-slate-900 text-sm md:text-base font-semibold leading-relaxed">
                {currentQ.question}
              </p>

              <div className="space-y-2.5 pt-2">
                {currentQ.options.map((opt, oIdx) => {
                  const isSelected = userSelected === oIdx;
                  return (
                    <button
                      key={oIdx}
                      onClick={() => handleSelectOption(oIdx)}
                      className={`w-full p-4 rounded-2xl border text-xs md:text-sm text-left transition-all flex items-center justify-between gap-3 cursor-pointer ${
                        isSelected
                          ? 'bg-blue-50 border-blue-600 text-blue-900 font-bold shadow-xs'
                          : 'bg-slate-50/70 border-slate-200 hover:border-blue-300 text-slate-700'
                      }`}
                    >
                      <span className="flex-1">{opt}</span>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${isSelected ? 'border-blue-600 bg-blue-600' : 'border-slate-300'}`}>
                        {isSelected && <span className="w-2 h-2 rounded-full bg-white" />}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <button
                  disabled={currentQIndex === 0}
                  onClick={() => setCurrentQIndex((i) => Math.max(0, i - 1))}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-700 rounded-xl text-xs font-bold transition-colors"
                >
                  ← Previous
                </button>
                <button
                  disabled={currentQIndex === totalQ - 1}
                  onClick={() => setCurrentQIndex((i) => Math.min(totalQ - 1, i + 1))}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
                >
                  Next Question →
                </button>
              </div>
            </div>

            {/* Question Palette Sidebar (4-5 cols on md/lg) */}
            <div className="md:col-span-5 lg:col-span-4 bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
                  Question Palette
                </h4>
                <span className="text-xs font-mono font-bold text-blue-600">
                  {answeredCount}/{totalQ} Answered
                </span>
              </div>

              <div className="grid grid-cols-5 gap-2">
                {activeTest.questions.map((q, idx) => {
                  const isCurrent = currentQIndex === idx;
                  const isAns = selectedAnswers[q.id] !== undefined;
                  return (
                    <button
                      key={q.id}
                      onClick={() => setCurrentQIndex(idx)}
                      className={`h-10 rounded-xl font-mono text-xs font-bold transition-all flex items-center justify-center cursor-pointer ${
                        isCurrent
                          ? 'ring-2 ring-blue-600 bg-blue-600 text-white shadow-xs'
                          : isAns
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-emerald-500" />
                  <span>Answered</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-slate-200" />
                  <span>Unanswered</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Filter tests by subject category
  const filteredTests =
    categoryFilter === 'All'
      ? MOCK_TESTS_DATA
      : MOCK_TESTS_DATA.filter((t) => t.subject.toLowerCase().includes(categoryFilter.toLowerCase()));

  return (
    <div className="w-full max-w-7xl mx-auto pb-24 md:pb-12 p-3 sm:p-4 md:p-6 lg:p-8 space-y-6 animate-in fade-in duration-200">
      {/* Top Aggregate KPI Cards (4 columns) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <div className="bg-white rounded-3xl p-4 md:p-5 border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Tests Completed</span>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="text-2xl md:text-3xl font-extrabold text-slate-900 font-mono">{totalAttempts + 6}</span>
            <span className="text-xs text-slate-400">Total</span>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-4 md:p-5 border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Average Score</span>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="text-2xl md:text-3xl font-extrabold text-blue-600 font-mono">{avgScore}%</span>
            <span className="text-xs text-emerald-600 font-semibold">+4% MoM</span>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-4 md:p-5 border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Prelims Rank Est.</span>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="text-2xl md:text-3xl font-extrabold text-indigo-600 font-mono">AIR 412</span>
            <span className="text-xs text-slate-400 font-mono">/ 24k</span>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-4 md:p-5 border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Weakest Area</span>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="text-lg md:text-xl font-bold text-rose-600 truncate">Economy</span>
            <span className="text-xs text-slate-400">58%</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex bg-slate-200/80 p-1 rounded-2xl gap-1 overflow-x-auto custom-scrollbar">
          {['All', 'Polity', 'Geography', 'Economy'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`py-2 px-4 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                categoryFilter === cat
                  ? 'bg-white text-blue-700 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <span className="text-xs text-slate-400 font-mono">{filteredTests.length} Tests Available</span>
      </div>

      {/* Test Cards Responsive Grid (3 columns on lg) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredTests.map((test) => (
          <div
            key={test.id}
            className="bg-white rounded-3xl p-5 md:p-6 border border-slate-200 shadow-xs hover:shadow-md hover:border-blue-400 transition-all flex flex-col justify-between space-y-4 group"
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-blue-700 uppercase bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-100 font-mono">
                  {test.subject}
                </span>
                <span className="text-xs font-mono font-semibold text-slate-400">
                  {test.durationMinutes} Mins • {test.questions.length * 2} Marks
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors font-sans">
                {test.title}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                Timed exam simulation with real-time accuracy diagnostics and detailed explanations.
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
                <span className="material-symbols-outlined text-[16px] text-slate-400">help</span>
                <span>{test.questions.length} Questions</span>
              </div>
              <button
                onClick={() => handleStartTest(test)}
                className="px-4 py-2 rounded-xl bg-slate-900 group-hover:bg-blue-600 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1 cursor-pointer"
              >
                <span>Start Test</span>
                <span className="material-symbols-outlined text-[14px]">play_arrow</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
