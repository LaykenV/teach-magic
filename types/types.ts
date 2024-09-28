 export interface Slide {
    slide_title: string;
    slide_paragraphs: string[];
    slide_image_prompt?: string;
  }
  
 export interface SlideViewerProps {
    slides: Slide[];
  }