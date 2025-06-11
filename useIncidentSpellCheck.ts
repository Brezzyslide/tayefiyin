import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

interface SpellCheckResponse {
  corrected: string;
  originalLength: number;
  correctedLength: number;
}

export function useIncidentSpellCheck() {
  const { toast } = useToast();
  const [originalText, setOriginalText] = useState<string>("");

  const spellCheckMutation = useMutation({
    mutationFn: async (text: string): Promise<SpellCheckResponse> => {
      const token = localStorage.getItem("token");
      const headers: Record<string, string> = {
        "Content-Type": "application/json"
      };
      
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch("/api/ai-spellcheck/incident", {
        method: "POST",
        headers,
        body: JSON.stringify({ text }),
        credentials: 'include'
      });

      if (!response.ok) {
        let error;
        try {
          error = await response.json();
        } catch {
          error = { error: `Request failed with status ${response.status}` };
        }
        throw new Error(error.error || "Spell check failed");
      }

      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        console.error("JSON parse error:", parseError);
        throw new Error("Invalid response format from spell check service");
      }

      return data;
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
    if (!text || text.trim().length < 50) {
      toast({
        title: "Text Too Short",
        description: "Incident narrative must be at least 50 characters for spell checking.",
        variant: "destructive",
      });
      return;
    }

    if (text.length > 5000) {
      toast({
        title: "Text Too Long",
        description: "Incident narrative is too long for spell checking (max 5000 characters).",
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