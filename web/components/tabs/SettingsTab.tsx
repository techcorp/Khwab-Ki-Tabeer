"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Settings, Globe, Info, Shield, Mail } from "lucide-react";

export function SettingsTab() {
  const { t, language, setLanguage, isRTL } = useLanguage();

  return (
    <div className="space-y-4">
      {/* Language Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary">
            <Globe className="w-5 h-5" />
            {t("language")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup value={language} onValueChange={(value) => setLanguage(value as "en" | "ur")}>
            <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-secondary/50 transition-colors">
              <RadioGroupItem value="en" id="english" />
              <Label htmlFor="english" className="flex-1 cursor-pointer">
                {t("english")}
              </Label>
            </div>
            <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-secondary/50 transition-colors">
              <RadioGroupItem value="ur" id="urdu" />
              <Label htmlFor="urdu" className="flex-1 cursor-pointer">
                {t("urdu")}
              </Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* About */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary">
            <Info className="w-5 h-5" />
            {t("aboutTitle")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between py-2 border-b border-border">
            <span className="text-muted-foreground">{t("version")}</span>
            <span className="font-medium">1.0.0</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-border">
            <span className="text-muted-foreground">{t("developer")}</span>
            <span className="font-medium">Aikafanda</span>
          </div>
        </CardContent>
      </Card>

      {/* Disclaimer */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary">
            <Shield className="w-5 h-5" />
            {t("disclaimer")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className={`text-sm text-muted-foreground leading-relaxed ${isRTL ? "text-right" : ""}`} dir={isRTL ? "rtl" : "ltr"}>
            {t("disclaimerText")}
          </p>
        </CardContent>
      </Card>

      {/* AdMob Info (for reference) */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary">
            <Settings className="w-5 h-5" />
            App Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-xs text-muted-foreground">
          <p><strong>Ollama URL:</strong> ollama.aikafanda.com</p>
          <p><strong>AdMob App ID:</strong> ca-app-pub-1781167680002439~8352490439</p>
          <p><strong>Banner Ad:</strong> ca-app-pub-1781167680002439/7970358810</p>
          <p><strong>Interstitial Ad:</strong> ca-app-pub-1781167680002439/4494148230</p>
        </CardContent>
      </Card>
    </div>
  );
}
