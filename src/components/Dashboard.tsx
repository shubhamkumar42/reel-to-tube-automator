
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Instagram, Youtube, Settings, Download, Upload, Clock, Power } from "lucide-react";
import { useToast } from "@/components/ui/toast";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { type AppSettings } from "@/components/SetupWizard";

interface DashboardProps {
  settings: AppSettings;
  onSettingsChange: (settings: AppSettings) => void;
  onReset: () => void;
}

const Dashboard = ({ settings, onSettingsChange, onReset }: DashboardProps) => {
  const { toast } = useToast();
  const [isRunning, setIsRunning] = useState(true);
  const [stats, setStats] = useState({
    lastCheck: new Date().toISOString(),
    videosDownloaded: 0,
    videosUploaded: 0,
    nextCheckIn: "5 minutes"
  });

  useEffect(() => {
    // Simulate periodic updates for the demo
    const interval = setInterval(() => {
      const now = new Date();
      setStats(prev => ({
        ...prev,
        lastCheck: now.toISOString()
      }));
    }, 60000);
    
    return () => clearInterval(interval);
  }, []);

  const handleToggleService = () => {
    setIsRunning(prev => !prev);
    toast({
      title: isRunning ? "Service Stopped" : "Service Started",
      description: isRunning 
        ? "Background monitoring has been disabled" 
        : "Background monitoring is now active"
    });
  };

  const handleSettingChange = (field: keyof AppSettings, value: boolean) => {
    onSettingsChange({
      ...settings,
      [field]: value
    });
    
    toast({
      title: "Setting Updated",
      description: `${field} has been ${value ? "enabled" : "disabled"}`,
    });
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-2xl flex items-center justify-between">
            <div className="flex items-center">
              Status
              <div className={`ml-3 ${isRunning ? 'status-active' : 'status-inactive'}`} />
            </div>
            <Button
              variant={isRunning ? "outline" : "default"}
              size="sm"
              onClick={handleToggleService}
            >
              <Power className="h-4 w-4 mr-2" />
              {isRunning ? "Stop" : "Start"}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Monitoring</p>
              <p className="text-lg font-medium flex items-center">
                <Instagram className="h-4 w-4 mr-2 text-instagram" />
                @{settings.instagramUsername}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Next Check</p>
              <p className="text-lg font-medium flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                {stats.nextCheckIn}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">
              <div className="flex items-center">
                <Download className="h-5 w-5 mr-2" />
                Downloads
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.videosDownloaded}</div>
            <p className="text-sm text-muted-foreground">Total reels downloaded</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">
              <div className="flex items-center">
                <Upload className="h-5 w-5 mr-2" />
                Uploads
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.videosUploaded}</div>
            <p className="text-sm text-muted-foreground">Total videos uploaded to YouTube</p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center">
            <Settings className="h-5 w-5 mr-2" />
            Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Start on Boot</p>
              <p className="text-sm text-muted-foreground">Automatically start on device boot</p>
            </div>
            <Switch 
              checked={settings.startOnBoot}
              onCheckedChange={(checked) => handleSettingChange("startOnBoot", checked)}
            />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Battery Optimization</p>
              <p className="text-sm text-muted-foreground">Reduce power consumption</p>
            </div>
            <Switch 
              checked={settings.batteryOptimized}
              onCheckedChange={(checked) => handleSettingChange("batteryOptimized", checked)}
            />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Notifications</p>
              <p className="text-sm text-muted-foreground">Show status notifications</p>
            </div>
            <Switch 
              checked={settings.notifications}
              onCheckedChange={(checked) => handleSettingChange("notifications", checked)}
            />
          </div>
          
          <Separator />
          
          <Button 
            variant="outline" 
            className="w-full"
            onClick={onReset}
          >
            Reset App Settings
          </Button>
        </CardContent>
      </Card>
      
      <div className="text-center text-sm text-muted-foreground">
        <p>Reel to Tube Automator v1.0</p>
        <p className="text-xs">Running in background mode</p>
      </div>
    </div>
  );
};

export default Dashboard;
