
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Save, Server, Volume2, Database, Calculator } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MCPServer {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  enabled: boolean;
  apiKey: string;
  status: 'connected' | 'disconnected' | 'error';
}

export const MCPServerPanel = () => {
  const [servers, setServers] = useState<MCPServer[]>([
    {
      id: 'elevenlabs',
      name: 'ElevenLabs',
      description: 'Text-to-speech and voice synthesis',
      icon: <Volume2 className="w-4 h-4" />,
      enabled: false,
      apiKey: '',
      status: 'disconnected'
    },
    {
      id: 'notion',
      name: 'Notion',
      description: 'Database and workspace operations',
      icon: <Database className="w-4 h-4" />,
      enabled: false,
      apiKey: '',
      status: 'disconnected'
    },
    {
      id: 'calculator',
      name: 'Calculator',
      description: 'Mathematical operations and computations',
      icon: <Calculator className="w-4 h-4" />,
      enabled: false,
      apiKey: '',
      status: 'connected' // Calculator doesn't need API key
    }
  ]);

  const { toast } = useToast();

  useEffect(() => {
    // Load saved settings
    const updatedServers = servers.map(server => ({
      ...server,
      enabled: localStorage.getItem(`mcp_${server.id}_enabled`) === 'true',
      apiKey: localStorage.getItem(`mcp_${server.id}_key`) || '',
    }));
    setServers(updatedServers);
  }, []);

  const updateServer = (id: string, updates: Partial<MCPServer>) => {
    setServers(prev => prev.map(server => 
      server.id === id ? { ...server, ...updates } : server
    ));
  };

  const toggleServer = (id: string) => {
    const server = servers.find(s => s.id === id);
    if (!server) return;

    const newEnabled = !server.enabled;
    
    // Check if API key is required and provided
    if (newEnabled && server.id !== 'calculator' && !server.apiKey.trim()) {
      toast({
        title: "API Key Required",
        description: `Please enter an API key for ${server.name} before enabling.`,
        variant: "destructive",
      });
      return;
    }

    updateServer(id, { enabled: newEnabled });
    localStorage.setItem(`mcp_${id}_enabled`, newEnabled.toString());
    
    toast({
      title: `${server.name} ${newEnabled ? 'Enabled' : 'Disabled'}`,
      description: `MCP server ${newEnabled ? 'connected' : 'disconnected'}.`,
    });
  };

  const saveApiKey = (id: string) => {
    const server = servers.find(s => s.id === id);
    if (!server) return;

    if (!server.apiKey.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid API key.",
        variant: "destructive",
      });
      return;
    }

    localStorage.setItem(`mcp_${id}_key`, server.apiKey.trim());
    updateServer(id, { status: 'connected' });
    
    toast({
      title: "API Key Saved",
      description: `${server.name} API key has been saved securely.`,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'bg-green-500';
      case 'disconnected': return 'bg-gray-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'connected': return 'Connected';
      case 'disconnected': return 'Disconnected';
      case 'error': return 'Error';
      default: return 'Unknown';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Server className="w-5 h-5" />
            Model Context Protocol Servers
          </CardTitle>
          <p className="text-blue-200">
            Enable and configure MCP servers to extend your AI assistant's capabilities
          </p>
        </CardHeader>
      </Card>

      <div className="grid gap-6">
        {servers.map((server) => (
          <Card key={server.id} className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-600 rounded-lg">
                    {server.icon}
                  </div>
                  <div>
                    <CardTitle className="text-white text-lg">{server.name}</CardTitle>
                    <p className="text-blue-200 text-sm">{server.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className={`${getStatusColor(server.status)} text-white`}>
                    {getStatusText(server.status)}
                  </Badge>
                  <Switch
                    checked={server.enabled}
                    onCheckedChange={() => toggleServer(server.id)}
                  />
                </div>
              </div>
            </CardHeader>
            
            {server.id !== 'calculator' && (
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-white">
                    {server.name} API Key
                    {server.id === 'elevenlabs' && (
                      <span className="text-blue-200 text-sm ml-2">
                        (Get from ElevenLabs Dashboard)
                      </span>
                    )}
                    {server.id === 'notion' && (
                      <span className="text-blue-200 text-sm ml-2">
                        (Create integration token)
                      </span>
                    )}
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      type="password"
                      value={server.apiKey}
                      onChange={(e) => updateServer(server.id, { apiKey: e.target.value })}
                      placeholder={`Enter ${server.name} API key...`}
                      className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                    />
                    <Button
                      onClick={() => saveApiKey(server.id)}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Save className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {server.id === 'elevenlabs' && (
                  <div className="text-sm text-blue-200 space-y-1">
                    <p>• Enables text-to-speech functionality</p>
                    <p>• Voice synthesis and audio generation</p>
                    <p>• Get API key from: elevenlabs.io/app/speech-synthesis/api-keys</p>
                  </div>
                )}

                {server.id === 'notion' && (
                  <div className="text-sm text-blue-200 space-y-1">
                    <p>• Database queries and page creation</p>
                    <p>• Workspace search and content management</p>
                    <p>• Create integration at: notion.so/my-integrations</p>
                  </div>
                )}
              </CardContent>
            )}

            {server.id === 'calculator' && (
              <CardContent>
                <div className="text-sm text-blue-200 space-y-1">
                  <p>• Mathematical operations and calculations</p>
                  <p>• No API key required - built-in functionality</p>
                  <p>• Supports arithmetic, algebra, and advanced math</p>
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="text-white">MCP Installation Guide</CardTitle>
        </CardHeader>
        <CardContent className="text-blue-200 space-y-3">
          <p>To use MCP servers locally, you'll need to install them via npm:</p>
          <div className="bg-black/30 p-4 rounded-lg font-mono text-sm">
            <p># Install MCP servers globally</p>
            <p>npm install -g @modelcontextprotocol/server-elevenlabs</p>
            <p>npm install -g @modelcontextprotocol/server-notion</p>
            <p>npm install -g @modelcontextprotocol/server-calculator</p>
          </div>
          <p className="text-sm">
            Note: This web interface simulates MCP server integration. 
            In a production environment, you would need actual MCP server implementations.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
