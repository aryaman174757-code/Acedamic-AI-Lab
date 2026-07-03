import React, { useState } from 'react';
import NotesViewer from './components/NotesViewer';
import InteractiveGraphSandbox from './components/InteractiveGraphSandbox';
import QuizSection from './components/QuizSection';
import PDFExporter from './components/PDFExporter';
import { BookOpen, Zap, Award, Download, GraduationCap, ChevronRight, Upload, RefreshCw, Sparkles, Check, Info } from 'lucide-react';
import { NoteSection, QuizQuestion, AppTheme } from './types';
import { notesData, quizQuestions as defaultQuiz } from './data/notesData';

export default function App() {
  const [activeView, setActiveTab] = useState<'notes' | 'sandbox' | 'quiz' | 'pdf'>('notes');
  
  // Custom Curriculum States
  const [notes, setNotes] = useState<NoteSection[]>(notesData);
  const [quiz, setQuiz] = useState<QuizQuestion[]>(defaultQuiz);
  const [notesTitle, setNotesTitle] = useState<string>('Relations and Functions: Graph Theory');
  const [activeTheme, setActiveTheme] = useState<AppTheme | null>(null);

  // File Upload and Analysis States
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [isAnalyzed, setIsAnalyzed] = useState<boolean>(false);
  const [uploadedFileName, setUploadedFileName] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isOfflineFallback, setIsOfflineFallback] = useState<boolean>(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFileName(file.name);
    setIsAnalyzing(true);
    setErrorMsg(null);

    const reader = new FileReader();
    reader.onload = async (event) => {
      const fileContent = event.target?.result as string;
      try {
        const response = await fetch('/api/analyze-file', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            fileContent,
            fileName: file.name
          }),
        });

        const responseText = await response.text();
        let data: any;
        try {
          data = JSON.parse(responseText);
        } catch (jsonErr) {
          throw new Error(`The syllabus processor returned an unexpected HTML or plain text response instead of JSON. Details: ${responseText.slice(0, 150)}...`);
        }

        if (!response.ok) {
          throw new Error(data.error || 'Failed to analyze syllabus');
        }
        
        // Update state with newly analyzed curriculum structure and theme
        if (data.notesData && data.notesData.length > 0) {
          setNotes(data.notesData);
        }
        if (data.quizQuestions && data.quizQuestions.length > 0) {
          setQuiz(data.quizQuestions);
        }
        if (data.notesTitle) {
          setNotesTitle(data.notesTitle);
        }
        if (data.theme) {
          setActiveTheme(data.theme);
        }
        setIsOfflineFallback(!!data.isOfflineFallback);
        setIsAnalyzed(true);
        setActiveTab('notes'); // redirect to notes to view the newly refactored companion
      } catch (err: any) {
        console.error(err);
        setErrorMsg(err.message || 'Error occurred during syllabus refactoring.');
      } finally {
        setIsAnalyzing(false);
      }
    };

    reader.readAsText(file);
  };

  const handleRestore = () => {
    setNotes(notesData);
    setQuiz(defaultQuiz);
    setNotesTitle('Relations and Functions: Graph Theory');
    setActiveTheme(null);
    setIsAnalyzed(false);
    setUploadedFileName('');
    setErrorMsg(null);
    setIsOfflineFallback(false);
  };

  return (
    <div className="flex h-screen w-screen bg-slate-50 text-slate-900 font-sans overflow-hidden">
      {/* Sidebar navigation conforming to the Clean Minimalism HTML */}
      <aside className="w-80 border-r border-slate-200 bg-white flex flex-col shrink-0 hidden md:flex">
        {/* Sidebar Brand Header */}
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-6 h-6 bg-indigo-600 rounded flex items-center justify-center shrink-0">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="font-bold text-base tracking-tight">Academic AI Lab</span>
          </div>
          <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">Syllabus Companion Hub</p>
        </div>

        {/* Sidebar Interactive Navigation and Stats */}
        <div className="flex-1 p-5 space-y-6 overflow-y-auto">
          {/* Core Applet Navigation tabs */}
          <section>
            <h3 className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-3">Core Study Modules</h3>
            <ul className="space-y-1">
              <li>
                <button
                  onClick={() => setActiveTab('notes')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeView === 'notes' && !activeTheme
                      ? 'bg-indigo-50 text-indigo-700 border border-indigo-100/50'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                  style={activeView === 'notes' && activeTheme ? {
                    backgroundColor: activeTheme.secondaryColor,
                    color: activeTheme.textColor,
                    border: `1px solid ${activeTheme.primaryColor}25`
                  } : undefined}
                >
                  <span className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 shrink-0" style={{ color: activeTheme ? activeTheme.primaryColor : undefined }} />
                    Lecture Notes Manual
                  </span>
                  <ChevronRight className="w-3 h-3" style={{ color: activeTheme ? activeTheme.primaryColor : undefined }} />
                </button>
              </li>

              <li>
                <button
                  onClick={() => setActiveTab('sandbox')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeView === 'sandbox' && !activeTheme
                      ? 'bg-indigo-50 text-indigo-700 border border-indigo-100/50'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                  style={activeView === 'sandbox' && activeTheme ? {
                    backgroundColor: activeTheme.secondaryColor,
                    color: activeTheme.textColor,
                    border: `1px solid ${activeTheme.primaryColor}25`
                  } : undefined}
                >
                  <span className="flex items-center gap-2">
                    <Zap className="w-4 h-4 shrink-0" style={{ color: activeTheme ? activeTheme.primaryColor : undefined }} />
                    Interactive Sandbox
                  </span>
                  <ChevronRight className="w-3 h-3" style={{ color: activeTheme ? activeTheme.primaryColor : undefined }} />
                </button>
              </li>

              <li>
                <button
                  onClick={() => setActiveTab('quiz')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeView === 'quiz' && !activeTheme
                      ? 'bg-indigo-50 text-indigo-700 border border-indigo-100/50'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                  style={activeView === 'quiz' && activeTheme ? {
                    backgroundColor: activeTheme.secondaryColor,
                    color: activeTheme.textColor,
                    border: `1px solid ${activeTheme.primaryColor}25`
                  } : undefined}
                >
                  <span className="flex items-center gap-2">
                    <Award className="w-4 h-4 shrink-0" style={{ color: activeTheme ? activeTheme.primaryColor : undefined }} />
                    Practice Assessment
                  </span>
                  <ChevronRight className="w-3 h-3" style={{ color: activeTheme ? activeTheme.primaryColor : undefined }} />
                </button>
              </li>

              <li>
                <button
                  onClick={() => setActiveTab('pdf')}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeView === 'pdf' && !activeTheme
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                  style={activeView === 'pdf' && activeTheme ? {
                    backgroundColor: activeTheme.primaryColor,
                    color: '#ffffff',
                    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
                  } : undefined}
                >
                  <span className="flex items-center gap-2">
                    <Download className="w-4 h-4 shrink-0" />
                    PDF Custom Publisher
                  </span>
                  <ChevronRight className="w-3 h-3 text-slate-300" style={{ color: activeView === 'pdf' ? '#ffffff' : undefined }} />
                </button>
              </li>
            </ul>
          </section>

          {/* SYLLABUS AI ANALYZER FORM */}
          <section className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 space-y-3">
            <div>
              <h4 className="text-[10px] font-bold text-slate-700 flex items-center gap-1 uppercase tracking-widest">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600 shrink-0 animate-pulse" /> Syllabus AI Analyzer
              </h4>
              <p className="text-[9px] text-slate-400 mt-1 font-semibold leading-normal">
                Upload custom notes/syllabus file. The AI will restructure the notes, formulate custom quizzes, and transform the design colors!
              </p>
            </div>

            {/* Dropzone Area */}
            <label className="border border-dashed border-slate-300 hover:border-indigo-500 bg-white rounded-md p-3 flex flex-col items-center justify-center text-center cursor-pointer transition-colors">
              <Upload className="w-5 h-5 text-slate-400 mb-1" />
              <span className="text-[9px] font-bold text-slate-800">Select Syllabus File</span>
              <span className="text-[8px] text-slate-400 font-medium">.md, .txt, .json</span>
              <input
                type="file"
                accept=".md,.txt,.json"
                onChange={handleFileUpload}
                className="hidden"
                disabled={isAnalyzing}
              />
            </label>

            {isAnalyzing && (
              <div className="flex items-center justify-center gap-2 py-1 bg-indigo-50 border border-indigo-100/50 rounded p-2">
                <RefreshCw className="w-3.5 h-3.5 text-indigo-600 animate-spin" />
                <span className="text-[9px] font-extrabold text-indigo-950">AI is restructuring app...</span>
              </div>
            )}

            {isAnalyzed && (
              <div className="space-y-2 pt-2 border-t border-slate-200">
                <div className="flex items-center justify-between text-[9px] text-slate-800 font-semibold">
                  <span className="truncate max-w-[130px]">📄 {uploadedFileName}</span>
                  <span className="bg-emerald-50 text-emerald-700 border border-emerald-100/50 px-1 py-0.5 rounded text-[8px] font-bold">Refactored</span>
                </div>
                <button
                  onClick={handleRestore}
                  className="w-full py-1 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 hover:text-slate-800 rounded text-[9px] font-bold transition-all cursor-pointer"
                >
                  Reset to Original Notes
                </button>
              </div>
            )}

            {errorMsg && (
              <div className="bg-red-50 border border-red-100/50 rounded p-2 text-[9px] text-red-800 font-medium leading-relaxed">
                {errorMsg}
              </div>
            )}
          </section>

          {/* Syllabus indicators and guidelines */}
          <section className="space-y-2">
            <h3 className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Study Insights</h3>
            <ul className="space-y-2 text-[10px] font-semibold">
              <li className="flex items-center justify-between bg-slate-50/50 p-2 rounded border border-slate-100">
                <span className="text-slate-500 font-medium">Active Syllabus</span>
                <span className="text-slate-800 font-bold truncate max-w-[120px]">
                  {isAnalyzed ? uploadedFileName : 'Graph Theory Default'}
                </span>
              </li>
              <li className="flex items-center justify-between bg-slate-50/50 p-2 rounded border border-slate-100">
                <span className="text-slate-500 font-medium">Chapter Content</span>
                <span className="text-indigo-700 bg-indigo-50 border border-indigo-100/30 px-1.5 py-0.5 rounded text-[9px] font-bold">
                  {notes.length} Sections Loaded
                </span>
              </li>
              <li className="flex items-center justify-between bg-slate-50/50 p-2 rounded border border-slate-100">
                <span className="text-slate-500 font-medium">Evaluation Exercises</span>
                <span className="text-emerald-700 bg-emerald-50 border border-emerald-100/30 px-1.5 py-0.5 rounded text-[9px] font-bold">
                  {quiz.length} Assessment Items
                </span>
              </li>
            </ul>
          </section>
        </div>

        {/* Sidebar Footer info */}
        <div className="p-6 mt-auto border-t border-slate-100 bg-slate-50/30">
          <div className="flex items-center gap-2 text-[10px] text-slate-400 font-semibold">
            <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>Dual view interactive textbook generator</span>
          </div>
        </div>
      </aside>

      {/* Main Content Area in light gray */}
      <main className="flex-1 flex flex-col bg-slate-100 overflow-hidden">
        {/* Navigation bar conforming to layout */}
        <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            {/* Quick Mobile Drawer Tabs Trigger */}
            <div className="flex md:hidden items-center gap-1 bg-slate-100 p-1 rounded-lg">
              <button
                onClick={() => setActiveTab('notes')}
                className={`px-2.5 py-1 text-[10px] font-extrabold rounded-md ${activeView === 'notes' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}
              >
                Notes
              </button>
              <button
                onClick={() => setActiveTab('sandbox')}
                className={`px-2.5 py-1 text-[10px] font-extrabold rounded-md ${activeView === 'sandbox' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}
              >
                Lab
              </button>
              <button
                onClick={() => setActiveTab('quiz')}
                className={`px-2.5 py-1 text-[10px] font-extrabold rounded-md ${activeView === 'quiz' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}
              >
                Quiz
              </button>
              <button
                onClick={() => setActiveTab('pdf')}
                className={`px-2.5 py-1 text-[10px] font-extrabold rounded-md ${activeView === 'pdf' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500'}`}
              >
                PDF
              </button>
            </div>

            {/* Desktop Brand indicators */}
            <div className="hidden md:flex items-center gap-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                <span className="w-5 h-5 flex items-center justify-center border border-slate-300 rounded font-mono text-slate-700 bg-slate-50 text-[10px]">AI</span>
                <span>Active Textbook</span>
              </div>
              <div className="h-4 w-px bg-slate-200" />
              <div className="flex items-center gap-4 text-xs font-semibold">
                <span className="text-indigo-600 border-b-2 border-indigo-600 py-5">
                  {activeView === 'notes' && 'Lecture Notes Manual'}
                  {activeView === 'sandbox' && 'Graph Laboratory'}
                  {activeView === 'quiz' && 'Self-Assessment Practice'}
                  {activeView === 'pdf' && 'PDF Export Settings'}
                </span>
                <span className="text-slate-400 hover:text-slate-600 py-5 cursor-pointer transition-colors" onClick={() => setActiveTab('notes')}>
                  Active Course Outline
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-indigo-50 border border-indigo-100 text-[10px] font-bold text-indigo-600">
              <GraduationCap className="w-3 h-3" /> Companion Hub
            </span>
            {activeView !== 'pdf' && (
              <button
                onClick={() => setActiveTab('pdf')}
                className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-3.5 py-1.5 rounded-md text-xs font-bold shadow-sm shadow-indigo-100 cursor-pointer transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                Download PDF
              </button>
            )}
          </div>
        </header>

        {/* Outer content viewport containing the centered crisp minimal letter sheet */}
        <div className="flex-1 p-4 md:p-8 overflow-y-auto flex justify-center items-start">
          <div className="w-full max-w-4xl bg-white shadow-lg rounded-sm border border-slate-200/80 flex flex-col min-h-full">
            
            {/* Dynamic AI Custom Theme Status Indicator */}
            {activeTheme && (
              <div className="px-8 md:px-12 pt-6">
                <div 
                  className="rounded-lg px-4 py-2.5 flex items-center justify-between border text-xs"
                  style={{ 
                    backgroundColor: activeTheme.secondaryColor, 
                    borderColor: activeTheme.borderStyle || '#e2e8f0',
                    color: activeTheme.textColor
                  }}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full animate-ping" style={{ backgroundColor: activeTheme.primaryColor }} />
                    <span>
                      Active AI Restructured Theme: <strong className="font-extrabold uppercase tracking-wider">{activeTheme.name}</strong>
                    </span>
                  </div>
                  <button
                    onClick={handleRestore}
                    className="text-[10px] font-extrabold underline hover:opacity-80 uppercase tracking-widest cursor-pointer"
                  >
                    Restore Original Theme
                  </button>
                </div>
              </div>
            )}

            {isOfflineFallback && (
              <div className="px-8 md:px-12 pt-4">
                <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-lg px-4 py-3.5 text-xs flex items-start gap-2.5 shadow-sm leading-relaxed">
                  <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold">Offline Companion Compiler Activated</p>
                    <p className="text-amber-800 font-medium mt-1">
                      The cloud syllabus parser experienced high demand or rate limits. We've compiled your document's key modules, vocabulary, and active formulas <strong>locally with high-fidelity heuristics</strong> to keep you learning uninterrupted!
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Textbook Document Header */}
            <div className="p-8 md:p-12 pb-6 border-b border-slate-100">
              <div className="space-y-2">
                <h1 className={`text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight ${activeTheme?.headerFont === 'font-serif' ? 'font-serif' : 'font-sans'}`}>
                  {activeView === 'notes' && notesTitle}
                  {activeView === 'sandbox' && 'Interactive Canvas Graph Laboratory'}
                  {activeView === 'quiz' && 'Unit Assessment: Test Your Knowledge'}
                  {activeView === 'pdf' && 'Lecture Manual PDF Generator & Exporter'}
                </h1>
                <p className="text-xs md:text-sm text-slate-400 font-medium">
                  Discrete Mathematics Course Companion • Refactored with Clean Minimalism Theme
                </p>
              </div>
            </div>

            {/* Dynamic View Injection */}
            <div className="flex-1 p-6 md:p-12 pt-6">
              {activeView === 'notes' && <NotesViewer notes={notes} activeTheme={activeTheme} />}
              {activeView === 'sandbox' && <InteractiveGraphSandbox activeTheme={activeTheme} notes={notes} />}
              {activeView === 'quiz' && <QuizSection questions={quiz} activeTheme={activeTheme} />}
              {activeView === 'pdf' && <PDFExporter notes={notes} quizQuestions={quiz} activeTheme={activeTheme} />}
            </div>

            {/* Simulated Academic Textbook Footer */}
            <footer className="bg-slate-50 border-t border-slate-100 p-5 text-[9px] text-slate-400 text-center uppercase tracking-[0.2em] font-medium shrink-0">
              Internal Study Companion • Academic Year 2026-2027 • Approved Syllabus Hub
            </footer>
          </div>
        </div>
      </main>
    </div>
  );
}
