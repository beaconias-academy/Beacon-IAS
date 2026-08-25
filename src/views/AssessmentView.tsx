import React, { useState } from 'react';
import { ScreenId, ArchetypeResult } from '../types';
import { ASSESSMENT_QUESTIONS, ARCHETYPES_DATABASE } from '../data/mockData';
import { useToast } from '../components/Toast';

interface AssessmentViewProps {
  onNavigate: (screen: ScreenId) => void;
  onSaveArchetype: (result: ArchetypeResult) => void;
}

export const AssessmentView: React.FC<AssessmentViewProps> = ({
  onNavigate,
  onSaveArchetype,
}) => {
  const { showToast } = useToast();
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [answers, setAnswers] = useState<{ [questionId: number]: string }>({
    1: 'public-service',
  });

  const totalQuestions = ASSESSMENT_QUESTIONS.length;
  const currentQuestion = ASSESSMENT_QUESTIONS[currentStep];
  const selectedOptionId = answers[currentQuestion.id] || currentQuestion.options[0].id;

  const handleSelectOption = (optionId: string) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: optionId,
    }));
  };

  const handleNext = () => {
    if (currentStep < totalQuestions - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      // Calculate archetype based on all selected options
      const traitScores = { strategic: 0, action: 0, analytical: 0, diplomatic: 0 };

      ASSESSMENT_QUESTIONS.forEach((q) => {
        const chosenId = answers[q.id] || q.options[0].id;
        const opt = q.options.find((o) => o.id === chosenId);
        if (opt && opt.traits) {
          if (opt.traits.strategic) traitScores.strategic += opt.traits.strategic;
          if (opt.traits.action) traitScores.action += opt.traits.action;
          if (opt.traits.analytical) traitScores.analytical += opt.traits.analytical;
          if (opt.traits.diplomatic) traitScores.diplomatic += opt.traits.diplomatic;
        }
      });

      // Determine top trait
      let topTrait: keyof typeof traitScores = 'strategic';
      let maxScore = traitScores.strategic;

      (Object.keys(traitScores) as (keyof typeof traitScores)[]).forEach((trait) => {
        if (traitScores[trait] > maxScore) {
          maxScore = traitScores[trait];
          topTrait = trait;
        }
      });

      const matchedArchetype = ARCHETYPES_DATABASE[topTrait] || ARCHETYPES_DATABASE.strategic;
      onSaveArchetype(matchedArchetype);
      showToast(`Archetype Calculated: ${matchedArchetype.title}!`, 'success', 'verified');
      onNavigate('archetype-result');
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    } else {
      onNavigate('home');
    }
  };

  const progressPercent = Math.round(((currentStep + 1) / totalQuestions) * 100);

  return (
    <div className="w-full max-w-4xl mx-auto pb-24 md:pb-12 p-3 sm:p-4 md:p-6 lg:p-8 space-y-6 animate-in fade-in duration-200">
      {/* Progress Header */}
      <section className="rounded-3xl p-5 md:p-6 bg-white border border-slate-200 shadow-sm space-y-3">
        <div className="flex justify-between items-center text-xs md:text-sm">
          <div className="flex items-center gap-2">
            <span className="font-bold text-blue-700 uppercase tracking-wider text-xs font-mono">
              Question {currentStep + 1} of {totalQuestions}
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-600 font-semibold">{currentQuestion.category}</span>
          </div>
          <span className="font-mono font-bold text-slate-700 text-xs md:text-sm">
            {progressPercent}% Completed
          </span>
        </div>

        <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-600 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </section>

      {/* Question Card */}
      <section className="rounded-3xl p-6 md:p-8 bg-white border border-slate-200 shadow-sm space-y-6">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 font-mono">
            BEACON 5-FACTOR PSYCHOMETRIC ENGINE
          </span>
          <h2 className="text-lg md:text-2xl font-bold text-slate-900 mt-2 leading-snug font-sans">
            {currentQuestion.question}
          </h2>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            Choose the approach that most accurately reflects your natural instincts in administrative scenarios.
          </p>
        </div>

        {/* Options List Grid (1 col on mobile, 2 cols on tablet/laptop if short, or full-width) */}
        <div className="space-y-3">
          {currentQuestion.options.map((option) => {
            const isSelected = selectedOptionId === option.id;

            return (
              <button
                key={option.id}
                onClick={() => handleSelectOption(option.id)}
                className={`w-full p-5 rounded-2xl md:rounded-3xl border text-left transition-all flex items-start gap-4 cursor-pointer ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50/80 shadow-xs'
                    : 'border-slate-200 bg-slate-50/60 hover:bg-slate-100 hover:border-slate-300'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mt-0.5 shrink-0 transition-all ${
                    isSelected
                      ? 'border-blue-600 bg-blue-600 text-white'
                      : 'border-slate-300 bg-white'
                  }`}
                >
                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-white" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <span className={`text-xs md:text-sm leading-relaxed block ${isSelected ? 'font-bold text-blue-950' : 'font-bold text-slate-900'}`}>
                    {option.title}
                  </span>
                  <span className="text-xs text-slate-500 mt-0.5 block leading-relaxed">
                    {option.description}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer Navigation */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100 gap-3">
          <button
            onClick={handlePrev}
            className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs md:text-sm font-bold transition-all cursor-pointer"
          >
            ← {currentStep === 0 ? 'Back to Home' : 'Previous'}
          </button>

          <button
            onClick={handleNext}
            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs md:text-sm font-bold shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <span>{currentStep === totalQuestions - 1 ? 'Calculate My Archetype' : 'Next Question'}</span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
        </div>
      </section>
    </div>
  );
};
