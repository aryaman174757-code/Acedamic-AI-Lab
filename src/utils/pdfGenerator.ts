import { jsPDF } from 'jspdf';
import { notesData } from '../data/notesData';
import { NoteSection, QuizQuestion, AppTheme } from '../types';

interface ExportSettings {
  includeCover: boolean;
  themeColor: 'navy' | 'teal' | 'charcoal' | 'custom';
  customTheme?: AppTheme | null;
  fontSize: 'compact' | 'standard' | 'large';
  includeExamples: boolean;
  includeQuestions: boolean;
  // Customizations
  customTitle?: string;
  customSubTitle?: string;
  customAuthor?: string;
  customHeader?: string;
  paperSize?: 'a4' | 'letter';
  includeQuiz?: boolean;
}

export function generateNotesPDF(
  settings: ExportSettings,
  notes: NoteSection[] = notesData,
  questions: QuizQuestion[] = []
): jsPDF {
  const isLetter = settings.paperSize === 'letter';
  const pageHeight = isLetter ? 279.4 : 297;
  const pageWidth = isLetter ? 215.9 : 210;
  const format = isLetter ? 'letter' : 'a4';

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: format
  });

  const margin = 20;
  const contentWidth = pageWidth - (margin * 2);

  // Theme colors (RGB)
  const colors = {
    navy: { primary: [26, 54, 93], secondary: [43, 108, 176], accent: [235, 248, 250], border: [200, 210, 225] },
    teal: { primary: [35, 78, 82], secondary: [49, 151, 149], accent: [230, 245, 245], border: [195, 220, 220] },
    charcoal: { primary: [45, 55, 72], secondary: [74, 85, 104], accent: [247, 250, 252], border: [226, 232, 240] }
  };

  // Convert hex color codes to RGB format for jsPDF
  const parseHexToRgb = (hex: string, defaultRgb: [number, number, number]): [number, number, number] => {
    try {
      if (!hex) return defaultRgb;
      const cleanHex = hex.replace('#', '');
      const r = parseInt(cleanHex.substring(0, 2), 16);
      const g = parseInt(cleanHex.substring(2, 4), 16);
      const b = parseInt(cleanHex.substring(4, 6), 16);
      return [isNaN(r) ? defaultRgb[0] : r, isNaN(g) ? defaultRgb[1] : g, isNaN(b) ? defaultRgb[2] : b];
    } catch {
      return defaultRgb;
    }
  };

  const selectedTheme = settings.themeColor === 'custom' && settings.customTheme
    ? {
        primary: parseHexToRgb(settings.customTheme.primaryColor, [26, 54, 93]),
        secondary: parseHexToRgb(settings.customTheme.textColor, [43, 108, 176]),
        accent: parseHexToRgb(settings.customTheme.secondaryColor, [235, 248, 250]),
        border: parseHexToRgb(settings.customTheme.primaryColor, [200, 210, 225])
      }
    : (colors[settings.themeColor as 'navy' | 'teal' | 'charcoal'] || colors.navy);

  const fontSizeMultiplier = settings.fontSize === 'compact' ? 0.85 : settings.fontSize === 'large' ? 1.15 : 1.0;

  let currentY = margin;
  let pageNumber = 1;
  let tocPageNumber = 1;

  interface IndexEntry {
    title: string;
    page: number;
  }
  const indexEntries: IndexEntry[] = [];

  // Draw Header and Footer helper
  const drawPageDecorations = (d: jsPDF, pageNum: number) => {
    if (pageNum === 1 && settings.includeCover) return; // Skip cover page decorations

    d.saveGraphicsState();
    
    // Header
    d.setFont('helvetica', 'normal');
    d.setFontSize(8);
    d.setTextColor(120, 120, 120);
    const runHeader = (settings.customHeader || 'ENGINEERING MATHEMATICS — UNIT IV: GRAPH THEORY').toUpperCase();
    d.text(runHeader, margin, 12);
    d.setDrawColor(selectedTheme.border[0], selectedTheme.border[1], selectedTheme.border[2]);
    d.setLineWidth(0.2);
    d.line(margin, 14, pageWidth - margin, 14);

    // Footer
    d.line(margin, pageHeight - 15, pageWidth - margin, pageHeight - 15);
    d.text('Comprehensive Lecture Notes & Study Guide', margin, pageHeight - 10);
    d.text(`Page ${pageNum}`, pageWidth - margin, pageHeight - 10, { align: 'right' });

    d.restoreGraphicsState();
  };

  // Helper to safely add text and handle page breaks
  const checkPageBreak = (neededHeight: number) => {
    if (currentY + neededHeight > pageHeight - 20) {
      doc.addPage();
      pageNumber++;
      currentY = 22; // Start below header line
      drawPageDecorations(doc, pageNumber);
    }
  };

  // Helper to draw a centered math equation box
  const drawEquationBox = (eq: string) => {
    checkPageBreak(18);
    
    doc.saveGraphicsState();
    // Shaded box
    doc.setFillColor(selectedTheme.accent[0], selectedTheme.accent[1], selectedTheme.accent[2]);
    doc.setDrawColor(selectedTheme.secondary[0], selectedTheme.secondary[1], selectedTheme.secondary[2]);
    doc.setLineWidth(0.4);
    
    const boxHeight = 12;
    const boxY = currentY;
    
    doc.roundedRect(margin + 15, boxY, contentWidth - 30, boxHeight, 1.5, 1.5, 'FD');
    
    // Text inside
    doc.setFont('courier', 'bold');
    doc.setFontSize(11 * fontSizeMultiplier);
    doc.setTextColor(selectedTheme.primary[0], selectedTheme.primary[1], selectedTheme.primary[2]);
    doc.text(eq, pageWidth / 2, boxY + 7.5, { align: 'center' });
    
    doc.restoreGraphicsState();
    currentY += boxHeight + 6;
  };

  // Helper to draw vector graphs in PDF
  const drawPDFGraph = (graph: any) => {
    const graphHeight = 55;
    checkPageBreak(graphHeight + 10);

    const startX = (pageWidth - 120) / 2; // Center graph in 120mm width
    const startY = currentY + 5;

    doc.saveGraphicsState();
    // Shaded canvas border
    doc.setDrawColor(240, 240, 240);
    doc.setFillColor(252, 253, 254);
    doc.roundedRect(startX - 10, startY - 5, 140, graphHeight, 2, 2, 'FD');

    // Draw Edges first
    doc.setLineWidth(0.5);
    doc.setDrawColor(120, 130, 140);
    
    const scaleFactorX = 0.5; // Scale from SVG layout coordinates to PDF mm
    const scaleFactorY = 0.22;

    graph.edges.forEach((edge: any) => {
      const fromNode = graph.nodes.find((n: any) => n.id === edge.from);
      const toNode = graph.nodes.find((n: any) => n.id === edge.to);
      if (fromNode && toNode) {
        const x1 = startX + (fromNode.x * scaleFactorX);
        const y1 = startY + (fromNode.y * scaleFactorY);
        const x2 = startX + (toNode.x * scaleFactorX);
        const y2 = startY + (toNode.y * scaleFactorY);
        
        doc.line(x1, y1, x2, y2);

        // If directed, draw a simple arrowhead in middle
        if (edge.directed) {
          const midX = (x1 + x2) / 2;
          const midY = (y1 + y2) / 2;
          doc.setFillColor(120, 130, 140);
          doc.circle(midX, midY, 1, 'F');
        }

        // If weighted, render a weight tag
        if (edge.weight !== undefined) {
          const midX = (x1 + x2) / 2;
          const midY = (y1 + y2) / 2;
          doc.setFillColor(255, 255, 255);
          doc.roundedRect(midX - 3, midY - 3, 6, 6, 1, 1, 'F');
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(7);
          doc.setTextColor(50, 50, 50);
          doc.text(String(edge.weight), midX, midY + 1.8, { align: 'center' });
        }
      }
    });

    // Draw Vertices
    graph.nodes.forEach((node: any) => {
      const x = startX + (node.x * scaleFactorX);
      const y = startY + (node.y * scaleFactorY);

      // Node node shadow/border
      doc.setFillColor(selectedTheme.secondary[0], selectedTheme.secondary[1], selectedTheme.secondary[2]);
      doc.circle(x, y, 4, 'F');
      
      doc.setFillColor(255, 255, 255);
      doc.circle(x, y, 3.4, 'F');

      // Label
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(selectedTheme.primary[0], selectedTheme.primary[1], selectedTheme.primary[2]);
      doc.text(node.label, x, y + 1.2, { align: 'center' });
    });

    doc.restoreGraphicsState();
    currentY += graphHeight + 8;
  };

  // --- COVER PAGE ---
  if (settings.includeCover) {
    doc.saveGraphicsState();

    // Top Header bar
    doc.setFillColor(selectedTheme.primary[0], selectedTheme.primary[1], selectedTheme.primary[2]);
    doc.rect(0, 0, pageWidth, 90, 'F');

    // Accent line
    doc.setFillColor(selectedTheme.secondary[0], selectedTheme.secondary[1], selectedTheme.secondary[2]);
    doc.rect(0, 90, pageWidth, 5, 'F');

    // Title text inside colored header
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(28);
    doc.text('ACADEMIC SYLLABUS COMPANION', margin, 40);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(14);
    doc.text('DISCRETE MATHEMATICAL STRUCTURES', margin, 52);
    doc.text('UNIVERSITY CURRICULUM NOTES', margin, 60);

    // Main Chapter title
    doc.setTextColor(selectedTheme.primary[0], selectedTheme.primary[1], selectedTheme.primary[2]);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(28); // slightly smaller to support custom long titles beautifully
    const mainTitle = (settings.customTitle || 'UNIT IV: GRAPH THEORY').toUpperCase();
    const splitTitle = doc.splitTextToSize(mainTitle, contentWidth);
    doc.text(splitTitle, margin, 115);

    // Bottom description block
    doc.setTextColor(80, 90, 100);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    
    const descText = settings.customSubTitle || 'A professionally arranged, structured, and comprehensive compilation covering basic definitions, graph classifications, the Handshaking Theorem, walks and paths, Eulerian and Hamiltonian graphs, trees, spanning trees, and university examinations preparation sheets.';
    const descLines = doc.splitTextToSize(descText, contentWidth);
    doc.text(descLines, margin, 140);

    // Decorative Vector Graph on Cover Page
    // Draw a K_4 complete graph in bottom section
    const covGraphX = pageWidth / 2;
    const covGraphY = 220;
    const radius = 25;
    const nodeCoords = [
      [covGraphX, covGraphY - radius], // top
      [covGraphX + radius, covGraphY], // right
      [covGraphX, covGraphY + radius], // bottom
      [covGraphX - radius, covGraphY], // left
    ];

    doc.setLineWidth(0.4);
    doc.setDrawColor(selectedTheme.secondary[0], selectedTheme.secondary[1], selectedTheme.secondary[2], 0.3);
    
    // Connect all nodes
    for (let i = 0; i < 4; i++) {
      for (let j = i + 1; j < 4; j++) {
        doc.line(nodeCoords[i][0], nodeCoords[i][1], nodeCoords[j][0], nodeCoords[j][1]);
      }
    }

    // Draw nodes
    nodeCoords.forEach((coord, i) => {
      doc.setFillColor(selectedTheme.primary[0], selectedTheme.primary[1], selectedTheme.primary[2]);
      doc.circle(coord[0], coord[1], 3, 'F');
      doc.setFillColor(255, 255, 255);
      doc.circle(coord[0], coord[1], 2.2, 'F');
    });

    // Metadata at bottom
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(selectedTheme.primary[0], selectedTheme.primary[1], selectedTheme.primary[2]);
    doc.text('STUDY COMPANION & REFERENCE HANDBOOK', pageWidth / 2, 265, { align: 'center' });
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(120, 120, 120);
    const authorVal = settings.customAuthor || 'Engineering Mathematics Editorial Board';
    doc.text(`Published on: July 2026  •  ${authorVal}`, pageWidth / 2, 273, { align: 'center' });

    doc.restoreGraphicsState();
    
    // Page 1 is Cover.
    // Reserve Page 2 for Table of Contents (Index)
    doc.addPage();
    pageNumber++;
    tocPageNumber = 2;
    drawPageDecorations(doc, pageNumber);

    // Add Page 3 to start actual content
    doc.addPage();
    pageNumber++;
    currentY = 22; // Start below header line
    drawPageDecorations(doc, pageNumber);
  } else {
    // If no cover, Page 1 is Table of Contents.
    tocPageNumber = 1;

    // Add Page 2 to start actual content
    doc.addPage();
    pageNumber++;
    currentY = 22; // Start below header line
    drawPageDecorations(doc, pageNumber);
  }

  // --- RENDER SECTIONS ---
  notes.forEach((section) => {
    checkPageBreak(35);

    // Record section start in Table of Contents Index
    indexEntries.push({
      title: `Part ${section.part}: ${section.title}`,
      page: pageNumber
    });

    // Main Section Header
    doc.saveGraphicsState();
    doc.setFillColor(selectedTheme.primary[0], selectedTheme.primary[1], selectedTheme.primary[2]);
    doc.rect(margin, currentY, contentWidth, 9, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11 * fontSizeMultiplier);
    doc.text(`PART ${section.part} : ${section.title.toUpperCase()}`, margin + 4, currentY + 6.2);
    doc.restoreGraphicsState();
    
    currentY += 14;

    // Section Description
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(9 * fontSizeMultiplier);
    doc.setTextColor(90, 90, 90);
    const descLines = doc.splitTextToSize(section.description, contentWidth);
    doc.text(descLines, margin, currentY);
    currentY += (descLines.length * 4.5) + 6;

    // --- DEFINITIONS ---
    section.definitions.forEach((def) => {
      const defHeightNeeded = def.graph ? 75 : 28;
      checkPageBreak(defHeightNeeded);

      // Record definition in Table of Contents Index
      indexEntries.push({
        title: `   • ${def.term}`,
        page: pageNumber
      });

      doc.saveGraphicsState();
      
      // left color accent bar
      doc.setFillColor(selectedTheme.secondary[0], selectedTheme.secondary[1], selectedTheme.secondary[2]);
      doc.rect(margin, currentY, 1.5, 12, 'F');

      // term
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10.5 * fontSizeMultiplier);
      doc.setTextColor(selectedTheme.primary[0], selectedTheme.primary[1], selectedTheme.primary[2]);
      doc.text(def.term, margin + 4, currentY + 4);

      // definition text
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9 * fontSizeMultiplier);
      doc.setTextColor(45, 55, 72);
      
      const wrappedDef = doc.splitTextToSize(def.definition, contentWidth - 6);
      doc.text(wrappedDef, margin + 4, currentY + 9);
      
      const defHeight = (wrappedDef.length * 4.5) + 11;
      currentY += defHeight;

      // if formula exists
      if (def.formula) {
        drawEquationBox(def.formula);
      }

      // if graph exists
      if (def.graph) {
        drawPDFGraph(def.graph);
      }

      // if exampleText exists
      if (def.exampleText) {
        checkPageBreak(12);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8.5 * fontSizeMultiplier);
        doc.setTextColor(110, 110, 110);
        const wrappedEx = doc.splitTextToSize(`Example context: ${def.exampleText}`, contentWidth - 10);
        doc.text(wrappedEx, margin + 4, currentY);
        currentY += (wrappedEx.length * 4) + 6;
      } else {
        currentY += 2;
      }

      doc.restoreGraphicsState();
    });

    // --- THEOREMS ---
    if (section.theorems.length > 0) {
      checkPageBreak(15);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11 * fontSizeMultiplier);
      doc.setTextColor(selectedTheme.primary[0], selectedTheme.primary[1], selectedTheme.primary[2]);
      doc.text('Key Theorems & Mathematical Proofs', margin, currentY);
      currentY += 6;

      section.theorems.forEach((thm) => {
        checkPageBreak(30);

        doc.saveGraphicsState();
        // border block
        doc.setDrawColor(selectedTheme.border[0], selectedTheme.border[1], selectedTheme.border[2]);
        doc.setFillColor(selectedTheme.accent[0], selectedTheme.accent[1], selectedTheme.accent[2]);
        doc.setLineWidth(0.3);

        const thmLines = doc.splitTextToSize(`${thm.name}: ${thm.statement}`, contentWidth - 10);
        const thmHeight = (thmLines.length * 4.5) + 10;

        doc.roundedRect(margin, currentY, contentWidth, thmHeight, 1, 1, 'FD');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9 * fontSizeMultiplier);
        doc.setTextColor(selectedTheme.primary[0], selectedTheme.primary[1], selectedTheme.primary[2]);
        doc.text(thm.name, margin + 5, currentY + 5);

        doc.setFont('helvetica', 'normal');
        doc.setTextColor(50, 60, 75);
        doc.text(doc.splitTextToSize(thm.statement, contentWidth - 10), margin + 5, currentY + 10);
        
        currentY += thmHeight + 4;

        if (thm.formula) {
          drawEquationBox(thm.formula);
        }

        if (thm.explanation) {
          checkPageBreak(15);
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(8.5 * fontSizeMultiplier);
          doc.setTextColor(100, 100, 100);
          const wrappedExp = doc.splitTextToSize(`Explanation: ${thm.explanation}`, contentWidth - 10);
          doc.text(wrappedExp, margin + 5, currentY);
          currentY += (wrappedExp.length * 4) + 6;
        }

        doc.restoreGraphicsState();
      });
    }

    // --- SOLVED EXAMPLES ---
    if (settings.includeExamples && section.solvedExamples.length > 0) {
      checkPageBreak(15);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11 * fontSizeMultiplier);
      doc.setTextColor(selectedTheme.primary[0], selectedTheme.primary[1], selectedTheme.primary[2]);
      doc.text('Solved University Examples', margin, currentY);
      currentY += 6;

      section.solvedExamples.forEach((ex) => {
        checkPageBreak(40);

        doc.saveGraphicsState();
        doc.setDrawColor(230, 235, 240);
        doc.setFillColor(250, 252, 254);
        doc.setLineWidth(0.25);

        const questLines = doc.splitTextToSize(ex.question, contentWidth - 10);
        const solHeightNeeded = 25 + (ex.solution.length * 5);
        
        doc.roundedRect(margin, currentY, contentWidth, solHeightNeeded, 1.5, 1.5, 'FD');

        // Header
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9 * fontSizeMultiplier);
        doc.setTextColor(selectedTheme.secondary[0], selectedTheme.secondary[1], selectedTheme.secondary[2]);
        doc.text(ex.title, margin + 5, currentY + 5.5);

        // Question
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9 * fontSizeMultiplier);
        doc.setTextColor(40, 50, 60);
        doc.text(questLines, margin + 5, currentY + 11.5);

        let solY = currentY + 13 + (questLines.length * 4.5);

        // Solution list
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8.5 * fontSizeMultiplier);
        doc.setTextColor(90, 100, 110);
        
        ex.solution.forEach((step) => {
          doc.text(`• ${step}`, margin + 7, solY);
          solY += 4.5;
        });

        // Final Boxed Answer
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9 * fontSizeMultiplier);
        doc.setTextColor(selectedTheme.primary[0], selectedTheme.primary[1], selectedTheme.primary[2]);
        doc.text(`Final Answer: ${ex.answer}`, margin + 5, solY + 3);

        currentY += solHeightNeeded + 6;

        if (ex.graph) {
          drawPDFGraph(ex.graph);
        }

        doc.restoreGraphicsState();
      });
    }

    // --- QUICK REVISION CORE TIPS ---
    checkPageBreak(30);
    doc.saveGraphicsState();
    doc.setFillColor(255, 248, 240); // Soft orange/warm note box
    doc.setDrawColor(245, 158, 11);
    doc.setLineWidth(0.3);
    
    const tipTextLines = doc.splitTextToSize(
      `EXAM TIP: ${section.examTips[0] || 'Keep formulas memorized.'} Avoid this common error: ${section.commonMistakes[0] || 'Mixing definitions.'}`,
      contentWidth - 10
    );
    const boxH = (tipTextLines.length * 4.5) + 8;
    
    doc.roundedRect(margin, currentY, contentWidth, boxH, 1, 1, 'FD');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(180, 83, 9);
    doc.text('UNIVERSITY EXAM WARNING', margin + 5, currentY + 5);
    
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(120, 53, 4);
    doc.text(tipTextLines, margin + 5, currentY + 10);
    
    currentY += boxH + 8;
    doc.restoreGraphicsState();

    // Add a subtle spacing page divider
    currentY += 2;
  });

  // --- REVISION SHEET & UNIVERSITY QUESTIONS ---
  if (settings.includeQuestions) {
    checkPageBreak(40);
    
    // Record Appendix A start in index
    indexEntries.push({
      title: 'Appendix A: University Exam Preparation',
      page: pageNumber
    });

    doc.saveGraphicsState();
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13 * fontSizeMultiplier);
    doc.setTextColor(selectedTheme.primary[0], selectedTheme.primary[1], selectedTheme.primary[2]);
    doc.text('APPENDIX: UNIVERSITY EXAM PREPARATION', margin, currentY);
    currentY += 7;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9 * fontSizeMultiplier);
    doc.setTextColor(80, 80, 80);
    doc.text('Master these frequently asked exam questions from top engineering universities:', margin, currentY);
    currentY += 6;

    let questCounter = 1;
    notes.forEach((section) => {
      section.universityQuestions.forEach((q) => {
        checkPageBreak(15);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8.5 * fontSizeMultiplier);
        doc.setTextColor(selectedTheme.secondary[0], selectedTheme.secondary[1], selectedTheme.secondary[2]);
        doc.text(`[${q.type}] Q${questCounter++}:`, margin, currentY);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9 * fontSizeMultiplier);
        doc.setTextColor(40, 50, 60);
        const wrappedQ = doc.splitTextToSize(q.question, contentWidth - 25);
        doc.text(wrappedQ, margin + 22, currentY);
        
        currentY += (wrappedQ.length * 4.5) + 3;
      });
    });

    doc.restoreGraphicsState();
  }

  // --- INTERACTIVE EVALUATION QUIZ ---
  if (settings.includeQuiz && questions && questions.length > 0) {
    checkPageBreak(40);
    
    // Record Appendix B start in index
    indexEntries.push({
      title: 'Appendix B: Academic Self-Assessment Quiz',
      page: pageNumber
    });

    doc.saveGraphicsState();
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13 * fontSizeMultiplier);
    doc.setTextColor(selectedTheme.primary[0], selectedTheme.primary[1], selectedTheme.primary[2]);
    doc.text('APPENDIX B: ACADEMIC SELF-ASSESSMENT QUIZ', margin, currentY);
    currentY += 7;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9 * fontSizeMultiplier);
    doc.setTextColor(80, 80, 80);
    doc.text('Test your understanding of the course syllabus with this dynamic exercise set:', margin, currentY);
    currentY += 6;

    questions.forEach((q, qIdx) => {
      checkPageBreak(35);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9 * fontSizeMultiplier);
      doc.setTextColor(selectedTheme.primary[0], selectedTheme.primary[1], selectedTheme.primary[2]);
      
      const wrappedQ = doc.splitTextToSize(`Question ${qIdx + 1}: ${q.question}`, contentWidth - 10);
      doc.text(wrappedQ, margin, currentY);
      currentY += (wrappedQ.length * 4.5) + 3;

      if (q.options && q.options.length > 0) {
        q.options.forEach((opt, optIdx) => {
          checkPageBreak(12);
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(8.5 * fontSizeMultiplier);
          doc.setTextColor(60, 60, 60);
          doc.text(`[  ]  ${opt}`, margin + 5, currentY);
          currentY += 5;
        });
      }
      currentY += 4;
    });

    doc.restoreGraphicsState();
  }

  // --- DRAW TABLE OF CONTENTS (INDEX) ---
  doc.setPage(tocPageNumber);
  
  doc.saveGraphicsState();
  
  // Clean background of Table of Contents page (in case of drawings/decorations overlap)
  doc.setFillColor(255, 255, 255);
  doc.rect(margin - 2, 22, contentWidth + 4, pageHeight - 40, 'F');
  
  // Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(selectedTheme.primary[0], selectedTheme.primary[1], selectedTheme.primary[2]);
  doc.text('TABLE OF CONTENTS & ACTIVE INDEX', margin, 30);
  
  // Subtitle
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(110, 110, 110);
  doc.text('Smart Book Navigation — Click on any topic to jump directly to its page.', margin, 36);
  
  // Divider line
  doc.setDrawColor(selectedTheme.secondary[0], selectedTheme.secondary[1], selectedTheme.secondary[2]);
  doc.setLineWidth(0.4);
  doc.line(margin, 40, pageWidth - margin, 40);
  
  let tocY = 48;
  doc.setFontSize(9.5);
  
  indexEntries.forEach((entry) => {
    // Limit to make sure it doesn't overflow page bounds
    if (tocY > pageHeight - 25) return;
    
    const isSubTopic = entry.title.startsWith('   •');
    
    if (isSubTopic) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(90, 100, 110);
    } else {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(selectedTheme.primary[0], selectedTheme.primary[1], selectedTheme.primary[2]);
    }
    
    // Topic text
    doc.text(entry.title, margin, tocY);
    
    // Measure text width to fill dots
    const titleWidth = doc.getTextWidth(entry.title);
    const pageStr = String(entry.page);
    const pageNumWidth = doc.getTextWidth(pageStr);
    
    const dotsStartX = margin + titleWidth + 3;
    const dotsEndX = pageWidth - margin - pageNumWidth - 3;
    
    doc.setFont('courier', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(190, 190, 190);
    
    const singleDotWidth = doc.getTextWidth('.');
    const availableWidth = dotsEndX - dotsStartX;
    const numDots = Math.floor(availableWidth / singleDotWidth);
    if (numDots > 0) {
      doc.text('.'.repeat(numDots), dotsStartX, tocY);
    }
    
    // Page number text
    if (isSubTopic) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(90, 100, 110);
    } else {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(selectedTheme.primary[0], selectedTheme.primary[1], selectedTheme.primary[2]);
    }
    doc.text(pageStr, pageWidth - margin, tocY, { align: 'right' });
    
    // CLICKABLE ACTIVE LINK!
    doc.link(margin, tocY - 3.5, pageWidth - (margin * 2), 5, { pageNumber: entry.page });
    
    tocY += isSubTopic ? 5.2 : 7.2;
  });
  
  doc.restoreGraphicsState();

  // Final count check for page footers
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    // Overwrite the footer placeholder "Page X" with "Page X of Y"
    doc.saveGraphicsState();
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(120, 120, 120);
    // Draw the final right page alignment
    if (i > 1 || !settings.includeCover) {
      doc.setFillColor(255, 255, 255); // Clear potential old text area
      doc.rect(pageWidth - margin - 20, pageHeight - 12, 20, 6, 'F');
      doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin, pageHeight - 10, { align: 'right' });
    }
    doc.restoreGraphicsState();
  }

  return doc;
}
