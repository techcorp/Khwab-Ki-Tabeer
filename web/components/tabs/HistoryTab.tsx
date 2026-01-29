"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { getHistory, deleteInterpretation, clearHistory, type DreamInterpretation } from "@/services/storage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { History, Trash2, ChevronRight, Clock, FileText } from "lucide-react";

export function HistoryTab() {
  const { t, isRTL } = useLanguage();
  const [history, setHistory] = useState<DreamInterpretation[]>([]);
  const [selectedItem, setSelectedItem] = useState<DreamInterpretation | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    const data = await getHistory();
    setHistory(data);
  };

  const handleDelete = async (id: string) => {
    await deleteInterpretation(id);
    await loadHistory();
    setDeleteId(null);
    if (selectedItem?.id === id) {
      setSelectedItem(null);
    }
  };

  const handleClearAll = async () => {
    await clearHistory();
    await loadHistory();
    setShowClearConfirm(false);
    setSelectedItem(null);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (selectedItem) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-primary flex items-center gap-2">
              <FileText className="w-5 h-5" />
              {t("interpretationTitle")}
            </CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setSelectedItem(null)}>
                {t("cancel")}
              </Button>
              <Button 
                variant="destructive" 
                size="sm" 
                onClick={() => setDeleteId(selectedItem.id)}
              >
                <Trash2 className="w-4 h-4 mr-1" />
                {t("delete")}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium text-sm text-muted-foreground mb-2">Dream</h4>
            <p className={`text-sm bg-secondary/50 p-3 rounded-lg ${isRTL ? "text-right" : ""}`} dir={isRTL ? "rtl" : "ltr"}>
              {selectedItem.dream}
            </p>
          </div>
          <div>
            <h4 className="font-medium text-sm text-muted-foreground mb-2">{t("interpretationTitle")}</h4>
            <p className={`text-sm whitespace-pre-wrap leading-relaxed ${isRTL ? "text-right" : ""}`} dir={isRTL ? "rtl" : "ltr"}>
              {selectedItem.interpretation}
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="w-3 h-3" />
            {formatDate(selectedItem.timestamp)}
          </div>
        </CardContent>

        <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t("deleteConfirm")}</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
              <AlertDialogAction onClick={() => deleteId && handleDelete(deleteId)}>
                {t("delete")}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-primary">
              <History className="w-5 h-5" />
              {t("historyTitle")}
            </CardTitle>
            {history.length > 0 && (
              <Button variant="outline" size="sm" onClick={() => setShowClearConfirm(true)}>
                <Trash2 className="w-4 h-4 mr-1" />
                {t("clearAll")}
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {history.length === 0 ? (
            <div className="text-center py-12">
              <History className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground">{t("noHistory")}</p>
              <p className="text-sm text-muted-foreground/70">{t("noHistorySubtitle")}</p>
            </div>
          ) : (
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-3">
                {history.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setSelectedItem(item)}
                    className="p-4 rounded-lg bg-secondary/30 hover:bg-secondary/50 cursor-pointer transition-colors group"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium truncate ${isRTL ? "text-right" : ""}`} dir={isRTL ? "rtl" : "ltr"}>
                          {item.dream.slice(0, 100)}
                          {item.dream.length > 100 && "..."}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatDate(item.timestamp)}
                        </p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors flex-shrink-0" />
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={showClearConfirm} onOpenChange={setShowClearConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("clearAllConfirm")}</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete all saved interpretations.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
            <AlertDialogAction onClick={handleClearAll}>{t("clearAll")}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
