
import { useState, useEffect } from "react";
import SetupWizard, { AppSettings } from "@/components/SetupWizard";
import Dashboard from "@/components/Dashboard";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useToast } from "@/components/ui/use-toast";

const LOCAL_STORAGE_KEY = "reel-to-tube-settings";

const Index = () => {
  const { toast } = useToast();
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const [settings, setSettings] = useState<AppSettings | null>(null);
  
  useEffect(() => {
    const savedSettings = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        setSettings(parsedSettings);
        setIsSetupComplete(true);
      } catch (err) {
        console.error("Error parsing saved settings:", err);
        localStorage.removeItem(LOCAL_STORAGE_KEY);
      }
    }
  }, []);

  const handleSetupComplete = (newSettings: AppSettings) => {
    setSettings(newSettings);
    setIsSetupComplete(true);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newSettings));
    
    toast({
      title: "Setup Complete",
      description: "Your automation is now running in the background",
    });
  };

  const handleSettingsChange = (updatedSettings: AppSettings) => {
    setSettings(updatedSettings);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedSettings));
  };

  const handleReset = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    setSettings(null);
    setIsSetupComplete(false);
    
    toast({
      title: "Settings Reset",
      description: "All settings have been reset to default values",
    });
  };

  return (
    <ThemeProvider defaultTheme="system">
      <div className="app-container">
        <div className="absolute top-4 right-4 z-10">
          <ThemeToggle />
        </div>
        
        <div className="flex flex-col min-h-screen justify-center">
          <header className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-2 drop-shadow">
              Reel to Tube Automator
            </h1>
            <p className="text-white/80">
              Automatically monitor, download, and upload Instagram Reels to YouTube
            </p>
          </header>

          <div className="w-full max-w-4xl mx-auto px-4">
            {!isSetupComplete || !settings ? (
              <SetupWizard onComplete={handleSetupComplete} />
            ) : (
              <Dashboard 
                settings={settings}
                onSettingsChange={handleSettingsChange}
                onReset={handleReset}
              />
            )}
          </div>
          
          <footer className="mt-auto pt-12 text-center text-white/60 text-sm">
            <p>This application runs in the background via Android's Accessibility Services</p>
          </footer>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default Index;
