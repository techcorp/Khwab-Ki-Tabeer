"use client";

import { useState, useRef } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { interpretDream } from "@/services/ollama";
import { saveInterpretation } from "@/services/storage";
import { ENV } from "@/config/env";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Send, X, RotateCcw, Save, Check, Sparkles, AlertCircle } from "lucide-react";

export function HomeTab() {
  const { t, language, isRTL } = useLanguage();
  const [dream, setDream] = useState("");
  const [interpretation, setInterpretation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const handleInterpret = async () => {
    if (!dream.trim()) {
      setError(t("emptyDream"));
      return;
    }

    if (dream.length > ENV.MAX_DREAM_LENGTH) {
      setError(t("dreamTooLong"));
      return;
    }

    setError(null);
    setInterpretation("");
    setIsLoading(true);
    setIsSaved(false);

    abortControllerRef.current = new AbortController();

    try {
      await interpretDream({
        dream,
        language,
        onChunk: (chunk) => {
          setInterpretation((prev) => prev + chunk);
        },
        signal: abortControllerRef.current.signal,
      });
    } catch (err) {
      if (err instanceof Error) {
        if (err.message === "CANCELLED") {
          // User cancelled, don't show error
          return;
        }
        if (err.message === "CLOUDFLARE_BLOCKED") {
          setError(t("cloudflareError"));
        } else if (err.message.startsWith("HTTP_ERROR")) {
          setError(t("serverError"));
        } else {
          setError(t("networkError"));
        }
      } else {
        setError(t("networkError"));
      }
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  const handleCancel = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!interpretation) return;
    try {
      await saveInterpretation(dream, interpretation, language);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    } catch {
      setError("Failed to save interpretation");
    }
  };

  const handleNewDream = () => {
    setDream("");
    setInterpretation("");
    setError(null);
    setIsSaved(false);
  };

  const charCount = dream.length;
  const charLimit = ENV.MAX_DREAM_LENGTH;
  const isOverLimit = charCount > charLimit;

  return (
    <div className="space-y-6">
      {/* Welcome Card */}
      <Card className="border-primary/20 bg-gradient-to-br from-card to-secondary/20">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-primary">
            <Sparkles className="w-5 h-5" />
            {t("welcomeTitle")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">{t("welcomeSubtitle")}</p>
        </CardContent>
      </Card>

      {/* Dream Input */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="relative">
              <Textarea
                value={dream}
                onChange={(e) => setDream(e.target.value)}
                placeholder={t("dreamPlaceholder")}
                className={`min-h-32 resize-none ${isRTL ? "text-right" : ""} ${isOverLimit ? "border-destructive" : ""}`}
                disabled={isLoading}
                dir={isRTL ? "rtl" : "ltr"}
              />
              <div className={`absolute bottom-2 ${isRTL ? "left-2" : "right-2"} text-xs ${isOverLimit ? "text-destructive" : "text-muted-foreground"}`}>
                {charCount}/{charLimit}
              </div>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="flex gap-2">
              {isLoading ? (
                <Button onClick={handleCancel} variant="destructive" className="flex-1">
                  <X className="w-4 h-4 mr-2" />
                  {t("cancelButton")}
                </Button>
              ) : (
                <Button onClick={handleInterpret} className="flex-1" disabled={!dream.trim() || isOverLimit}>
                  <Send className="w-4 h-4 mr-2" />
                  {t("interpretButton")}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Interpretation Result */}
      {(interpretation || isLoading) && (
        <Card className="border-primary/20">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-primary flex items-center gap-2">
                {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                {t("interpretationTitle")}
              </CardTitle>
              {interpretation && !isLoading && (
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={handleSave} disabled={isSaved}>
                    {isSaved ? (
                      <>
                        <Check className="w-4 h-4 mr-1" />
                        {t("saved")}
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-1" />
                        {t("saveInterpretation")}
                      </>
                    )}
                  </Button>
                  <Button size="sm" variant="outline" onClick={handleNewDream}>
                    <RotateCcw className="w-4 h-4 mr-1" />
                    {t("newDream")}
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div 
              className={`prose prose-sm max-w-none dark:prose-invert ${isRTL ? "text-right" : ""}`}
              dir={isRTL ? "rtl" : "ltr"}
            >
              {interpretation ? (
                <p className="whitespace-pre-wrap leading-relaxed">{interpretation}</p>
              ) : (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{t("interpreting")}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
