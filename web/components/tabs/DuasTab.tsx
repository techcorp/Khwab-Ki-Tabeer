"use client";

import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { duas, duaCategories, type Dua } from "@/data/duas";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, ArrowLeft, BookOpen, Clock, Quote } from "lucide-react";

export function DuasTab() {
  const { t, language, isRTL } = useLanguage();
  const [selectedDua, setSelectedDua] = useState<Dua | null>(null);
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredDuas = activeCategory === "all" 
    ? duas 
    : duas.filter((dua) => dua.category === activeCategory);

  if (selectedDua) {
    const title = language === "ur" ? selectedDua.titleUr : selectedDua.title;
    const category = language === "ur" ? selectedDua.categoryUr : selectedDua.category;
    const translation = language === "ur" ? selectedDua.translationUr : selectedDua.translationEn;
    const whenToRead = language === "ur" ? selectedDua.whenToReadUr : selectedDua.whenToRead;

    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => setSelectedDua(null)}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <Badge variant="secondary" className="mb-1">{category}</Badge>
              <CardTitle className="text-primary">{title}</CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Arabic */}
          <div className="bg-primary/5 p-6 rounded-lg text-center">
            <p className="arabic-text text-2xl text-primary leading-loose" dir="rtl">
              {selectedDua.arabic}
            </p>
          </div>

          {/* Transliteration */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Quote className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">{t("transliteration")}</span>
            </div>
            <p className="text-sm italic text-foreground/80">{selectedDua.transliteration}</p>
          </div>

          {/* Translation */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">{t("translation")}</span>
            </div>
            <p className={`text-sm ${isRTL ? "text-right" : ""}`} dir={isRTL ? "rtl" : "ltr"}>
              {translation}
            </p>
          </div>

          {/* When to Read */}
          <div className="bg-secondary/50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">{t("whenToRead")}</span>
            </div>
            <p className={`text-sm ${isRTL ? "text-right" : ""}`} dir={isRTL ? "rtl" : "ltr"}>
              {whenToRead}
            </p>
          </div>

          {/* Reference */}
          {selectedDua.reference && (
            <p className="text-xs text-muted-foreground text-center">
              Source: {selectedDua.reference}
            </p>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary">
            <Heart className="w-5 h-5" />
            {t("duasTitle")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
            <ScrollArea className="w-full pb-2">
              <TabsList className="inline-flex w-max h-auto flex-wrap gap-1 bg-transparent p-0 mb-4">
                <TabsTrigger 
                  value="all" 
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-3 py-1.5 text-xs rounded-full"
                >
                  {language === "ur" ? "سب" : "All"}
                </TabsTrigger>
                {duaCategories.map((cat) => (
                  <TabsTrigger 
                    key={cat.en} 
                    value={cat.en}
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-3 py-1.5 text-xs rounded-full whitespace-nowrap"
                  >
                    {language === "ur" ? cat.ur : cat.en}
                  </TabsTrigger>
                ))}
              </TabsList>
            </ScrollArea>

            <TabsContent value={activeCategory} className="mt-0">
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-3">
                  {filteredDuas.map((dua) => {
                    const title = language === "ur" ? dua.titleUr : dua.title;
                    const category = language === "ur" ? dua.categoryUr : dua.category;
                    
                    return (
                      <div
                        key={dua.id}
                        onClick={() => setSelectedDua(dua)}
                        className="p-4 rounded-lg bg-secondary/30 hover:bg-secondary/50 cursor-pointer transition-colors group"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <Badge variant="outline" className="mb-2 text-xs">{category}</Badge>
                            <p className={`font-medium ${isRTL ? "text-right" : ""}`} dir={isRTL ? "rtl" : "ltr"}>
                              {title}
                            </p>
                            <p className="text-sm text-primary/80 arabic-text mt-2 line-clamp-1" dir="rtl">
                              {dua.arabic}
                            </p>
                          </div>
                          <Heart className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
