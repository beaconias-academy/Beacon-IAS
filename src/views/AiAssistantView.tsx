import React, { useState, useRef, useEffect } from 'react';
import { useToast } from '../components/Toast';
import { ASSETS } from '../data/mockData';

interface InteractiveQuiz {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  articleRef?: string;
}

interface Flashcard {
  front: string;
  back: string;
  category: string;
}

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  quiz?: InteractiveQuiz;
  flashcards?: Flashcard[];
  mainsReview?: {
    score: number;
    maxScore: number;
    breakdown: { label: string; score: string }[];
    improvements: string[];
    modelAnswer: string;
  };
  keyArticles?: { article: string; summary: string }[];
}

export const AiAssistantView: React.FC = () => {
  const { showToast } = useToast();

  // Assistant Mode & Persona
  const [selectedPersona, setSelectedPersona] = useState<'gs-fast' | 'mains-review' | 'quiz-flashcards'>('gs-fast');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isVoiceRecording, setIsVoiceRecording] = useState<boolean>(false);
  const [voiceSeconds, setVoiceSeconds] = useState<number>(0);
  const [showAttachmentSheet, setShowAttachmentSheet] = useState<boolean>(false);

  // In-message interactive states
  const [quizUserAnswers, setQuizUserAnswers] = useState<{ [msgId: string]: number }>({});
  const [flashcardIndices, setFlashcardIndices] = useState<{ [msgId: string]: number }>({});
  const [flashcardFlipped, setFlashcardFlipped] = useState<{ [msgId: string]: boolean }>({});

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'ai',
      text: "Namaste Abhinav! I'm **Beacon AI**, your civil services mentor.\n\nI am continuously synced with the UPSC Civil Services and KPSC syllabus, landmark Supreme Court constitutional doctrines, and real-time economic indicators.\n\nHow can I accelerate your preparation right now?",
      timestamp: '10:14 AM',
      keyArticles: [
        { article: 'Article 32', summary: 'Right to Constitutional Remedies (Basic Structure)' },
        { article: 'Article 280', summary: 'Mandatory Finance Commission Constitution' },
      ],
    },
    {
      id: '2',
      sender: 'user',
      text: "Can you explain the key differences between National Emergency (Art. 352) and President's Rule (Art. 356)?",
      timestamp: '10:15 AM',
    },
    {
      id: '3',
      sender: 'ai',
      text: "### 🏛️ Emergency Provisions Comparison (GS Paper 2)\n\nHere is the high-yield comparative breakdown required for Prelims and Mains:\n\n1. **Grounds for Proclamation**:\n   • **National Emergency (Art. 352)**: War, External Aggression, or Armed Rebellion (44th Amendment substituted 'internal disturbance').\n   • **President's Rule (Art. 356)**: Failure of constitutional machinery in a state (Art. 356) or failure to comply with Union directives (Art. 365).\n\n2. **Parliamentary Approval & Majority**:\n   • **Art. 352**: Special Majority of both Houses within **1 month**.\n   • **Art. 356**: Simple Majority within **2 months**.\n\n3. **Impact on Fundamental Rights**:\n   • **Art. 352**: Article 19 automatically suspended under Art. 358 during war/external aggression. Articles 20 & 21 can never be suspended.\n   • **Art. 356**: Fundamental Rights remain completely intact and unaffected.\n\n4. **Legislative Assembly Status**:\n   • **Art. 352**: State Assembly continues, but Parliament can legislate on State List subjects.\n   • **Art. 356**: State Assembly is either suspended or dissolved by presidential proclamation.",
      timestamp: '10:15 AM',
      quiz: {
        question: 'Under which constitutional amendment was "Internal Disturbance" replaced by "Armed Rebellion" in Article 352?',
        options: ['42nd Amendment Act (1976)', '44th Amendment Act (1978)', '52nd Amendment Act (1985)', '86th Amendment Act (2002)'],
        correctIndex: 1,
        articleRef: 'Article 352(1) & 44th CAA 1978',
        explanation: 'The 44th Constitutional Amendment Act, 1978 introduced the safeguard of "armed rebellion" to prevent arbitrary imposition of internal emergency.',
      },
    },
  ]);

  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Voice recording timer simulation
  useEffect(() => {
    let interval: any;
    if (isVoiceRecording) {
      interval = setInterval(() => setVoiceSeconds((s) => s + 1), 1000);
    } else {
      setVoiceSeconds(0);
    }
    return () => clearInterval(interval);
  }, [isVoiceRecording]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const formatVoiceTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const starterChips = [
    { label: '🏛️ Basic Structure Doctrine', prompt: 'Explain the Kesavananda Bharati verdict and 7 Basic Structure components.' },
    { label: '📈 RBI Monetary Policy', prompt: 'How does the RBI MPC utilize Repo Rate and SDF to manage inflation?' },
    { label: '✍️ Review my Mains Answer', prompt: 'Evaluate a 250-word answer on Cooperative Federalism with scoring.' },
    { label: '📇 Flashcard Drill: Articles', prompt: 'Generate interactive flashcards on Fundamental Duties (Art. 51A).' },
  ];

  const handleSendMessage = (textToSend?: string) => {
    const query = textToSend || inputVal;
    if (!query.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputVal('');
    setIsTyping(true);

    setTimeout(() => {
      let aiReply: Message;
      const lower = query.toLowerCase();

      if (lower.includes('mains') || lower.includes('answer') || lower.includes('review')) {
        aiReply = {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: "### 📝 Beacon AI Mains Answer Evaluation\n\nI have evaluated the submission based on official UPSC evaluation parameters:\n\n• **Introduction**: Clear definition and constitutional backing.\n• **Body Arguments**: Well-structured points on fiscal relations.\n• **Way Forward**: Recommended Sarkaria & Punchhi commission references.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          mainsReview: {
            score: 11.5,
            maxScore: 15,
            breakdown: [
              { label: 'Conceptual Clarity', score: '4.0 / 5' },
              { label: 'Constitutional Articles', score: '3.5 / 5' },
              { label: 'Conclusion & Way Forward', score: '4.0 / 5' },
            ],
            improvements: [
              'Add recent 16th Finance Commission Terms of Reference (ToR).',
              'Include a small flowchart diagram for GST Council voting weightage (1/3rd Centre, 2/3rd States).',
            ],
            modelAnswer: 'A robust conclusion must emphasize that competitive federalism should transform into collaborative and trust-based federalism for achieving the $5T economy vision.',
          },
        };
      } else if (lower.includes('flashcard') || lower.includes('card') || lower.includes('51a')) {
        aiReply = {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: "Here is your high-yield **3D Flashcard Deck on Fundamental Duties (Article 51A)**. Tap to flip each card!",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          flashcards: [
            {
              front: 'Which committee recommended the inclusion of Fundamental Duties?',
              back: 'Swaran Singh Committee (1976) recommended 8 duties; 42nd CAA added 10 duties.',
              category: 'Polity & Constitution',
            },
            {
              front: 'Which amendment added the 11th Fundamental Duty (Education for children 6-14 yrs)?',
              back: '86th Constitutional Amendment Act, 2002 (Article 51A(k)).',
              category: 'Polity & Constitution',
            },
            {
              front: 'Are Fundamental Duties legally enforceable in courts of law?',
              back: 'No, they are non-justiciable. However, Parliament can enforce them by suitable legislation (e.g. Prevention of Insults to National Honour Act).',
              category: 'Polity & Constitution',
            },
          ],
        };
      } else {
        aiReply = {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: `### 🏛️ High-Yield Study Notes: ${query}\n\n• **Core Concept**: Directly relevant to GS Paper 2 & GS Paper 3 syllabus.\n• **Supreme Court Doctrines**: Kesavananda Bharati (1973), Minerva Mills (1980), and S.R. Bommai (1994).\n• **Key Takeaway for Prelims**: Focus on constitutional amendments and statutory bodies.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          keyArticles: [
            { article: 'Article 14-18', summary: 'Right to Equality & Affirmative Action' },
            { article: 'Article 21', summary: 'Right to Life and Personal Liberty' },
          ],
        };
      }

      setMessages((prev) => [...prev, aiReply]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <div className="flex flex-col w-full h-[calc(100vh-8rem)] sm:h-[800px] bg-slate-50 relative overflow-hidden animate-in fade-in duration-200">
      {/* Persona Mode Switcher Bar */}
      <div className="px-3.5 py-2 bg-white border-b border-slate-200/90 flex items-center justify-between gap-2 shrink-0 z-10 shadow-2xs">
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl flex-1">
          {[
            { id: 'gs-fast' as const, label: 'GS-Fast', icon: 'bolt' },
            { id: 'mains-review' as const, label: 'Mains Evaluator', icon: 'rate_review' },
            { id: 'quiz-flashcards' as const, label: 'Flashcards', icon: 'style' },
          ].map((p) => (
            <button
              key={p.id}
              onClick={() => {
                setSelectedPersona(p.id);
                showToast(`Switched persona to ${p.label}`, 'info');
              }}
              className={`flex-1 py-1.5 px-2 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1 transition-all ${
                selectedPersona === p.id
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <span className="material-symbols-outlined text-[15px]">{p.icon}</span>
              <span className="truncate">{p.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Suggested Prompt Chips */}
      <div className="px-3.5 py-1.5 bg-slate-100/70 border-b border-slate-200/60 flex gap-1.5 overflow-x-auto no-scrollbar shrink-0">
        {starterChips.map((chip, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(chip.prompt)}
            className="px-2.5 py-1 rounded-lg bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-700 text-[10px] font-semibold border border-slate-200 shadow-2xs shrink-0 transition-colors"
          >
            {chip.label}
          </button>
        ))}
      </div>

      {/* Chat Messages Stream */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-3.5 custom-scrollbar">
        {messages.map((msg) => {
          const isAi = msg.sender === 'ai';

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isAi ? 'items-start' : 'items-end'} space-y-1.5`}
            >
              <div className={`flex items-end gap-2 max-w-[92%] ${isAi ? 'flex-row' : 'flex-row-reverse'}`}>
                {isAi && (
                  <img
                    src={ASSETS.beaconAiAvatar}
                    alt="Beacon AI"
                    className="w-8 h-8 rounded-xl object-contain ring-2 ring-blue-500/20 shadow-xs shrink-0 mb-0.5"
                  />
                )}

                <div
                  className={`p-3.5 rounded-2xl text-xs leading-relaxed shadow-xs ${
                    isAi
                      ? 'bg-white text-slate-800 border border-slate-200/90 rounded-bl-xs'
                      : 'bg-blue-600 text-white rounded-br-xs font-medium'
                  }`}
                >
                  <div className="whitespace-pre-line prose-xs">{msg.text}</div>

                  {/* Interactive MCQ Quiz inside message */}
                  {msg.quiz && (
                    <div className="mt-3 p-3 bg-blue-50/80 rounded-xl border border-blue-200 space-y-2">
                      <div className="flex items-center justify-between text-[10px] font-bold text-blue-800 uppercase tracking-wider">
                        <span>Interactive Quiz Drill</span>
                        <span>{msg.quiz.articleRef}</span>
                      </div>
                      <p className="font-bold text-slate-900 text-xs">{msg.quiz.question}</p>

                      <div className="space-y-1.5 pt-1">
                        {msg.quiz.options.map((opt, oIdx) => {
                          const userPicked = quizUserAnswers[msg.id] === oIdx;
                          const isCorrect = oIdx === msg.quiz!.correctIndex;
                          const hasAnswered = quizUserAnswers[msg.id] !== undefined;

                          return (
                            <button
                              key={oIdx}
                              disabled={hasAnswered}
                              onClick={() => {
                                setQuizUserAnswers((prev) => ({ ...prev, [msg.id]: oIdx }));
                                showToast(
                                  isCorrect ? 'Correct! +5 Accuracy Points' : 'Incorrect. Check the explanation.',
                                  isCorrect ? 'success' : 'warning'
                                );
                              }}
                              className={`w-full text-left p-2 rounded-lg text-xs flex items-center justify-between border transition-all ${
                                hasAnswered
                                  ? isCorrect
                                    ? 'bg-emerald-100 border-emerald-400 text-emerald-900 font-bold'
                                    : userPicked
                                    ? 'bg-rose-100 border-rose-400 text-rose-900'
                                    : 'bg-white/60 border-slate-200 text-slate-500'
                                  : 'bg-white border-slate-200 hover:border-blue-400 text-slate-800'
                              }`}
                            >
                              <span>{opt}</span>
                              {hasAnswered && isCorrect && (
                                <span className="material-symbols-outlined text-emerald-600 text-base">check_circle</span>
                              )}
                            </button>
                          );
                        })}
                      </div>

                      {quizUserAnswers[msg.id] !== undefined && (
                        <p className="text-[11px] text-slate-700 bg-white p-2 rounded-lg border border-blue-100 mt-2">
                          <strong>Explanation:</strong> {msg.quiz.explanation}
                        </p>
                      )}
                    </div>
                  )}

                  {/* 3D Flip Flashcards inside message */}
                  {msg.flashcards && (
                    <div className="mt-3 space-y-2">
                      {(() => {
                        const curCardIdx = flashcardIndices[msg.id] || 0;
                        const isFlipped = !!flashcardFlipped[msg.id];
                        const card = msg.flashcards[curCardIdx];

                        return (
                          <div className="space-y-2">
                            <div
                              onClick={() =>
                                setFlashcardFlipped((prev) => ({ ...prev, [msg.id]: !prev[msg.id] }))
                              }
                              className="w-full h-36 rounded-2xl bg-gradient-to-br from-indigo-900 to-slate-900 text-white p-4 flex flex-col justify-between shadow-md cursor-pointer select-none transition-all active:scale-98 relative"
                            >
                              <div className="flex justify-between text-[10px] font-mono text-amber-300">
                                <span>{card.category}</span>
                                <span>Tap to Flip ↻</span>
                              </div>
                              <p className="text-xs font-semibold text-center my-auto leading-relaxed text-blue-50">
                                {isFlipped ? card.back : card.front}
                              </p>
                              <div className="text-[9px] text-slate-400 text-center font-mono">
                                Card {curCardIdx + 1} of {msg.flashcards.length}
                              </div>
                            </div>

                            <div className="flex justify-between items-center text-xs">
                              <button
                                disabled={curCardIdx === 0}
                                onClick={() => {
                                  setFlashcardIndices((prev) => ({
                                    ...prev,
                                    [msg.id]: Math.max(0, curCardIdx - 1),
                                  }));
                                  setFlashcardFlipped((prev) => ({ ...prev, [msg.id]: false }));
                                }}
                                className="px-2.5 py-1 bg-slate-100 rounded-lg disabled:opacity-40 font-bold"
                              >
                                ← Prev
                              </button>
                              <button
                                disabled={curCardIdx === msg.flashcards.length - 1}
                                onClick={() => {
                                  setFlashcardIndices((prev) => ({
                                    ...prev,
                                    [msg.id]: Math.min(msg.flashcards!.length - 1, curCardIdx + 1),
                                  }));
                                  setFlashcardFlipped((prev) => ({ ...prev, [msg.id]: false }));
                                }}
                                className="px-2.5 py-1 bg-slate-100 rounded-lg disabled:opacity-40 font-bold"
                              >
                                Next →
                              </button>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  )}

                  {/* Mains Evaluation Breakdown */}
                  {msg.mainsReview && (
                    <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-slate-900">Evaluator Scorecard</span>
                        <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-bold text-xs">
                          {msg.mainsReview.score} / {msg.mainsReview.maxScore}
                        </span>
                      </div>

                      <div className="space-y-1">
                        {msg.mainsReview.breakdown.map((b, bIdx) => (
                          <div key={bIdx} className="flex justify-between text-[11px] text-slate-600">
                            <span>{b.label}</span>
                            <span className="font-mono font-bold text-slate-800">{b.score}</span>
                          </div>
                        ))}
                      </div>

                      <div className="border-t border-slate-200 pt-2 space-y-1">
                        <p className="text-[11px] font-bold text-slate-800">Priority Improvements:</p>
                        <ul className="list-disc list-inside text-[11px] text-slate-600 space-y-0.5">
                          {msg.mainsReview.improvements.map((imp, iIdx) => (
                            <li key={iIdx}>{imp}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <span className="text-[9px] text-slate-400 font-mono px-1">{msg.timestamp}</span>
            </div>
          );
        })}

        {isTyping && (
          <div className="flex items-center gap-2 text-xs text-slate-500 bg-white p-2.5 px-3.5 rounded-2xl border border-slate-200 w-max shadow-xs">
            <img
              src={ASSETS.beaconAiAvatar}
              alt="Beacon AI"
              className="w-5 h-5 object-contain animate-spin"
            />
            <span className="font-semibold text-slate-700">Beacon AI is analyzing civil services knowledge base...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Bottom Message Input Bar */}
      <div className="p-3 bg-white border-t border-slate-200/90 space-y-2 shrink-0">
        {/* Voice recording live bar */}
        {isVoiceRecording ? (
          <div className="flex items-center justify-between bg-rose-50 border border-rose-200 p-2.5 rounded-2xl animate-pulse">
            <div className="flex items-center gap-2 text-rose-700 font-bold text-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-ping" />
              <span>Recording Voice Question ({formatVoiceTime(voiceSeconds)})</span>
            </div>
            <button
              onClick={() => {
                setIsVoiceRecording(false);
                handleSendMessage("Can you summarize the 73rd Constitutional Amendment Act on Panchayati Raj?");
              }}
              className="px-3 py-1 bg-rose-600 text-white rounded-xl text-xs font-bold shadow-xs"
            >
              Stop &amp; Transcribe
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsVoiceRecording(true)}
              className="w-10 h-10 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center shrink-0 active:scale-95 transition-all"
              title="Voice Query"
            >
              <span className="material-symbols-outlined text-[20px]">mic</span>
            </button>

            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSendMessage();
              }}
              placeholder="Ask Beacon AI about polity, current affairs, mains..."
              className="flex-1 bg-slate-100 px-3.5 py-2.5 rounded-2xl text-xs font-semibold text-slate-900 placeholder-slate-400 outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 border border-transparent transition-all"
            />

            <button
              onClick={() => handleSendMessage()}
              disabled={!inputVal.trim()}
              className="w-10 h-10 rounded-2xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white flex items-center justify-center shrink-0 active:scale-95 transition-all shadow-xs"
              title="Send"
            >
              <span className="material-symbols-outlined text-[20px]">send</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
