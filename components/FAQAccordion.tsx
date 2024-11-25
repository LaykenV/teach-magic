import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion"
  
  const faqItems = [
    {
      question: "How does TeachMagic generate educational content?",
      answer: "TeachMagic uses advanced AI algorithms to create tailored educational content based on your chosen topic. Our system analyzes vast amounts of data to generate accurate and engaging learning materials."
    },
    {
      question: "Can I customize the generated content?",
      answer: "Yes, you can customize the AI-generated content. While our system creates comprehensive materials, you have the flexibility to edit, add, or remove information to suit your specific needs."
    },
    {
      question: "How are the AI-generated images created?",
      answer: "Our AI uses state-of-the-art image generation technology to create unique, relevant images for each topic. These images are designed to complement and illustrate the content, enhancing visual learning."
    },
    {
      question: "Is the content suitable for all learning levels?",
      answer: "Yes, TeachMagic adapts the content to suit various learning levels. When generating materials, you can specify the intended level, and our AI will adjust the complexity and presentation of the information accordingly."
    },
    {
      question: "How do the interactive knowledge checks work?",
      answer: "After generating learning materials, our AI automatically creates questions based on the content. These knowledge checks help reinforce learning and allow users to test their understanding of the material."
    }
  ];
  
  export const FAQAccordion: React.FC = () => (
    <Accordion type="single" collapsible className="w-full max-w-3xl mx-auto">
      {faqItems.map((item, index) => (
        <AccordionItem key={index} value={`item-${index}`}>
          <AccordionTrigger>{item.question}</AccordionTrigger>
          <AccordionContent>{item.answer}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
  
  