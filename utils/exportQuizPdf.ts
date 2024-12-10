// pages/quiz-export.js (example page)
import { Creation } from '@/types/types';

export async function exportQuizPdf(quizData: Creation) {
  // Check if we are in the browser environment
  if (typeof window === 'undefined') {
    // Do nothing on the server
    return;
  }

  // Dynamically import pdfMake on the client only
  const pdfMakeModule = await import('pdfmake/build/pdfmake');
  const vfsFonts = await import('pdfmake/build/vfs_fonts');

  const pdfMake = pdfMakeModule.default;
  
  const { slides, quiz } = quizData;
  let quizTitle = "Quiz";
  if (slides && slides.length > 0) {
    const titleSlide = slides.find(slide => slide.slide_type === 'title');
    if (titleSlide && titleSlide.slide_title) {
      quizTitle = `${titleSlide.slide_title} Quiz`;
    }
  }

  const docContent = [
    { text: quizTitle, style: 'header', alignment: 'center', margin: [0,0,0,20] },
    { text: `Age Group: ${quizData.age_group || 'N/A'}`, style: 'subheader', margin: [0,0,0,10] },
    { text: 'Instructions: Please read each question carefully and select the best answer.', margin: [0,0,0,20] }
  ];

  quiz.forEach((questionObj, index) => {
    docContent.push(
      { text: `Question ${index + 1}: ${questionObj.question}`, style: 'question', margin: [0,10,0,5] }
    );
    questionObj.answer_choices.forEach((choice) => {
      docContent.push({
        text: `   ( ) ${choice.answer_text}`,
        margin: [0,0,0,15]
      });
    });
  });

  const docDefinition = {
    content: docContent,
    styles: {
      header: { fontSize: 20, bold: true },
      subheader: { fontSize: 10, italics: true },
      question: { fontSize: 10, bold: true }
    },
    defaultStyle: { fontSize: 11 }
  };

  console.log(docDefinition)

  // Only run this in the browser
  if (typeof window !== 'undefined') {
    pdfMake?.createPdf(docDefinition).open();
    //pdfDoc.download(`${quizTitle.replace(/\s+/g, '_')}.pdf`);
  }
}