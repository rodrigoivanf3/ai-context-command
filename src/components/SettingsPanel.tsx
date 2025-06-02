
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Save, Key } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const SettingsPanel = () => {
  const [openaiKey, setOpenaiKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const savedKey = localStorage.getItem('openai_api_key');
    if (savedKey) {
      setOpenaiKey(savedKey);
    }
  }, []);

  const saveSettings = () => {
    if (!openaiKey.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid OpenAI API key.",
        variant: "destructive",
      });
      return;
    }

    localStorage.setItem('openai_api_key', openaiKey.trim());
    toast({
      title: "Settings Saved",
      description: "Your OpenAI API key has been saved securely.",
    });
  };

  const clearSettings = () => {
    setOpenaiKey("");
    localStorage.removeItem('openai_api_key');
    toast({
      title: "Settings Cleared",
      description: "Your API key has been removed.",
    });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Key className="w-5 h-5" />
            OpenAI Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-white">OpenAI API Key</Label>
            <div className="relative">
              <Input
                type={showKey ? "text" : "password"}
                value={openaiKey}
                onChange={(e) => setOpenaiKey(e.target.value)}
                placeholder="sk-..."
                className="pr-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-white"
                onClick={() => setShowKey(!showKey)}
              >
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
            </div>
            <p className="text-sm text-blue-200">
              Get your API key from{" "}
              <a
                href="https://platform.openai.com/api-keys"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-white"
              >
                OpenAI Platform
              </a>
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={saveSettings}
              className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save Settings
            </Button>
            <Button
              onClick={clearSettings}
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
            >
              Clear Settings
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="text-white">Security Notice</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-blue-200 space-y-2">
            <p>• Your API key is stored locally in your browser's localStorage</p>
            <p>• The key is never sent to our servers</p>
            <p>• Clear your browser data to remove the stored key</p>
            <p>• Never share your API key with others</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
