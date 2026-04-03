// src/lib/pdf-utils.ts
import jsPDF from 'jspdf';

interface TriviaQuestion {
  question: string;
  answer: string;
}

interface TriviaData {
  slug: string;
  title: string;
  levels: {
    [key: string]: TriviaQuestion[];
  };
}

export const exportToPdfDirect = (trivia: TriviaData, fileName: string) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;          // left/right margin (mm)
  const topMargin = 20;       // top margin (mm)
  const bottomMargin = 15;    // space reserved for footer (mm)
  const lineHeight = 7;       // mm per line of text

  // Effective area where content can be placed
  const maxY = pageHeight - bottomMargin;
  let y = topMargin;

  // Helper to add text with automatic page breaks
  const addWrappedText = (text: string, fontSize: number, isBold = false) => {
    doc.setFontSize(fontSize);
    doc.setFont('helvetica', isBold ? 'bold' : 'normal');
    const lines = doc.splitTextToSize(text, pageWidth - margin * 2);
    
    for (const line of lines) {
      if (y + lineHeight > maxY) {
        doc.addPage();
        y = topMargin;
      }
      doc.text(line, margin, y);
      y += lineHeight;
    }
    y += 2; // extra spacing after paragraph
  };

  // ----- Title -----
  addWrappedText(trivia.title || 'Trivia Questions', 20, true);
  y += 5;

  const levelOrder = ['easy', 'medium', 'hard'];
  const sortedLevels = Object.entries(trivia.levels).sort(([a], [b]) => {
    return levelOrder.indexOf(a.toLowerCase()) - levelOrder.indexOf(b.toLowerCase());
  });

  // ----- Questions & Answers -----
  for (const [level, questions] of sortedLevels) {
    // Level header
    addWrappedText(`${level.toUpperCase()} Level (${questions.length} questions)`, 16, true);
    y += 2;

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      // Question
      addWrappedText(`${i + 1}. ${q.question}`, 12, false);
      // Answer (always visible, slightly indented)
      addWrappedText(`   Answer: ${q.answer}`, 10, false);
      y -= 2; // tighten spacing after answer
    }
    y += 5; // space between levels
  }

  // ----- Add footer to every page -----
  const totalPages = doc.getNumberOfPages();
  const footerText = '© triviaah.com';
  const footerY = pageHeight - 8; // 8mm from bottom edge

  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(footerText, pageWidth / 2, footerY, { align: 'center' });
  }

  doc.save(`${fileName}.pdf`);
};