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
    <div className="flex flex-col w-full pb-24 p-3.5 sm:p-4 space-y-4 animate-in fade-in duration-200">
      {/* Progress Header */}
      <section className="rounded-2xl p-3.5 bg-white border border-slate-200 shadow-xs space-y-2">
        <div className="flex justify-between items-center text-xs">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-blue-700 uppercase tracking-wider text-[10px]">
              Question {currentStep + 1} of {totalQuestions}
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-600 font-medium">{currentQuestion.category}</span>
          </div>
          <span className="font-mono font-bold text-slate-700 text-xs">
            {progressPercent}%
          </span>
        </div>

        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-600 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </section>

      {/* Question Card */}
      <section className="rounded-2xl p-4 bg-white border border-slate-200 shadow-xs space-y-3">
        <h2 className="text-slate-900 text-base font-bold leading-snug">
          {currentQuestion.question}
        </h2>
        <p className="text-xs text-slate-500">
          Choose the response that best describes your approach to governance and decision-making.
        </p>

        {/* Options List */}
        <div className="space-y-2.5 pt-2" id="assessment-options">
          {currentQuestion.options.map((option) => {
            const isSelected = selectedOptionId === option.id;
            return (
              <button
                key={option.id}
                onClick={() => handleSelectOption(option.id)}
                className={`flex items-start gap-3 p-3.5 rounded-2xl text-left w-full transition-all active:scale-[0.985] border ${
                  isSelected
                    ? 'bg-blue-50/80 border-blue-600 text-slate-900 shadow-2xs font-semibold'
                    : 'bg-white text-slate-800 border-slate-200 hover:border-blue-300'
                }`}
              >
                <div
                  className={`w-9 h-9 shrink-0 rounded-xl flex items-center justify-center transition-colors shadow-2xs mt-0.5 ${
                    isSelected
                      ? 'bg-blue-600 text-white'
                      : 'bg-blue-50 text-blue-700'
                  }`}
                >
                  <span
                    className="material-symbols-outlined text-[20px]"
                    style={isSelected ? { fontVariationSettings: "'FILL' 1" } : {}}
                  >
                    {option.icon}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-xs ${isSelected ? 'font-bold text-blue-950' : 'font-semibold text-slate-800'}`}>
                    {option.title}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{option.description}</p>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Stepper Navigation */}
      <div className="flex items-center justify-between gap-3 pt-1">
        <button
          onClick={handlePrev}
          className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all flex items-center gap-1"
        >
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
          {currentStep === 0 ? 'Dashboard' : 'Previous'}
        </button>

        <button
          onClick={handleNext}
          className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs active:scale-95 transition-all flex items-center justify-center gap-1"
        >
          {currentStep === totalQuestions - 1 ? (
            <>
              <span className="material-symbols-outlined text-[16px]">psychology</span>
              Calculate Archetype
            </>
          ) : (
            <>
              Next Question
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
