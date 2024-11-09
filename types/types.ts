  // Define the slide types
  type TitleSlide = {
    slide_type: string;
    slide_title: string;
    slide_image_prompt: string;
    slide_image_url?: string | null; 
  };

  type ContentSlide = {
    slide_type: string;
    slide_title: string;
    slide_paragraphs: string[];
    slide_image_prompt: string;
    slide_image_url?: string | null; 
  };

  type AnswerChoice = {
    answer_text: string;
    correct: boolean;
  };

  type QuestionSlide = {
    slide_type: string;
    slide_title: string;
    question: string;
    answer_choices: AnswerChoice[];
  };

   export type Slide = TitleSlide | ContentSlide | QuestionSlide;

   export type SlideWithImage = TitleSlide | ContentSlide;


  export interface UserEntry {
    id: string;
    email: string;
    name: string;
  }

  export interface CreationEntry {
    user_id: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    slides: any[];
  }




  
