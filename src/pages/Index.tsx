
import { useState } from "react";
import { ChatInterface } from "@/components/ChatInterface";
import { SettingsPanel } from "@/components/SettingsPanel";
import { MCPServerPanel } from "@/components/MCPServerPanel";
import { Settings, MessageSquare, Server } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const Index = () => {
  const [activeTab, setActiveTab] = useState("chat");
  const [messages, setMessages] = useState<Message[]>([]);

  const handleNewChat = () => {
    setMessages([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="container mx-auto px-4 py-6">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-2">
            AI Assistant with MCP
          </h1>
          <p className="text-blue-200">
            Interact with OpenAI and manage Model Context Protocol servers
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="chat" className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Chat
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Settings
            </TabsTrigger>
            <TabsTrigger value="mcp" className="flex items-center gap-2">
              <Server className="w-4 h-4" />
              MCP Servers
            </TabsTrigger>
          </TabsList>

          <TabsContent value="chat">
            <ChatInterface 
              messages={messages}
              setMessages={setMessages}
              onNewChat={handleNewChat}
            />
          </TabsContent>

          <TabsContent value="settings">
            <SettingsPanel />
          </TabsContent>

          <TabsContent value="mcp">
            <MCPServerPanel />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
