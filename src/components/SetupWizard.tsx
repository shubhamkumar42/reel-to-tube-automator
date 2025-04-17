import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Instagram, 
  Youtube, 
  ArrowRight, 
  Battery, 
  Bell,
  Settings,
  CheckCircle2 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SetupWizardProps {
  onComplete: (settings: AppSettings) => void;
}

export interface AppSettings {
  instagramUsername: string;
  youtubeTitle: string;
  youtubeDescription: string;
  startOnBoot: boolean;
  batteryOptimized: boolean;
  notifications: boolean;
}

const SetupWizard = ({ onComplete }: SetupWizardProps) => {
  const { toast } = useToast();
  const [step, setStep] = useState<string>("instagram");
  const [settings, setSettings] = useState<AppSettings>({
    instagramUsername: "",
    youtubeTitle: "{instagram_caption}",
    youtubeDescription: "Shared from Instagram\n\n{instagram_caption}\n\n#shorts",
    startOnBoot: true,
    batteryOptimized: true,
    notifications: true,
  });

  const handleChange = (field: keyof AppSettings, value: string | boolean) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNext = () => {
    if (step === "instagram" && !settings.instagramUsername) {
      toast({
        title: "Instagram username required",
        description: "Please enter a valid Instagram username to monitor",
        variant: "destructive",
      });
      return;
    }
    
    if (step === "instagram") setStep("youtube");
    else if (step === "youtube") setStep("settings");
    else if (step === "settings") {
      onComplete(settings);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto rounded-2xl overflow-hidden glassmorphism">
      <div className="bg-gradient-to-r from-purple-600 to-blue-500 p-6">
        <h2 className="text-2xl font-bold text-white text-center">Setup Wizard</h2>
        <p className="text-white/80 text-center mt-2">Configure your automation settings</p>
      </div>

      <Tabs value={step} className="p-6" onValueChange={setStep}>
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="instagram" disabled={step !== "instagram"}>
            <Instagram className="mr-2 h-4 w-4" />
            Instagram
          </TabsTrigger>
          <TabsTrigger value="youtube" disabled={step !== "youtube" && step !== "instagram"}>
            <Youtube className="mr-2 h-4 w-4" />
            YouTube
          </TabsTrigger>
          <TabsTrigger value="settings" disabled={step === "instagram"}>
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="instagram" className="space-y-6">
          <div className="space-y-3">
            <Label htmlFor="instagramUsername">Instagram Username to Monitor</Label>
            <div className="flex items-center">
              <span className="text-muted-foreground mr-2">@</span>
              <Input 
                id="instagramUsername" 
                placeholder="username"
                value={settings.instagramUsername}
                onChange={(e) => handleChange("instagramUsername", e.target.value)}
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Enter the public Instagram account username you want to monitor
            </p>
          </div>
          <Button onClick={handleNext} className="w-full">
            Next <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </TabsContent>

        <TabsContent value="youtube" className="space-y-6">
          <div className="space-y-3">
            <Label htmlFor="youtubeTitle">YouTube Title Template</Label>
            <Input
              id="youtubeTitle"
              placeholder="Video title template"
              value={settings.youtubeTitle}
              onChange={(e) => handleChange("youtubeTitle", e.target.value)}
            />
            <p className="text-sm text-muted-foreground">
              Use {"{instagram_caption}"} to include the Instagram caption
            </p>
          </div>
          
          <div className="space-y-3">
            <Label htmlFor="youtubeDescription">YouTube Description Template</Label>
            <Input
              id="youtubeDescription"
              placeholder="Video description template"
              value={settings.youtubeDescription}
              onChange={(e) => handleChange("youtubeDescription", e.target.value)}
            />
            <p className="text-sm text-muted-foreground">
              Use {"{instagram_caption}"} to include the Instagram caption
            </p>
          </div>
          
          <Button onClick={handleNext} className="w-full">
            Next <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="startOnBoot">Start on Boot</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically start monitoring when device boots
                </p>
              </div>
              <Switch
                id="startOnBoot"
                checked={settings.startOnBoot}
                onCheckedChange={(checked) => handleChange("startOnBoot", checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="batteryOptimized">Battery Optimization</Label>
                <p className="text-sm text-muted-foreground">
                  Optimize battery usage (less frequent checks)
                </p>
              </div>
              <Switch
                id="batteryOptimized"
                checked={settings.batteryOptimized}
                onCheckedChange={(checked) => handleChange("batteryOptimized", checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="notifications">Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive notifications about uploads
                </p>
              </div>
              <Switch
                id="notifications"
                checked={settings.notifications}
                onCheckedChange={(checked) => handleChange("notifications", checked)}
              />
            </div>
          </div>
          
          <Button onClick={handleNext} className="w-full">
            Complete Setup <CheckCircle2 className="ml-2 h-4 w-4" />
          </Button>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SetupWizard;
