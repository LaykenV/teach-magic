import pptxgen from "pptxgenjs";
import { Slide } from "@/types/types";

export async function createPptx(slidesData: Slide[]) {
  const pptx = new pptxgen();

  for (const slideData of slidesData) {
    const slide = pptx.addSlide();
    const title = slideData.slide_title;

    const imgURl = `https://res.cloudinary.com/dgd7hk2xx/image/upload/v1733731610/${slideData.slide_image_url}`
    

    if (slideData.slide_type === "title") {
      // Title Slide
      slide.addText(title, {
        x: 0, y: "70%", w: "100%", h: 1,
        align: "center",
        fontSize: 36,
        bold: true,
      });

      if (slideData.slide_image_url) {
        slide.addImage({
          path: imgURl,
          x: "31%", y: "7%", w: 3.5, h: 3.5,
        });
      }
    } else if (slideData.slide_type === "content") {
      // Content Slide
      // Title at top
      slide.addText(title, {
        x: 0.5,
        y: 0.5,
        w: 9,
        h: 0.5,
        fontSize: 24,
        bold: true,
        color: "000000",
      });

      // Add the image higher (e.g., near top-right)
      if (slideData.slide_image_url) {
        slide.addImage({
          path: imgURl,
          x: 6.5, // right side
          y: 1.0, // slightly lowered from top
          w: 3,
          h: 3,
        });
      }

      // Start paragraphs lower to avoid overlapping with the image
      let yPos = 1.8; // moved down from 1.5 to 3.0
      if ("slide_paragraphs" in slideData && Array.isArray(slideData.slide_paragraphs)) {
        for (const paragraph of slideData.slide_paragraphs) {
          slide.addText(paragraph, {
            x: 0.5,
            y: yPos,
            w: 6, // width reduced to avoid image overlap
            fontSize: 14,
            color: "363636",
          });
          yPos += 1.5;
        }
      }
    } else {
      // Handle other slide types if needed
    }
  }

  await pptx.writeFile({ fileName: `${slidesData[0].slide_title}.pptx` });
}