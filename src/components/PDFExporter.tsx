import { useState, useEffect } from 'react';
import { generateNotesPDF } from '../utils/pdfGenerator';
import { Download, FileText, Check, Palette, Type, BookOpen, Layers, Sparkles, AlertCircle, User, Heading, BookMarked, Sliders, Settings } from 'lucide-react';
import { NoteSection, QuizQuestion, AppTheme } from '../types';
import { notesData, quizQuestions as defaultQuiz } from '../data/notesData';

interface PDFExporterProps {
  notes?: NoteSection[];
  quizQuestions?: QuizQuestion[];
  activeTheme?: AppTheme | null;
}

export default function PDFExporter({ notes = notesData, quizQuestions = defaultQuiz, activeTheme = null }: PDFExporterProps) {
  const [includeCover, setIncludeCover] = useState<boolean>(true);
  const [themeColor, setThemeColor] = useState<'navy' | 'teal' | 'charcoal' | 'custom'>(activeTheme ? 'custom' : 'navy');
  const [fontSize, setFontSize] = useState<'compact' | 'standard' | 'large'>('standard');
  const [includeExamples, setIncludeExamples] = useState<boolean>(true);
  const [includeQuestions, setIncludeQuestions] = useState<boolean>(true);
  
  // Sync the themeColor when activeTheme gets updated by dynamic file analysis
  useEffect(() => {
    if (activeTheme) {
      setThemeColor('custom');
    }
  }, [activeTheme]);

  // Advanced Customizations
  const defaultTitle = notes[0]?.title ? `Unit IV: ${notes[0].title}` : 'Engineering Mathematics Syllabus Companion';
  const [customTitle, setCustomTitle] = useState<string>(defaultTitle);
  const [customSubTitle, setCustomSubTitle] = useState<string>('A professionally arranged, structured, and comprehensive compilation of lecture notes, formulas, solved proofs, and study guides.');
  const [customAuthor, setCustomAuthor] = useState<string>('Discrete Structures Board & Engineering Faculty');
  const [customHeader, setCustomHeader] = useState<string>('Discrete Mathematical Structures Lecture Companion');
  const [paperSize, setPaperSize] = useState<'a4' | 'letter'>('a4');
  const [includeQuiz, setIncludeQuiz] = useState<boolean>(true);

  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [showToast, setShowToast] = useState<boolean>(false);
  const [showAdvanced, setShowAdvanced] = useState<boolean>(true);

  const handleExport = () => {
    setIsExporting(true);
    
    setTimeout(() => {
      try {
        const doc = generateNotesPDF({
          includeCover,
          themeColor,
          customTheme: activeTheme,
          fontSize,
          includeExamples,
          includeQuestions,
          customTitle,
          customSubTitle,
          customAuthor,
          customHeader,
          paperSize,
          includeQuiz
        }, notes, quizQuestions);
        
        // Trigger browser save
        const cleanTitle = (customTitle || 'Syllabus_Lectures_Manual').trim().replace(/[^a-zA-Z0-9]/g, '_');
        doc.save(`${cleanTitle}.pdf`);
        
        // Show success indicator
        setShowToast(true);
        setTimeout(() => setShowToast(false), 4000);
      } catch (err) {
        console.error('PDF Generation Error:', err);
      } finally {
        setIsExporting(false);
      }
    }, 800);
  };

  // Theme description helper for UI
  const themeColors = {
    navy: { title: 'Classic Academic Navy', hex: 'bg-indigo-900', secondary: 'border-indigo-200' },
    teal: { title: 'Modern Professional Teal', hex: 'bg-teal-700', secondary: 'border-teal-200' },
    charcoal: { title: 'Minimalist Charcoal Grey', hex: 'bg-slate-700', secondary: 'border-slate-200' },
    custom: { title: activeTheme?.name || 'Active AI Custom Theme', hex: '', secondary: 'border-slate-200' }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="pdf-publisher">
      {/* Settings Form Column */}
      <div className="lg:col-span-6 bg-white border border-slate-200 rounded-lg p-5 shadow-sm space-y-5">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 font-sans">
            <Layers className="w-4 h-4 text-indigo-600" /> PDF Publication Settings
          </h3>
          <p className="text-xs text-slate-400 mt-1 font-semibold">Customize modules and styling parameters for textbook compilation.</p>
        </div>

        {/* Custom Textbook Metadata Fields */}
        <div className="border border-slate-100 bg-slate-50/50 rounded-lg p-3 space-y-3.5">
          <button 
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center justify-between w-full text-slate-700 text-xs font-bold uppercase tracking-wider"
          >
            <span className="flex items-center gap-1.5"><Settings className="w-3.5 h-3.5 text-indigo-500" /> Cover & Header Metadata</span>
            <span className="text-[10px] text-indigo-600">{showAdvanced ? 'Hide Options' : 'Show Options'}</span>
          </button>

          {showAdvanced && (
            <div className="space-y-3 pt-2.5 border-t border-slate-150/40">
              {/* Title input */}
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <Heading className="w-3 h-3 text-slate-400" /> Main Book Title
                </label>
                <input
                  type="text"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  placeholder="e.g., Unit IV: Graph Theory"
                  className="w-full bg-white border border-slate-250 rounded px-2.5 py-1.5 text-xs font-medium text-slate-800 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              {/* Subtitle / Description input */}
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <BookMarked className="w-3 h-3 text-slate-400" /> Cover Page Subtitle / Description
                </label>
                <textarea
                  value={customSubTitle}
                  onChange={(e) => setCustomSubTitle(e.target.value)}
                  placeholder="A brief summary shown on the book cover page."
                  className="w-full bg-white border border-slate-250 rounded px-2.5 py-1.5 text-xs font-medium text-slate-800 h-16 focus:outline-none focus:border-indigo-500 transition-colors resize-none leading-relaxed"
                />
              </div>

              {/* Author & Header fields in row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                    <User className="w-3 h-3 text-slate-400" /> Book Author / Board
                  </label>
                  <input
                    type="text"
                    value={customAuthor}
                    onChange={(e) => setCustomAuthor(e.target.value)}
                    placeholder="e.g., University Editorial"
                    className="w-full bg-white border border-slate-250 rounded px-2.5 py-1.5 text-xs font-medium text-slate-800 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                    <Sliders className="w-3 h-3 text-slate-400" /> Page Running Header
                  </label>
                  <input
                    type="text"
                    value={customHeader}
                    onChange={(e) => setCustomHeader(e.target.value)}
                    placeholder="e.g., Engineering Math"
                    className="w-full bg-white border border-slate-250 rounded px-2.5 py-1.5 text-xs font-medium text-slate-800 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Paper Size Selector */}
        <div className="space-y-2.5">
          <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">
            Print Format Size
          </label>
          <div className="grid grid-cols-2 gap-2">
            {(['a4', 'letter'] as const).map((fmt) => (
              <button
                key={fmt}
                onClick={() => setPaperSize(fmt)}
                className={`py-2 rounded-lg border text-center text-xs font-bold capitalize transition-all cursor-pointer ${
                  paperSize === fmt
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-950'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                }`}
              >
                {fmt === 'a4' ? 'A4 International Standard (210x297mm)' : 'US Letter Format (8.5x11")'}
              </button>
            ))}
          </div>
        </div>

        {/* Theme Color Palette */}
        <div className="space-y-2.5">
          <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">
            Publication Color Theme
          </label>
          <div className={`grid gap-2 ${activeTheme ? 'grid-cols-2 md:grid-cols-4' : 'grid-cols-3'}`}>
            {(activeTheme ? (['navy', 'teal', 'charcoal', 'custom'] as const) : (['navy', 'teal', 'charcoal'] as const)).map((color) => (
              <button
                key={color}
                onClick={() => setThemeColor(color)}
                className={`p-2 rounded-lg border text-left transition-all cursor-pointer ${
                  themeColor === color
                    ? 'border-indigo-600 bg-indigo-50/50'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  {color === 'custom' && activeTheme ? (
                    <div className="w-3 h-3 rounded-full border border-slate-200 shrink-0" style={{ backgroundColor: activeTheme.primaryColor }} />
                  ) : (
                    <div className={`w-3 h-3 rounded-full shrink-0 ${themeColors[color as 'navy' | 'teal' | 'charcoal'].hex}`} />
                  )}
                  <span className="text-[10px] font-bold text-slate-700 capitalize truncate">
                    {color === 'custom' ? 'AI Theme' : color}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Font size settings */}
        <div className="space-y-2.5">
          <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">
            Typography Print Scaling
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(['compact', 'standard', 'large'] as const).map((sz) => (
              <button
                key={sz}
                onClick={() => setFontSize(sz)}
                className={`py-2 rounded-lg border text-center text-xs font-bold capitalize transition-all cursor-pointer ${
                  fontSize === sz
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-950 font-bold'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                }`}
              >
                {sz}
              </button>
            ))}
          </div>
        </div>

        {/* Structure and Sections Toggles */}
        <div className="space-y-2.5 pt-4 border-t border-slate-100">
          <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
            Include Notebook Modules
          </label>

          {/* Cover page */}
          <label className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-200 cursor-pointer">
            <div className="flex items-center gap-2.5">
              <FileText className="w-4 h-4 text-slate-500" />
              <div>
                <span className="text-xs font-bold text-slate-800 block">Academic Cover Page</span>
                <span className="text-[10px] text-slate-400 block mt-0.5 font-semibold">Adds a curated title block with graphic motifs</span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={includeCover}
              onChange={(e) => setIncludeCover(e.target.checked)}
              className="accent-indigo-600 w-4 h-4 cursor-pointer"
            />
          </label>

          {/* Solved Examples */}
          <label className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-200 cursor-pointer">
            <div className="flex items-center gap-2.5">
              <BookOpen className="w-4 h-4 text-slate-500" />
              <div>
                <span className="text-xs font-bold text-slate-800 block">Solved University Examples</span>
                <span className="text-[10px] text-slate-400 block mt-0.5 font-semibold">Adds proofs and calculations walkthroughs</span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={includeExamples}
              onChange={(e) => setIncludeExamples(e.target.checked)}
              className="accent-indigo-600 w-4 h-4 cursor-pointer"
            />
          </label>

          {/* Exam Questions */}
          <label className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-200 cursor-pointer">
            <div className="flex items-center gap-2.5">
              <Check className="w-4 h-4 text-slate-500" />
              <div>
                <span className="text-xs font-bold text-slate-800 block">Appendix A: University Practice</span>
                <span className="text-[10px] text-slate-400 block mt-0.5 font-semibold">Adds major theory and numerical exam items</span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={includeQuestions}
              onChange={(e) => setIncludeQuestions(e.target.checked)}
              className="accent-indigo-600 w-4 h-4 cursor-pointer"
            />
          </label>

          {/* Evaluation Quiz */}
          <label className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-200 cursor-pointer">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-indigo-500" />
              <div>
                <span className="text-xs font-bold text-slate-800 block">Appendix B: Active Evaluation Quiz</span>
                <span className="text-[10px] text-slate-400 block mt-0.5 font-semibold">Appends the generated study companion quiz as exercises</span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={includeQuiz}
              onChange={(e) => setIncludeQuiz(e.target.checked)}
              className="accent-indigo-600 w-4 h-4 cursor-pointer"
            />
          </label>
        </div>

        {/* Compile and Download Button */}
        <button
          onClick={handleExport}
          disabled={isExporting}
          className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-xs font-bold shadow-sm shadow-indigo-100 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
        >
          {isExporting ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Compiling Lecture PDF...
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              Compile & Download Enhanced PDF
            </>
          )}
        </button>

        {/* Info panel */}
        <div className="bg-amber-500/5 border border-amber-500/15 rounded-lg p-3 flex items-start gap-2.5 text-[10px] text-amber-800">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <p className="leading-normal font-medium">
            Our compiler structures your PDF using <strong>absolute vector assets</strong>. This ensures any custom shapes or formulas render with pixel-perfect resolution, matching high-quality university textbook publications.
          </p>
        </div>
      </div>

      {/* Interactive Visual PDF Simulator Column */}
      <div className="lg:col-span-6 bg-slate-50 border border-slate-200 rounded-lg p-6 flex flex-col justify-center items-center shadow-sm relative overflow-hidden min-h-[380px]">
        {/* Dot pattern background */}
        <div className="absolute inset-0 opacity-40" style={{ 
          backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', 
          backgroundSize: '16px 16px' 
        }} />

        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest absolute top-4 left-4 z-10">
          Publication Preview Simulator
        </span>

        {/* PDF Stack Mock representation */}
        <div className="relative w-[210px] h-[280px] bg-white rounded-lg shadow-md border border-slate-200 overflow-hidden transform hover:scale-[1.01] transition-transform duration-300 z-10 flex flex-col justify-between">
          
          {/* Mock Cover Content */}
          {includeCover ? (
            <div className="flex flex-col justify-between h-full">
              {/* Header block with selected theme color */}
              <div 
                className={`p-4 text-white text-left transition-colors duration-300 ${
                  themeColor !== 'custom' ? themeColors[themeColor].hex : ''
                }`}
                style={themeColor === 'custom' && activeTheme ? { backgroundColor: activeTheme.primaryColor } : undefined}
              >
                <span className="text-[5px] font-bold uppercase tracking-widest block opacity-70">
                  Engineering Mathematics
                </span>
                <span className="text-[7px] font-bold block mt-1">
                  DISCRETE STRUCTURES CURRICULUM
                </span>
                <span className="text-[5px] block text-slate-300">LECTURE NOTES REFERENCE</span>
              </div>

              {/* Cover Main Content */}
              <div className="p-4 flex-grow flex flex-col justify-center">
                <span className="text-[6px] font-bold text-slate-400 uppercase tracking-wider block">
                  Comprehensive Manual
                </span>
                <h4 className="text-[12px] font-bold text-slate-800 mt-1 leading-tight uppercase font-serif">
                  {customTitle.length > 28 ? `${customTitle.slice(0, 25)}...` : customTitle}
                </h4>
                <div 
                  className="w-8 h-0.5 my-2" 
                  style={{ backgroundColor: themeColor === 'custom' && activeTheme ? activeTheme.primaryColor : '#4f46e5' }}
                />
                <p className="text-[5px] text-slate-400 leading-normal font-semibold">
                  Transcribed, enhanced, and verified notes covering basic definitions, order & size, Handshaking Theorem, Eulerian trails, and Trees.
                </p>

                {/* Cover graphic simulator */}
                <div className="mt-4 flex justify-center py-2 opacity-30">
                  <div className="w-12 h-12 rounded-full border border-dashed border-slate-400 flex items-center justify-center">
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: themeColor === 'custom' && activeTheme ? activeTheme.primaryColor : '#4f46e5' }}
                    />
                  </div>
                </div>
              </div>

              {/* Cover footer */}
              <div className="p-3 border-t border-slate-100 text-center bg-slate-50/50">
                <span className="text-[6px] font-bold text-slate-400 uppercase tracking-widest block">
                  JULY 2026 EDITION — EXAM SPECIAL
                </span>
              </div>
            </div>
          ) : (
            // Inner Page Simulator Content
            <div className="p-4 flex flex-col justify-between h-full">
              {/* Inner Page content */}
              <div>
                {/* Simulated Inner Header */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-1 mb-2">
                  <span className="text-[5px] font-bold text-slate-400 uppercase">{customHeader || 'Lecture Companion'}</span>
                  <span className="text-[5px] font-bold text-slate-400">Page 1 of 12</span>
                </div>

                {/* Chapter title */}
                <div 
                  className="p-1 bg-slate-50 border-l-2 mb-2"
                  style={{
                    borderColor: themeColor === 'custom' && activeTheme 
                      ? activeTheme.primaryColor 
                      : themeColor === 'navy' 
                        ? '#1e3a8a' 
                        : themeColor === 'teal' 
                          ? '#0f766e' 
                          : '#475569'
                  }}
                >
                  <h5 className="text-[7px] font-bold text-slate-900 font-serif">PART 1: INTRO TO GRAPH STRUCTURES</h5>
                </div>

                {/* Content lines */}
                <div className="space-y-1.5">
                  <div className="space-y-0.5">
                    <div className="w-14 h-1.5 bg-slate-800 rounded-sm" />
                    <div className="w-32 h-1 bg-slate-300 rounded-sm" />
                    <div className="w-24 h-1 bg-slate-200 rounded-sm" />
                  </div>

                  {/* Simulated Formula callout */}
                  <div className="my-2 p-1.5 rounded bg-slate-50 border border-dashed text-center flex flex-col items-center justify-center">
                    <span className="text-[5px] font-bold text-slate-400 block uppercase">Formula block</span>
                    <span className="font-mono text-[7px] font-bold text-indigo-950 mt-0.5" style={themeColor === 'custom' && activeTheme ? { color: activeTheme.textColor } : undefined}>G = (V, E)</span>
                  </div>

                  <div className="space-y-0.5">
                    <div className="w-16 h-1.5 bg-slate-800 rounded-sm" />
                    <div className="w-36 h-1 bg-slate-300 rounded-sm" />
                    <div className="w-28 h-1 bg-slate-200 rounded-sm" />
                  </div>

                  {/* Visual SVG mock container */}
                  <div className="border border-slate-100 bg-slate-50 rounded-md py-1 flex items-center justify-center mt-2">
                    <svg className="w-16 h-8 opacity-40">
                      <line x1="10" y1="16" x2="30" y2="6" stroke="#000" strokeWidth="1" />
                      <line x1="30" y1="6" x2="50" y2="16" stroke="#000" strokeWidth="1" />
                      <circle cx="10" r="2" cy="16" fill="#000" />
                      <circle cx="30" r="2" cy="6" fill="#000" />
                      <circle cx="50" r="2" cy="16" fill="#000" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Simulated Inner Footer */}
              <div className="border-t border-slate-100 pt-1 flex items-center justify-between text-[4px] text-slate-400 font-semibold uppercase">
                <span>Discrete Structures Manual</span>
                <span>Engineering Math Editorial</span>
              </div>
            </div>
          )}
        </div>

        {/* Stack shadow visual effect under PDF preview */}
        <div className="w-[190px] h-[5px] bg-slate-300/40 rounded-full blur-sm mt-3" />

        {/* Success toast notification */}
        {showToast && (
          <div className="absolute bottom-4 bg-emerald-600 text-white px-4 py-2.5 rounded-lg text-xs font-bold shadow-md flex items-center gap-2 z-30">
            <Check className="w-4 h-4" /> PDF Notes Successfully Compiled & Downloaded!
          </div>
        )}
      </div>
    </div>
  );
}
