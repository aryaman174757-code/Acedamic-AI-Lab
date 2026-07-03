import { useState, useEffect } from 'react';
import { notesData } from '../data/notesData';
import { Definition, NoteSection, AppTheme } from '../types';
import { Search, BookOpen, AlertCircle, Info, HelpCircle, ChevronRight, CheckCircle2 } from 'lucide-react';
import MathRenderer from './MathRenderer';

interface NotesViewerProps {
  notes?: NoteSection[];
  activeTheme?: AppTheme | null;
}

export default function NotesViewer({ notes = notesData, activeTheme = null }: NotesViewerProps) {
  const [activeTab, setActiveTab] = useState<string>('part1');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Auto-reset active tab when notes array changes
  useEffect(() => {
    if (notes && notes.length > 0) {
      setActiveTab(notes[0].id);
    }
  }, [notes]);

  const activeSection = notes.find((s) => s.id === activeTab) || notes[0];

  // Search logic across all sections and definitions
  const allMatchingDefs: { sectionTitle: string; def: Definition }[] = [];
  if (searchQuery.trim() !== '') {
    notes.forEach((s) => {
      s.definitions.forEach((d) => {
        if (
          d.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
          d.definition.toLowerCase().includes(searchQuery.toLowerCase())
        ) {
          allMatchingDefs.push({ sectionTitle: s.title, def: d });
        }
      });
    });
  }

  // Helper to render responsive visual SVG vector graphs directly in the lecture notes
  const renderVisualGraph = (graph: any) => {
    if (!graph) return null;
    return (
      <div className="my-4 bg-slate-50 border border-slate-100 rounded-2xl p-4 flex flex-col items-center shadow-inner relative overflow-hidden">
        <span className="absolute top-2 right-3 text-[9px] font-bold text-slate-400 tracking-widest uppercase">Visual Model</span>
        <svg className="w-full max-w-[280px] h-[160px] select-none pointer-events-none">
          {/* Draw Edges */}
          {graph.edges.map((edge: any, i: number) => {
            const fromNode = graph.nodes.find((n: any) => n.id === edge.from);
            const toNode = graph.nodes.find((n: any) => n.id === edge.to);
            if (!fromNode || !toNode) return null;

            // Self loops representation
            if (edge.from === edge.to) {
              const r = 14;
              const pathX = fromNode.x * 1.1;
              const pathY = (fromNode.y - 12) * 0.9;
              return (
                <path
                  key={`ex-loop-${i}`}
                  d={`M ${pathX} ${fromNode.y * 0.8} C ${pathX - r} ${pathY - r}, ${pathX + r} ${pathY - r}, ${pathX} ${fromNode.y * 0.8}`}
                  fill="none"
                  stroke="#6366f1"
                  strokeWidth="2"
                  className="opacity-70 animate-pulse"
                />
              );
            }

            return (
              <line
                key={`ex-edge-${i}`}
                x1={fromNode.x * 1.1}
                y1={fromNode.y * 0.8}
                x2={toNode.x * 1.1}
                y2={toNode.y * 0.8}
                stroke="#94a3b8"
                strokeWidth="2"
                className="opacity-80"
              />
            );
          })}

          {/* Draw Vertices */}
          {graph.nodes.map((node: any) => (
            <g key={node.id} transform={`translate(${node.x * 1.1}, ${node.y * 0.8})`}>
              <circle r="12" fill="#1e1b4b" stroke="#6366f1" strokeWidth="2" />
              <circle r="10" fill="#ffffff" />
              <text
                textAnchor="middle"
                dy="3.5"
                fontSize="9"
                fontWeight="bold"
                className="fill-indigo-950 font-sans"
              >
                {node.label}
              </text>
            </g>
          ))}
        </svg>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Search Header Row styled with Clean Minimalism */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50 border border-slate-200 rounded-xl p-5 shadow-sm relative overflow-hidden">
        <div className="z-10">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-indigo-600" /> Interactive Notes Explorer
          </h2>
          <p className="text-xs text-slate-400 mt-0.5 font-medium">Browse, search, and visualize syllabus topics with dynamic mathematical rendering.</p>
        </div>
        <div className="relative w-full md:max-w-xs z-10 shrink-0">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search definitions, terms..."
            className="w-full bg-white text-slate-900 placeholder-slate-400 text-xs pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all"
          />
        </div>
      </div>

      {searchQuery.trim() !== '' ? (
        // Search Results Mode
        <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
            Search Results ({allMatchingDefs.length})
          </h3>

          {allMatchingDefs.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-xs font-medium">
              No matching definitions found for "{searchQuery}".
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {allMatchingDefs.map(({ sectionTitle, def }, idx) => (
                <div key={idx} className="bg-slate-50/50 border border-slate-200 rounded-lg p-4 flex flex-col justify-between hover:border-indigo-200 transition-colors">
                  <div>
                    <span className="text-[9px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-100/50 px-2 py-0.5 rounded-md uppercase tracking-wider">
                      {sectionTitle}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 mt-2">{def.term}</h4>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">{def.definition}</p>
                    {def.formula && (
                      <div className="mt-2">
                        <MathRenderer math={def.formula} />
                      </div>
                    )}
                  </div>
                  {def.exampleText && (
                    <p className="text-[10px] text-slate-400 mt-3 italic border-t border-slate-200/50 pt-2 font-medium">
                      Example: {def.exampleText}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        // Standard Textbook Tabs Mode
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Vertical Tabs list */}
          <div className="lg:col-span-3 flex flex-row lg:flex-col gap-1 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 scrollbar-none border-b lg:border-b-0 lg:border-r border-slate-200 pr-0 lg:pr-4">
            {notes.map((s) => (
              <button
                key={s.id}
                onClick={() => setActiveTab(s.id)}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-bold rounded-lg transition-all whitespace-nowrap cursor-pointer shrink-0 ${
                  activeTab === s.id
                    ? 'bg-indigo-50 text-indigo-700 border border-indigo-100/80 font-bold'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <span className="flex items-center justify-center w-5 h-5 rounded bg-indigo-500/10 text-indigo-600 font-extrabold text-[9px]">
                  {s.part}
                </span>
                {s.title}
              </button>
            ))}
          </div>

          {/* Right Active Section Content */}
          <div className="lg:col-span-9 space-y-8">
            {/* Section Overview Header */}
            {activeSection && (
              <>
                <div className="border-b border-slate-200 pb-6">
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-2xl font-serif italic text-indigo-600 font-medium">Part {activeSection.part}</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Module Outline</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 tracking-tight">{activeSection.title}</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{activeSection.description}</p>
                </div>

                {/* Definitions Accordion */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">
                    Vocabulary & Foundations
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {activeSection.definitions.map((def, idx) => (
                      <div
                        key={idx}
                        className="bg-white border border-slate-200 rounded-lg p-5 hover:border-indigo-200 hover:shadow-sm transition-all flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-start justify-between gap-2 flex-wrap">
                            <h5 className="font-bold text-sm text-slate-900">{def.term}</h5>
                            {def.formula && (
                              <MathRenderer math={def.formula} />
                            )}
                          </div>
                          <p className="text-xs text-slate-600 mt-2 leading-relaxed">{def.definition}</p>
                        </div>

                        {renderVisualGraph(def.graph)}

                        {def.exampleText && (
                          <div className="mt-4 pt-3 border-t border-slate-100 flex items-start gap-1.5 text-[10px] text-slate-400">
                            <Info className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                            <p className="italic">
                              <strong className="font-semibold not-italic text-slate-500">Example:</strong> {def.exampleText}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Theorems Module (if any exist in active section) */}
                {activeSection.theorems && activeSection.theorems.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">
                      Key Formulas & Proofs
                    </h4>
                    <div className="space-y-3">
                      {activeSection.theorems.map((thm, idx) => (
                        <div
                          key={idx}
                          className="bg-slate-50 border-l-4 border-indigo-600 p-5 rounded-r-lg border border-slate-200 border-l-0"
                        >
                          <span className="text-[9px] font-extrabold text-indigo-600 uppercase tracking-widest bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded">
                            Theorem Reference
                          </span>
                          <h5 className="text-sm font-bold text-slate-900 mt-2.5">{thm.name}</h5>
                          <p className="text-xs text-slate-600 mt-1 leading-relaxed">{thm.statement}</p>
                          {thm.formula && (
                            <MathRenderer math={thm.formula} block />
                          )}
                          {thm.explanation && (
                            <p className="text-[10px] text-slate-400 mt-3 border-t border-slate-150 pt-2.5 italic">
                              Explanation: {thm.explanation}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Solved Examples Slider / Accordion */}
                {activeSection.solvedExamples && activeSection.solvedExamples.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">
                      Solved Examples & Proofs
                    </h4>
                    <div className="space-y-4">
                      {activeSection.solvedExamples.map((ex, idx) => (
                        <div key={idx} className="bg-slate-50 border border-slate-200 rounded-lg p-5">
                          <span className="text-[9px] font-bold text-slate-400 tracking-wider uppercase">
                            {ex.title}
                          </span>
                          <p className="text-xs font-bold text-slate-800 mt-1 leading-snug">{ex.question}</p>
                          
                          {renderVisualGraph(ex.graph)}

                          <div className="mt-4 space-y-2 border-t border-slate-200/60 pt-4">
                            <p className="text-[9px] font-bold text-indigo-600 uppercase tracking-widest">Step-by-Step Proof</p>
                            {ex.solution.map((step, sIdx) => (
                              <div key={sIdx} className="flex items-start gap-2 text-xs text-slate-600">
                                <ChevronRight className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                                <p>{step}</p>
                              </div>
                            ))}
                          </div>

                          <div className="mt-4 bg-white px-4 py-2.5 rounded-lg border border-slate-200/65 flex items-center justify-between shadow-sm">
                            <span className="text-[9px] font-bold text-slate-400 tracking-wider uppercase">Verified Answer</span>
                            <span className="text-xs font-bold text-indigo-700 bg-indigo-50/50 border border-indigo-100 px-2 py-0.5 rounded">
                              <MathRenderer math={ex.answer} />
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Exam Warnings & Mistakes Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Warnings / Mistakes */}
                  <div className="bg-white border-l-4 border-red-500 border border-slate-200/80 rounded-r-lg p-5">
                    <h5 className="text-xs font-bold text-red-800 flex items-center gap-1.5 uppercase tracking-wider">
                      <AlertCircle className="w-4 h-4 text-red-500" /> Common Mistakes
                    </h5>
                    <ul className="mt-3 space-y-2.5 text-xs text-slate-600">
                      {activeSection.commonMistakes && activeSection.commonMistakes.map((mistake, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-red-500 shrink-0 select-none">❌</span>
                          <p className="leading-snug">{mistake}</p>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Study Tips */}
                  <div className="bg-white border-l-4 border-emerald-500 border border-slate-200/80 rounded-r-lg p-5">
                    <h5 className="text-xs font-bold text-emerald-800 flex items-center gap-1.5 uppercase tracking-wider">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Pro Study Tips
                    </h5>
                    <ul className="mt-3 space-y-2.5 text-xs text-slate-600">
                      {activeSection.examTips && activeSection.examTips.map((tip, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-emerald-500 shrink-0 select-none">✓</span>
                          <p className="leading-snug">{tip}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* University Mock Questions */}
                {activeSection.universityQuestions && activeSection.universityQuestions.length > 0 && (
                  <div className="bg-white border border-slate-200 rounded-lg p-5">
                    <h5 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">
                      Syllabus Practice Questions
                    </h5>
                    <div className="mt-3 space-y-3">
                      {activeSection.universityQuestions.map((q, idx) => (
                        <div key={idx} className="flex items-start gap-3 bg-slate-50/50 p-3 rounded-lg border border-slate-200/60 text-xs">
                          <span className={`px-2 py-0.5 rounded font-bold uppercase tracking-wider text-[8px] shrink-0 mt-0.5 ${
                            q.type === 'Theory' ? 'bg-indigo-50 text-indigo-600 border border-indigo-100/50' : 'bg-amber-50 text-amber-600 border border-amber-100/50'
                          }`}>
                            {q.type}
                          </span>
                          <p className="text-slate-800 font-semibold leading-snug">{q.question}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
