  // Define the slide types
  export type TitleSlide = {
    slide_type: string;
    slide_title: string;
    slide_image_prompt: string;
    slide_image_url?: string | null; 
  };

  export type ContentSlide = {
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

  type Question = {
    slide_type: string;
    slide_title: string;
    question: string;
    answer_choices: AnswerChoice[];
  };

   export type Slide = TitleSlide | ContentSlide;

   export type Quiz = Question[];

  export interface UserEntry {
    id: string;
    email: string;
    name: string;
  }

  export interface CreationEntry {
    user_id: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    slides: any[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    quiz: any[];
    age_group: string;
  }

  export type Creation = {
    id: string;
    user_id: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    slides: Slide[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    quiz: Quiz;
    created_at: Date;
    age_group: string;
  }




  
