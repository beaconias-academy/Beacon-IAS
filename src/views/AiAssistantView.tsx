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
  const [selectedSubject, setSelectedSubject] = useState<string>('GS Paper 2 - Polity & Governance');
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
      text: "Namaste Abhinav! I'm **Beacon AI**, your dedicated civil services mentor.\n\nI am continuously synced with the UPSC Civil Services & KPSC syllabus, landmark Supreme Court constitutional doctrines, and real-time economic indicators.\n\nHow can I accelerate your preparation right now?",
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
    { label: '🌍 Indus Waters Treaty', prompt: 'Analyze the dispute resolution mechanism under the Indus Waters Treaty 1960.' },
    { label: '⚖️ Ethics Case Study', prompt: 'Provide a framework to solve GS4 Ethical Dilemmas involving whistleblower protection.' },
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

      if (lower.includes('mains') || lower.includes('answer') || lower.includes('review') || selectedPersona === 'mains-review') {
        aiReply = {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: "### 📝 Beacon AI Mains Answer Evaluation\n\nI have evaluated your draft based on official UPSC Mains grading standards:\n\n• **Introduction**: Solid constitutional contextualization (Articles 245-293 cited).\n• **Body Arguments**: Good points on fiscal federalism, but needs quantitative data from 15th & 16th Finance Commissions.\n• **Way Forward**: Recommended Sarkaria & Punchhi commission references.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          mainsReview: {
            score: 11.5,
            maxScore: 15,
            breakdown: [
              { label: 'Conceptual Clarity & Context', score: '4.0 / 5' },
              { label: 'Constitutional Articles & Facts', score: '3.5 / 5' },
              { label: 'Conclusion & Way Forward', score: '4.0 / 5' },
            ],
            improvements: [
              'Add recent 16th Finance Commission Terms of Reference (ToR).',
              'Include a small flowchart diagram for GST Council voting weightage (1/3rd Centre, 2/3rd States).',
            ],
            modelAnswer: 'A robust conclusion must emphasize that competitive federalism should transform into collaborative and trust-based federalism for achieving the $5T economy vision.',
          },
        };
      } else if (lower.includes('flashcard') || lower.includes('card') || lower.includes('51a') || selectedPersona === 'quiz-flashcards') {
        aiReply = {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: "Here is your high-yield **Interactive Flashcard Deck on Fundamental Duties (Article 51A)**. Tap to flip each card!",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          flashcards: [
            {
              front: 'Which committee recommended the inclusion of Fundamental Duties in the Constitution?',
              back: 'Swaran Singh Committee (1976) recommended 8 duties; the 42nd Amendment Act added 10 duties.',
              category: 'Polity & Constitution',
            },
            {
              front: 'Which amendment added the 11th Fundamental Duty (Education for children 6-14 yrs)?',
              back: '86th Constitutional Amendment Act, 2002 (Article 51A(k)).',
              category: 'Polity & Constitution',
            },
            {
              front: 'Are Fundamental Duties legally enforceable in courts of law?',
              back: 'No, they are non-justiciable. However, Parliament can enforce them by suitable legislation (e.g., Prevention of Insults to National Honour Act).',
              category: 'Polity & Constitution',
            },
          ],
        };
      } else {
        aiReply = {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: `### 🏛️ High-Yield Study Synthesis: ${query}\n\n• **Core Syllabus Relevance**: Directly mapped to ${selectedSubject}.\n• **Key Supreme Court Doctrines**: Kesavananda Bharati (1973), Minerva Mills (1980), and S.R. Bommai (1994).\n• **Prelims High-Yield Trap**: Be careful with exceptions to Union List jurisdiction under Article 249 (National Interest) and Article 252 (State Request).`,
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
    <div className="w-full max-w-7xl mx-auto h-[calc(100vh-5.5rem)] min-h-[500px] pb-20 md:pb-4 p-2 sm:p-3 md:p-4 lg:p-6 animate-in fade-in duration-200">
      {/* 2-Column Responsive Layout on Tablet & Desktop/Laptop */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 md:gap-4 lg:gap-6 h-full items-stretch">
        {/* Left Column (4 cols on md/lg): AI Controls, Syllabus Selector, Quick Prompts */}
        <aside className="hidden md:flex md:col-span-4 lg:col-span-4 flex-col bg-white rounded-3xl p-4 lg:p-5 border border-slate-200 shadow-sm space-y-4 lg:space-y-5 overflow-y-auto custom-scrollbar">
          {/* Persona Card */}
          <div className="space-y-2">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 font-mono">
              AI Persona Mode
            </h3>
            <div className="space-y-2">
              {[
                { id: 'gs-fast' as const, label: 'GS Prelims & Mains Fast-Track', icon: 'bolt', desc: 'Instant constitutional articles, economic formulas, and map facts.' },
                { id: 'mains-review' as const, label: 'Mains Answer Evaluator', icon: 'rate_review', desc: 'Rubric-based 15-mark scoring and model conclusion generator.' },
                { id: 'quiz-flashcards' as const, label: 'Flashcards & Sectional Quiz', icon: 'style', desc: 'Active recall drills and 3D flip card memory reinforcement.' },
              ].map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    setSelectedPersona(p.id);
                    showToast(`Switched to ${p.label}`, 'info');
                  }}
                  className={`w-full p-3 rounded-2xl border text-left transition-all ${
                    selectedPersona === p.id
                      ? 'bg-blue-50/90 border-blue-500 shadow-xs'
                      : 'bg-slate-50/60 border-slate-200 hover:border-blue-300'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`material-symbols-outlined text-[18px] ${selectedPersona === p.id ? 'text-blue-600' : 'text-slate-500'}`}>
                      {p.icon}
                    </span>
                    <span className={`text-xs font-bold ${selectedPersona === p.id ? 'text-blue-900' : 'text-slate-800'}`}>
                      {p.label}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-snug">{p.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Subject Context Selector */}
          <div className="space-y-2">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 font-mono">
              Syllabus Module Context
            </h3>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs font-semibold rounded-xl p-2.5 outline-none focus:border-blue-600"
            >
              <option>GS Paper 1 - History, Geography & Society</option>
              <option>GS Paper 2 - Polity & Governance</option>
              <option>GS Paper 3 - Economy, Environment & Security</option>
              <option>GS Paper 4 - Ethics, Integrity & Aptitude</option>
              <option>Essay - Philosophical & Current Affairs</option>
            </select>
          </div>

          {/* High-Yield Prompts */}
          <div className="space-y-2 flex-1">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 font-mono">
              Recommended Prompts
            </h3>
            <div className="space-y-1.5">
              {starterChips.map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(chip.prompt)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 text-xs font-semibold text-left border border-slate-200 transition-all flex items-center justify-between"
                >
                  <span className="truncate">{chip.label}</span>
                  <span className="material-symbols-outlined text-[15px] text-slate-400">arrow_forward</span>
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Right Column (8 cols on md/lg): Interactive Chat Canvas */}
        <div className="md:col-span-8 lg:col-span-8 flex flex-col h-full bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden relative">
          {/* Top Persona Bar */}
          <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-2 shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center p-1.5 shadow-xs">
                <img src="/beacon-ai.svg" alt="Beacon AI" className="w-full h-full object-contain brightness-200" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xs md:text-sm font-bold text-slate-900">Beacon AI Civil Services Mentor</h2>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                </div>
                <span className="text-[10px] text-slate-400 font-mono">UPSC CSE 2026 High-Yield Engine</span>
              </div>
            </div>

            {/* Mobile Persona Tabs (Hidden on md/lg where sidebar is present) */}
            <div className="md:hidden flex bg-slate-200/80 p-0.5 rounded-xl gap-1">
              {[
                { id: 'gs-fast' as const, label: 'GS-Fast' },
                { id: 'mains-review' as const, label: 'Mains' },
                { id: 'quiz-flashcards' as const, label: 'Cards' },
              ].map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedPersona(p.id)}
                  className={`px-2 py-1 rounded-lg text-[10px] font-bold ${
                    selectedPersona === p.id ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Chat Messages Stream */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 custom-scrollbar">
            {messages.map((msg) => {
              const isAi = msg.sender === 'ai';

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isAi ? 'items-start' : 'items-end'} space-y-1.5`}
                >
                  <div className={`flex items-end gap-2.5 max-w-[95%] md:max-w-[85%] ${isAi ? 'flex-row' : 'flex-row-reverse'}`}>
                    {isAi && (
                      <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center p-1.5 text-white shadow-xs shrink-0">
                        <img src="/beacon-ai.svg" alt="AI" className="w-full h-full object-contain brightness-200" />
                      </div>
                    )}

                    <div
                      className={`p-4 md:p-5 rounded-3xl text-xs md:text-sm leading-relaxed ${
                        isAi
                          ? 'bg-slate-100/80 text-slate-900 border border-slate-200/80 shadow-2xs rounded-bl-xs'
                          : 'bg-blue-600 text-white rounded-br-xs shadow-md'
                      }`}
                    >
                      <div className="whitespace-pre-line font-sans">{msg.text}</div>

                      {/* Key Articles Pill List */}
                      {msg.keyArticles && (
                        <div className="mt-3 pt-3 border-t border-slate-200/80 space-y-1.5">
                          <span className="text-[10px] font-extrabold uppercase text-slate-500 font-mono block">
                            Key Constitutional References:
                          </span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {msg.keyArticles.map((art, idx) => (
                              <div key={idx} className="p-2 bg-white rounded-xl border border-slate-200 text-[11px]">
                                <strong className="text-blue-700 block font-mono">{art.article}</strong>
                                <span className="text-slate-600">{art.summary}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Interactive Sectional Quiz */}
                      {msg.quiz && (
                        <div className="mt-3.5 p-4 rounded-2xl bg-white border border-slate-200 space-y-2.5 shadow-xs">
                          <span className="text-[10px] font-bold text-blue-700 uppercase bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                            Quick Quiz Drill
                          </span>
                          <p className="font-bold text-slate-900 text-xs md:text-sm">{msg.quiz.question}</p>
                          <div className="space-y-1.5">
                            {msg.quiz.options.map((opt, idx) => {
                              const answered = quizUserAnswers[msg.id] !== undefined;
                              const isSelected = quizUserAnswers[msg.id] === idx;
                              const isCorrect = idx === msg.quiz?.correctIndex;

                              let btnStyle = 'bg-slate-50 border-slate-200 hover:border-blue-400 text-slate-800';
                              if (answered) {
                                if (isCorrect) btnStyle = 'bg-emerald-50 border-emerald-500 text-emerald-800 font-bold';
                                else if (isSelected) btnStyle = 'bg-rose-50 border-rose-400 text-rose-800';
                              }

                              return (
                                <button
                                  key={idx}
                                  disabled={answered}
                                  onClick={() => {
                                    setQuizUserAnswers((prev) => ({ ...prev, [msg.id]: idx }));
                                    showToast(idx === msg.quiz?.correctIndex ? 'Correct Answer! (+10 XP)' : 'Incorrect! See explanation below.', idx === msg.quiz?.correctIndex ? 'success' : 'warning');
                                  }}
                                  className={`w-full text-left p-2.5 rounded-xl border text-xs transition-all flex items-center justify-between ${btnStyle}`}
                                >
                                  <span>{opt}</span>
                                  {answered && isCorrect && (
                                    <span className="material-symbols-outlined text-[16px] text-emerald-600">check_circle</span>
                                  )}
                                </button>
                              );
                            })}
                          </div>
                          {quizUserAnswers[msg.id] !== undefined && (
                            <div className="p-2.5 bg-blue-50/70 rounded-xl text-[11px] text-blue-900 border border-blue-100">
                              <strong>Explanation:</strong> {msg.quiz.explanation}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Interactive 3D Flip Flashcards */}
                      {msg.flashcards && (
                        <div className="mt-3.5 space-y-2">
                          {(() => {
                            const curIdx = flashcardIndices[msg.id] || 0;
                            const isFlipped = flashcardFlipped[msg.id] || false;
                            const curCard = msg.flashcards[curIdx];

                            return (
                              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
                                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                                  <span className="font-bold text-blue-700 uppercase bg-blue-50 px-2 py-0.5 rounded">
                                    Card {curIdx + 1} of {msg.flashcards.length}
                                  </span>
                                  <span>Tap card to flip</span>
                                </div>

                                {/* 3D Flip Flashcard */}
                                <div className="perspective-1000 w-full select-none my-1">
                                  <div
                                    onClick={() => setFlashcardFlipped((prev) => ({ ...prev, [msg.id]: !isFlipped }))}
                                    className={`min-h-[120px] relative preserve-3d transition-transform duration-500 ease-out cursor-pointer card-3d-lift ${
                                      isFlipped ? 'rotate-y-180' : ''
                                    }`}
                                  >
                                    {/* Front Side */}
                                    <div className="w-full h-full min-h-[120px] p-5 rounded-2xl bg-gradient-to-br from-blue-50 via-white to-indigo-50 border border-blue-200 shadow-3d-sm backface-hidden absolute inset-0 flex flex-col justify-center items-center text-center">
                                      <span className="text-[10px] uppercase font-bold text-blue-600 tracking-wider mb-1 font-mono flex items-center gap-1">
                                        <span className="material-symbols-outlined text-[13px]">help</span>
                                        Question / Concept (Tap to Flip ↻)
                                      </span>
                                      <p className="text-xs md:text-sm font-bold text-slate-900 leading-snug">
                                        {curCard.front}
                                      </p>
                                    </div>

                                    {/* Back Side */}
                                    <div className="w-full h-full min-h-[120px] p-5 rounded-2xl bg-gradient-to-br from-indigo-900 via-blue-900 to-slate-900 text-white border border-indigo-700 shadow-3d-glow-blue backface-hidden rotate-y-180 flex flex-col justify-center items-center text-center">
                                      <span className="text-[10px] uppercase font-bold text-amber-300 tracking-wider mb-1 font-mono flex items-center gap-1">
                                        <span className="material-symbols-outlined text-[13px]">verified</span>
                                        Answer & Key Takeaway
                                      </span>
                                      <p className="text-xs md:text-sm font-semibold text-blue-100 leading-snug">
                                        {curCard.back}
                                      </p>
                                    </div>
                                  </div>
                                </div>

                                <div className="flex items-center justify-between gap-2 pt-2">
                                  <button
                                    disabled={curIdx === 0}
                                    onClick={() => {
                                      setFlashcardIndices((prev) => ({ ...prev, [msg.id]: curIdx - 1 }));
                                      setFlashcardFlipped((prev) => ({ ...prev, [msg.id]: false }));
                                    }}
                                    className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-xs font-bold text-slate-700 btn-3d-press cursor-pointer"
                                  >
                                    Previous
                                  </button>
                                  <button
                                    disabled={curIdx === msg.flashcards.length - 1}
                                    onClick={() => {
                                      setFlashcardIndices((prev) => ({ ...prev, [msg.id]: curIdx + 1 }));
                                      setFlashcardFlipped((prev) => ({ ...prev, [msg.id]: false }));
                                    }}
                                    className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-xs font-bold text-white shadow-3d-sm btn-3d-press cursor-pointer"
                                  >
                                    Next Card →
                                  </button>
                                </div>
                              </div>
                            );
                          })()}
                        </div>
                      )}

                      {/* Mains Answer Review Card */}
                      {msg.mainsReview && (
                        <div className="mt-3.5 p-4 md:p-5 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-xs">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-md border border-purple-100 uppercase">
                              Official Mains Scoring Rubric
                            </span>
                            <div className="text-right">
                              <span className="text-lg font-extrabold text-slate-900 font-mono">{msg.mainsReview.score}</span>
                              <span className="text-xs text-slate-400 font-mono"> / {msg.mainsReview.maxScore} Marks</span>
                            </div>
                          </div>

                          <div className="space-y-1.5">
                            {msg.mainsReview.breakdown.map((item, idx) => (
                              <div key={idx} className="flex items-center justify-between text-xs py-1 border-b border-slate-100">
                                <span className="text-slate-600">{item.label}</span>
                                <span className="font-bold text-slate-900 font-mono">{item.score}</span>
                              </div>
                            ))}
                          </div>

                          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 space-y-1">
                            <strong className="block text-[11px] uppercase tracking-wider font-mono">High-Yield Improvements:</strong>
                            <ul className="list-disc list-inside space-y-0.5">
                              {msg.mainsReview.improvements.map((imp, idx) => (
                                <li key={idx}>{imp}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono px-1">{msg.timestamp}</span>
                </div>
              );
            })}

            {isTyping && (
              <div className="flex items-center gap-2 text-xs text-slate-400 p-2">
                <div className="w-2 h-2 rounded-full bg-blue-600 animate-bounce" />
                <div className="w-2 h-2 rounded-full bg-blue-600 animate-bounce [animation-delay:0.2s]" />
                <div className="w-2 h-2 rounded-full bg-blue-600 animate-bounce [animation-delay:0.4s]" />
                <span>Beacon AI is analyzing constitutional doctrines...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompt Suggestions at Bottom above Input Bar */}
          <div className="px-3 md:px-4 py-2 bg-slate-50 border-t border-slate-200 flex items-center gap-2 overflow-x-auto custom-scrollbar shrink-0">
            <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono shrink-0">
              <span className="material-symbols-outlined text-[14px] text-amber-500">lightbulb</span>
              <span>Suggestions:</span>
            </div>
            {starterChips.map((chip, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendMessage(chip.prompt)}
                className="px-3 py-1.5 rounded-xl bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-700 text-xs font-semibold border border-slate-200 hover:border-blue-300 shadow-2xs shrink-0 transition-all active:scale-95 whitespace-nowrap cursor-pointer"
              >
                {chip.label}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <div className="p-3 md:p-4 bg-slate-50 border-t border-slate-200/80">
            {isVoiceRecording ? (
              <div className="flex items-center justify-between p-3 bg-rose-50 border border-rose-200 rounded-2xl animate-pulse">
                <div className="flex items-center gap-2 text-rose-700 text-xs font-bold">
                  <span className="w-3 h-3 rounded-full bg-rose-600 animate-ping" />
                  <span>Recording Voice Note... ({formatVoiceTime(voiceSeconds)})</span>
                </div>
                <button
                  onClick={() => {
                    setIsVoiceRecording(false);
                    handleSendMessage('Summarize recent Supreme Court judgements on Article 21 and Right to Privacy.');
                  }}
                  className="px-3 py-1 bg-rose-600 text-white rounded-xl text-xs font-bold shadow-xs"
                >
                  Send Audio Query
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2"
              >
                <button
                  type="button"
                  onClick={() => {
                    setIsVoiceRecording(true);
                    showToast('Listening... Speak your UPSC query', 'info', 'mic');
                  }}
                  className="w-10 h-10 rounded-2xl bg-white border border-slate-200 hover:border-blue-400 text-slate-600 flex items-center justify-center transition-all shrink-0 active:scale-95"
                  title="Voice Input"
                >
                  <span className="material-symbols-outlined text-[20px]">mic</span>
                </button>

                <input
                  type="text"
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  placeholder="Ask any UPSC question, Article, Doctrine, or paste answer draft..."
                  className="flex-1 bg-white px-4 py-3 rounded-2xl text-xs md:text-sm text-slate-900 border border-slate-200 focus:border-blue-600 outline-none shadow-2xs transition-all font-medium"
                />

                <button
                  type="submit"
                  disabled={!inputVal.trim()}
                  className="w-10 h-10 rounded-2xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white flex items-center justify-center transition-all shrink-0 shadow-md active:scale-95 cursor-pointer"
                  title="Send Message"
                >
                  <span className="material-symbols-outlined text-[20px]">send</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
