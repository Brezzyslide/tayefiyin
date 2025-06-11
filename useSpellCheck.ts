import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

interface SpellCheckResponse {
  corrected: string;
  originalLength: number;
  correctedLength: number;
}

export function useSpellCheck() {
  const { toast } = useToast();
  const [originalText, setOriginalText] = useState<string>("");

  const spellCheckMutation = useMutation({
    mutationFn: async (text: string): Promise<SpellCheckResponse> => {
      const response = await fetch("/api/ai-spellcheck/case-note", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Spell check failed");
      }

      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Spell Check Complete",
        description: `Reviewed ${data.originalLength} characters. Ready to apply corrections.`,
      });
    },
    onError: (error) => {
      console.error("Spell check error:", error);
      toast({
        title: "Spell Check Failed",
        description: error.message || "Unable to check spelling. Please try again.",
        variant: "destructive",
      });
    },
  });

  const checkSpelling = (text: string) => {
    if (!text || text.trim().length < 100) {
      toast({
        title: "Text Too Short",
        description: "Case note must be at least 100 characters for spell checking.",
        variant: "destructive",
      });
      return;
    }

    if (text.length > 5000) {
      toast({
        title: "Text Too Long",
        description: "Case note is too long for spell checking (max 5000 characters).",
        variant: "destructive",
      });
      return;
    }

    setOriginalText(text);
    spellCheckMutation.mutate(text);
  };

  const hasChanges = (correctedText: string) => {
    return originalText.trim() !== correctedText.trim();
  };

  return {
    checkSpelling,
    isChecking: spellCheckMutation.isPending,
    correctedText: spellCheckMutation.data?.corrected,
    hasChanges: spellCheckMutation.data ? hasChanges(spellCheckMutation.data.corrected) : false,
    error: spellCheckMutation.error,
    reset: () => {
      spellCheckMutation.reset();
      setOriginalText("");
    },
  };
}