 export interface Slide {
    slide_title: string;
    slide_paragraphs: string[];
    slide_image_prompt?: string;
    slide_image_url?: string;
    slide_notes: string;
  }

  export interface UserEntry {
    id: string;
    email: string;
    name: string;
  }

  export interface CreationEntry {
    user_id: string;
    slides: any[];
  }




  
