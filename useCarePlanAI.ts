import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

interface SectionAIResponse {
  generatedContent: string;
  success: boolean;
  sectionType: string;
}

interface AboutMeInput {
  point: string;
  order: number;
}

export function useCarePlanAI() {
  const { toast } = useToast();
  const [correctedText, setCorrectedText] = useState<string>("");
  const [hasChanges, setHasChanges] = useState<boolean>(false);
  const [currentSection, setCurrentSection] = useState<string>("");

  const aiMutation = useMutation({
    mutationFn: async ({ sectionType, userInput, diagnosis, clientName }: { sectionType: string, userInput: any, diagnosis?: string, clientName?: string }): Promise<SectionAIResponse> => {
      let endpoint = "";
      let body: any = {};

      if (sectionType === "aboutme") {
        endpoint = "/api/care-support-plans/generate-about-me-direct";
        body = { userPoints: userInput, diagnosis, clientName };
      } else {
        endpoint = "/api/care-support-plans/generate-section-direct";
        body = { sectionType, userInput, diagnosis, clientName };
      }

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "AI generation failed");
      }

      const result = await response.json();
      
      if (sectionType === "aboutme") {
        return { 
          generatedContent: result.aboutMeElaboration, 
          success: result.success, 
          sectionType: "aboutme" 
        };
      }
      
      return result;
    },
    onSuccess: (data) => {
      setCorrectedText(data.generatedContent);
      setCurrentSection(data.sectionType);
      setHasChanges(true);
      
      const sectionNames = {
        aboutme: "About Me",
        goals: "Support Goals",
        adl: "ADL (Activities of Daily Living)",
        communication: "Communication Strategy",
        routine: "Structure and Routine",
        mealtime: "Mealtime Risk Assessment",
        emergency: "Emergency Protocols"
      };
      
      toast({
        title: "AI Generation Complete",
        description: `${sectionNames[data.sectionType as keyof typeof sectionNames]} section has been enhanced with AI assistance.`,
      });
    },
    onError: (error) => {
      console.error("AI generation error:", error);
      toast({
        title: "AI Generation Failed",
        description: error.message || "Unable to generate AI content. Please try again.",
        variant: "destructive",
      });
    },
  });

  const generateSection = (sectionType: string, userInput: any, diagnosis?: string, clientName?: string) => {
    if (!userInput) {
      toast({
        title: "No Input Provided",
        description: "Please provide input before using AI assistance.",
        variant: "destructive",
      });
      return;
    }

    if (sectionType === "aboutme") {
      const validPoints = userInput.filter((point: AboutMeInput) => point.point.trim().length > 0);
      if (validPoints.length === 0) {
        toast({
          title: "Empty Points",
          description: "Please ensure all points have content before using AI assistance.",
          variant: "destructive",
        });
        return;
      }
      aiMutation.mutate({ sectionType, userInput: validPoints, diagnosis, clientName });
    } else {
      if (typeof userInput === "string" && userInput.trim().length === 0) {
        toast({
          title: "Empty Input",
          description: "Please provide content before using AI assistance.",
          variant: "destructive",
        });
        return;
      }
      aiMutation.mutate({ sectionType, userInput, diagnosis, clientName });
    }
  };

  const reset = () => {
    setCorrectedText("");
    setHasChanges(false);
    setCurrentSection("");
  };

  return {
    generateSection,
    isGenerating: aiMutation.isPending,
    correctedText,
    hasChanges,
    currentSection,
    reset,
  };
}