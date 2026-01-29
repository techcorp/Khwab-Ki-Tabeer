"use client";

import React from "react"

import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { dreamTopics, type DreamTopic } from "@/data/encyclopedia";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { 
  Book, 
  Search, 
  ChevronRight, 
  ArrowLeft,
  Droplets,
  Plane,
  AlertCircle,
  Moon,
  Heart,
  Smile,
  Star,
  BookOpen,
  Home,
  Banknote,
  Flame,
  PersonStanding,
  Cat,
  Frown,
  Baby,
  MapPin,
  Leaf,
  Sun,
  ArrowDown,
  GraduationCap,
  Car
} from "lucide-react";

const iconMap: Record<string, React.ReactNode> = {
  water: <Droplets className="w-5 h-5" />,
  airplane: <Plane className="w-5 h-5" />,
  "alert-circle": <AlertCircle className="w-5 h-5" />,
  moon: <Moon className="w-5 h-5" />,
  heart: <Heart className="w-5 h-5" />,
  medical: <Smile className="w-5 h-5" />,
  star: <Star className="w-5 h-5" />,
  book: <BookOpen className="w-5 h-5" />,
  home: <Home className="w-5 h-5" />,
  cash: <Banknote className="w-5 h-5" />,
  flame: <Flame className="w-5 h-5" />,
  walk: <PersonStanding className="w-5 h-5" />,
  paw: <Cat className="w-5 h-5" />,
  sad: <Frown className="w-5 h-5" />,
  leaf: <Leaf className="w-5 h-5" />,
  sunny: <Sun className="w-5 h-5" />,
  "arrow-down": <ArrowDown className="w-5 h-5" />,
  school: <GraduationCap className="w-5 h-5" />,
  car: <Car className="w-5 h-5" />,
};

export function EncyclopediaTab() {
  const { t, language, isRTL } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTopic, setSelectedTopic] = useState<DreamTopic | null>(null);

  const filteredTopics = dreamTopics.filter((topic) => {
    const query = searchQuery.toLowerCase();
    return (
      topic.titleEn.toLowerCase().includes(query) ||
      topic.titleUr.includes(searchQuery) ||
      topic.descriptionEn.toLowerCase().includes(query) ||
      topic.descriptionUr.includes(searchQuery)
    );
  });

  if (selectedTopic) {
    const title = language === "ur" ? selectedTopic.titleUr : selectedTopic.titleEn;
    const description = language === "ur" ? selectedTopic.descriptionUr : selectedTopic.descriptionEn;
    const meaning = language === "ur" ? selectedTopic.meaningUr : selectedTopic.meaningEn;

    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => setSelectedTopic(null)}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                {iconMap[selectedTopic.icon] || <Book className="w-5 h-5" />}
              </div>
              <div>
                <CardTitle className="text-primary">{title}</CardTitle>
                <p className="text-sm text-muted-foreground">{description}</p>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Badge variant="secondary" className="mb-3">{t("commonMeaning")}</Badge>
              <p className={`text-sm leading-relaxed ${isRTL ? "text-right" : ""}`} dir={isRTL ? "rtl" : "ltr"}>
                {meaning}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary">
            <Book className="w-5 h-5" />
            {t("encyclopediaTitle")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("searchPlaceholder")}
              className="pl-10"
              dir={isRTL ? "rtl" : "ltr"}
            />
          </div>

          {filteredTopics.length === 0 ? (
            <div className="text-center py-12">
              <Search className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground">{t("noResults")}</p>
            </div>
          ) : (
            <ScrollArea className="h-[400px] pr-4">
              <div className="grid gap-3">
                {filteredTopics.map((topic) => {
                  const title = language === "ur" ? topic.titleUr : topic.titleEn;
                  const description = language === "ur" ? topic.descriptionUr : topic.descriptionEn;
                  
                  return (
                    <div
                      key={topic.id}
                      onClick={() => setSelectedTopic(topic)}
                      className="p-4 rounded-lg bg-secondary/30 hover:bg-secondary/50 cursor-pointer transition-colors group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                          {iconMap[topic.icon] || <Book className="w-5 h-5" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`font-medium ${isRTL ? "text-right" : ""}`} dir={isRTL ? "rtl" : "ltr"}>
                            {title}
                          </p>
                          <p className={`text-xs text-muted-foreground truncate ${isRTL ? "text-right" : ""}`} dir={isRTL ? "rtl" : "ltr"}>
                            {description}
                          </p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors flex-shrink-0" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
