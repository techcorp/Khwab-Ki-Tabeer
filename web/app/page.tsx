"use client";

import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Home, History, Book, Heart, Settings, Moon, Star } from "lucide-react";
import { HomeTab } from "@/components/tabs/HomeTab";
import { HistoryTab } from "@/components/tabs/HistoryTab";
import { EncyclopediaTab } from "@/components/tabs/EncyclopediaTab";
import { DuasTab } from "@/components/tabs/DuasTab";
import { SettingsTab } from "@/components/tabs/SettingsTab";

export default function Page() {
  const { t, isRTL } = useLanguage();
  const [activeTab, setActiveTab] = useState("home");

  return (
    <div className={`min-h-screen bg-background ${isRTL ? "rtl" : ""}`}>
      {/* Header */}
      <header className="gradient-islamic text-primary-foreground py-4 px-4 shadow-lg">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <Moon className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold">{t("appName")}</h1>
              <p className="text-sm opacity-90">Islamic Dream Interpretation</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-accent" fill="currentColor" />
            <Star className="w-4 h-4 text-accent" fill="currentColor" />
            <Star className="w-4 h-4 text-accent" fill="currentColor" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-6 bg-secondary/50">
            <TabsTrigger value="home" className="flex flex-col sm:flex-row items-center gap-1 py-3">
              <Home className="w-4 h-4" />
              <span className="text-xs sm:text-sm">{t("home")}</span>
            </TabsTrigger>
            <TabsTrigger value="history" className="flex flex-col sm:flex-row items-center gap-1 py-3">
              <History className="w-4 h-4" />
              <span className="text-xs sm:text-sm">{t("history")}</span>
            </TabsTrigger>
            <TabsTrigger value="encyclopedia" className="flex flex-col sm:flex-row items-center gap-1 py-3">
              <Book className="w-4 h-4" />
              <span className="text-xs sm:text-sm">{t("encyclopedia")}</span>
            </TabsTrigger>
            <TabsTrigger value="duas" className="flex flex-col sm:flex-row items-center gap-1 py-3">
              <Heart className="w-4 h-4" />
              <span className="text-xs sm:text-sm">{t("duas")}</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex flex-col sm:flex-row items-center gap-1 py-3">
              <Settings className="w-4 h-4" />
              <span className="text-xs sm:text-sm">{t("settings")}</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="home" className="mt-0">
            <HomeTab />
          </TabsContent>
          <TabsContent value="history" className="mt-0">
            <HistoryTab />
          </TabsContent>
          <TabsContent value="encyclopedia" className="mt-0">
            <EncyclopediaTab />
          </TabsContent>
          <TabsContent value="duas" className="mt-0">
            <DuasTab />
          </TabsContent>
          <TabsContent value="settings" className="mt-0">
            <SettingsTab />
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer Disclaimer */}
      <footer className="max-w-4xl mx-auto px-4 py-6 text-center">
        <p className="text-xs text-muted-foreground">
          {t("disclaimerText")}
        </p>
      </footer>
    </div>
  );
}
