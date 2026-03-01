import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, XCircle, FileText, Play, Code, ChevronRight, ChevronLeft, Download } from 'lucide-react';

// --- Types ---
interface Question {
  number: number;
  question: string;
  options: { [key: string]: string };
  correct: string | null;
}

// --- Parsing Logic (Task 2) ---
function parseQuizMarkdown(markdown: string): Question[] {
  const questions: Question[] = [];
  const lines = markdown.split('\n');
  let currentQuestion: Question | null = null;

  lines.forEach(line => {
    const trimmed = line.trim();
    const qMatch = trimmed.match(/^\*\*(\d+)\.\s*(.*?)\*\*$/);
    if (qMatch) {
      if (currentQuestion) questions.push(currentQuestion);
      currentQuestion = {
        number: parseInt(qMatch[1]),
        question: qMatch[2],
        options: {},
        correct: null
      };
      return;
    }

    const oMatch = trimmed.match(/^- ([A-D])\)\s*(.*)$/);
    if (oMatch && currentQuestion) {
      currentQuestion.options[oMatch[1]] = oMatch[2];
    }
  });

  if (currentQuestion) questions.push(currentQuestion);
  return questions;
}

function parseAnswerKey(answerKeyText: string): { [key: number]: string } {
  const answers: { [key: number]: string } = {};
  const matches = answerKeyText.matchAll(/(\d+)\.\s*([A-D])/g);
  for (const match of matches) {
    answers[parseInt(match[1])] = match[2];
  }
  return answers;
}

// --- Components ---

interface QuestionCardProps {
  q: Question;
  onCheck: (qNum: number, selected: string) => void;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ q, onCheck }) => {
  const [selected, setSelected] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);

  const handleCheck = () => {
    if (selected) {
      setChecked(true);
      onCheck(q.number, selected);
    }
  };

  const isCorrect = selected === q.correct;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mb-6"
    >
      <div className="flex items-start gap-4 mb-4">
        <span className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm">
          {q.number}
        </span>
        <h3 className="text-lg font-semibold text-slate-800 leading-tight">
          {q.question}
        </h3>
      </div>

      <div className="space-y-3 mb-6">
        {Object.entries(q.options).map(([key, value]) => {
          let statusClass = "border-slate-200 hover:bg-slate-50";
          if (checked) {
            if (key === q.correct) statusClass = "bg-emerald-50 border-emerald-500 text-emerald-700 font-medium";
            else if (key === selected && !isCorrect) statusClass = "bg-rose-50 border-rose-500 text-rose-700";
          } else if (selected === key) {
            statusClass = "bg-indigo-50 border-indigo-500 text-indigo-700";
          }

          return (
            <label 
              key={key}
              className={`flex items-center p-4 rounded-xl border cursor-pointer transition-all ${statusClass}`}
            >
              <input 
                type="radio" 
                name={`q-${q.number}`} 
                className="hidden"
                onChange={() => {
                  setSelected(key);
                  setChecked(false);
                }}
              />
              <span className="w-6 font-bold">{key})</span>
              <span className="flex-1">{value}</span>
              {checked && key === q.correct && <CheckCircle2 className="w-5 h-5 text-emerald-500 ml-2" />}
              {checked && key === selected && !isCorrect && <XCircle className="w-5 h-5 text-rose-500 ml-2" />}
            </label>
          );
        })}
      </div>

      <div className="flex items-center justify-between">
        <button 
          onClick={handleCheck}
          disabled={!selected}
          className={`px-6 py-2 rounded-lg font-semibold transition-all ${
            !selected 
              ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
              : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md hover:shadow-lg active:scale-95'
          }`}
        >
          Check Answer
        </button>
        
        {checked && (
          <motion.span 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className={`font-bold ${isCorrect ? 'text-emerald-600' : 'text-rose-600'}`}
          >
            {isCorrect ? 'Correct!' : `Incorrect. Correct: ${q.correct}`}
          </motion.span>
        )}
      </div>
    </motion.div>
  );
};

export default function App() {
  const [view, setView] = useState<'preview' | 'converter'>('preview');
  const [mdInput, setMdInput] = useState('');
  const [keyInput, setKeyInput] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const questionsPerPage = 5;

  // Load initial data for preview
  useEffect(() => {
    const initialMd = `
## Introduction & Advanced Concepts (Questions 1-5)

**1. Which statement correctly distinguishes 'agile' processes from traditional project management?**
- A) Agile always takes longer than traditional
- B) Agile breaks work into concurrent, complementary pieces with continuous adjustment
- C) Agile requires more documentation
- D) Agile eliminates team communication

**2. In technical English, when acronyms replace words with sound-alikes (e.g., '2' for 'to'), this reflects:**
- A) Grammatical errors to be avoided
- B) Informal usage never acceptable in technical writing
- C) Established technical jargon for efficiency
- D) Only verbal communication patterns

**3. The term 'ROI' in project management contexts specifically measures:**
- A) Total revenue generated
- B) Whether a project brings profit and time to profitability
- C) Only initial investment costs
- D) Employee satisfaction ratings

**4. 'Lidar' technology differs from radar primarily by using:**
- A) Sound waves instead of electromagnetic radiation
- B) Pulsed laser light measured by time-of-flight
- C) Only passive sensing without emission
- D) Chemical detection rather than distance measurement

**5. The technical distinction between 'analyze' and 'determine' is that:**
- A) They are perfect synonyms in all contexts
- B) Analyze examines methodically; determine reaches conclusions
- C) Determine is informal; analyze is formal
- D) Analyze is faster than determine
    `;
    const initialKey = `1. B | 2. C | 3. B | 4. B | 5. B`;
    
    const parsedQs = parseQuizMarkdown(initialMd);
    const parsedKeys = parseAnswerKey(initialKey);
    parsedQs.forEach(q => q.correct = parsedKeys[q.number]);
    setQuestions(parsedQs);
  }, []);

  const handleConvert = () => {
    const parsedQs = parseQuizMarkdown(mdInput);
    const parsedKeys = parseAnswerKey(keyInput);
    parsedQs.forEach(q => q.correct = parsedKeys[q.number]);
    setQuestions(parsedQs);
    setView('preview');
    setCurrentPage(0);
  };

  const paginatedQuestions = questions.slice(
    currentPage * questionsPerPage,
    (currentPage + 1) * questionsPerPage
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-indigo-200 shadow-lg">
              <FileText className="text-white w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">QuizMaster</h1>
          </div>
          <div className="flex bg-slate-100 p-1 rounded-xl">
            <button 
              onClick={() => setView('preview')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${view === 'preview' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <Play className="w-4 h-4" /> Preview
            </button>
            <button 
              onClick={() => setView('converter')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${view === 'converter' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <Code className="w-4 h-4" /> Converter
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-12">
        <AnimatePresence mode="wait">
          {view === 'preview' ? (
            <motion.div 
              key="preview"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-slate-900 mb-2">Interactive Quiz</h2>
                <p className="text-slate-500">Test your knowledge with these generated questions.</p>
              </div>

              {questions.length > 0 ? (
                <>
                  {paginatedQuestions.map(q => (
                    <QuestionCard key={q.number} q={q} onCheck={(num, sel) => console.log(`Checked Q${num}: ${sel}`)} />
                  ))}

                  {/* Pagination */}
                  <div className="flex items-center justify-between mt-12 pt-8 border-t border-slate-200">
                    <button 
                      onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
                      disabled={currentPage === 0}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 hover:bg-white disabled:opacity-30 transition-all"
                    >
                      <ChevronLeft className="w-5 h-5" /> Previous
                    </button>
                    <span className="text-sm font-medium text-slate-500">
                      Page {currentPage + 1} of {Math.ceil(questions.length / questionsPerPage)}
                    </span>
                    <button 
                      onClick={() => setCurrentPage(p => Math.min(Math.ceil(questions.length / questionsPerPage) - 1, p + 1))}
                      disabled={currentPage >= Math.ceil(questions.length / questionsPerPage) - 1}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 hover:bg-white disabled:opacity-30 transition-all"
                    >
                      Next <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
                  <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500">No questions loaded. Use the converter to add some!</p>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div 
              key="converter"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-3xl font-bold text-slate-900 mb-2">Markdown Converter</h2>
                <p className="text-slate-500">Paste your quiz Markdown and Answer Key below.</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wider">Quiz Markdown</label>
                  <textarea 
                    value={mdInput}
                    onChange={(e) => setMdInput(e.target.value)}
                    placeholder="**1. Question?**&#10;- A) Option 1&#10;- B) Option 2..."
                    className="w-full h-64 p-4 rounded-2xl border border-slate-200 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all font-mono text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wider">Answer Key</label>
                  <textarea 
                    value={keyInput}
                    onChange={(e) => setKeyInput(e.target.value)}
                    placeholder="1. B | 2. C | 3. A..."
                    className="w-full h-32 p-4 rounded-2xl border border-slate-200 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all font-mono text-sm"
                  />
                </div>

                <button 
                  onClick={handleConvert}
                  className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold text-lg hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all active:scale-[0.98]"
                >
                  Generate Interactive Quiz
                </button>
              </div>

              <div className="bg-amber-50 p-6 rounded-2xl border border-amber-200">
                <h4 className="font-bold text-amber-800 mb-2">Format Guide</h4>
                <ul className="text-sm text-amber-700 space-y-1 list-disc pl-4">
                  <li>Questions must start with <code>**n.</code> and end with <code>**</code></li>
                  <li>Options must start with <code>- A)</code>, <code>- B)</code>, etc.</li>
                  <li>Answer key should be <code>n. Letter</code> separated by <code>|</code> or newlines.</li>
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="max-w-3xl mx-auto px-6 py-12 border-t border-slate-200 text-center">
        <p className="text-slate-400 text-sm">
          Built for Senior Front-end Engineering Task. <br/>
          <a href="/quiz.html" className="text-indigo-600 hover:underline font-medium mt-2 inline-block flex items-center justify-center gap-1">
            <Download className="w-4 h-4" /> Download Standalone HTML Quiz
          </a>
        </p>
      </footer>
    </div>
  );
}
