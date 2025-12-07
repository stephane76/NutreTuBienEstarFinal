import React, { useState, useRef, useEffect } from 'react';
import DOMPurify from 'dompurify';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Send, Pause, FileText, Shield, MessageCircle, Brain } from 'lucide-react';
import { toast } from 'sonner';
import { chatbotService, type ChatMessage } from '@/services/chatbotService';
import { useNavigate } from 'react-router-dom';

const IACompanion: React.FC = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const conversation = chatbotService.getConversation();
    if (conversation.length === 0) {
      const welcomeMessages: ChatMessage[] = [
        {
          id: '1',
          role: 'assistant',
          content: '¡Hola! Soy tu Acompañante IA de comersinculpa.blog 💙\n\n¿Cómo te sientes ahora mismo?',
          timestamp: new Date()
        }
      ];
      setMessages(welcomeMessages);
    } else {
      setMessages(conversation);
    }
    scrollToBottom();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Sanitize and format message content
  const formatMessageContent = (content: string): string => {
    const formatted = content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br/>');
    return DOMPurify.sanitize(formatted, { 
      ALLOWED_TAGS: ['strong', 'br', 'em', 'b', 'i'],
      ALLOWED_ATTR: []
    });
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || isLoading) return;

    const messageToSend = newMessage;
    setNewMessage('');
    setIsLoading(true);
    setIsTyping(true);

    try {
      const userMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'user',
        content: messageToSend,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, userMessage]);
      
      const response = await chatbotService.sendMessage(messageToSend);
      setMessages(prev => [...prev, response]);
      
      toast.success("Mensaje recibido");
      
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error("Error de conexión");
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  };

  const handleQuickChip = async (chipText: string, action?: string) => {
    setNewMessage(chipText);
    
    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user', 
      content: chipText,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setIsTyping(true);

    try {
      const response = await chatbotService.sendMessage(chipText);
      setMessages(prev => [...prev, response]);
      
      // Ejecutar acción específica si se proporciona
      if (action === 'pausa') {
        setTimeout(() => navigate('/pausa'), 1000);
      } else if (action === 'registrar') {
        setTimeout(() => navigate('/check-in'), 1000);
      }
      
    } catch (error) {
      console.error('Error:', error);
      toast.error("Error de conexión");
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  };

  const formatTime = (timestamp: Date) => {
    return timestamp.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="flex flex-col h-[600px] max-w-2xl mx-auto">
      <Card className="glass-card border-0 shadow-elegant h-full flex flex-col">
        <CardHeader className="pb-3 bg-gradient-brand/5 backdrop-blur-sm rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-brand flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-foreground">Acompañante IA</h3>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              </div>
              <p className="text-sm text-muted-foreground">Apoyo 24/7 • comersinculpa.blog</p>
            </div>
            <Badge variant="secondary" className="text-xs">
              <Shield className="w-3 h-3 mr-1" />
              Seguro
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="p-0 flex-1 flex flex-col">
          {/* Quick chips at top */}
          <div className="p-4 border-b border-border/50">
            <div className="flex gap-2 flex-wrap">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleQuickChip('Me siento ansiosa y necesito calmarme')}
                className="text-xs bg-gradient-to-r from-ochre-50 to-ochre-100 border-ochre-200 hover:border-ochre-300"
              >
                😰 Me siento ansiosa
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleQuickChip('Quiero pausar un atracón que siento que viene', 'pausa')}
                className="text-xs bg-gradient-to-r from-red-50 to-red-100 border-red-200 hover:border-red-300"
              >
                🛑 Pausar atracón
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleQuickChip('Solo necesito compañía y hablar')}
                className="text-xs bg-gradient-to-r from-green-50 to-green-100 border-green-200 hover:border-green-300"
              >
                💚 Solo compañía
              </Button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 space-y-3 p-4 overflow-y-auto" style={{ maxHeight: '320px' }}>
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-3 py-2 rounded-2xl text-sm ${
                    message.role === 'user'
                      ? 'bg-gradient-brand text-white ml-auto'
                      : 'bg-gradient-card text-foreground border border-border/50'
                  }`}
                >
                  <div 
                    className="whitespace-pre-wrap"
                    dangerouslySetInnerHTML={{
                      __html: formatMessageContent(message.content)
                    }}
                  />
                  <div className="text-xs opacity-70 mt-1">
                    {formatTime(message.timestamp)}
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gradient-card border border-border/50 rounded-2xl px-3 py-2 max-w-xs">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 bg-ochre-500 rounded-full animate-bounce"></div>
                      <div className="w-1.5 h-1.5 bg-ochre-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-1.5 h-1.5 bg-ochre-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      Escribiendo...
                    </span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Action buttons */}
          {messages.length > 1 && (
            <div className="px-4 py-2 border-t border-border/50">
              <div className="flex gap-2 justify-center">
                <Button 
                  onClick={() => navigate('/pausa')}
                  className="bg-gradient-to-r from-ochre-500 to-ochre-600 text-white text-xs px-4 py-2 hover:opacity-90"
                >
                  <Pause className="h-3 w-3 mr-1" />
                  Pausa guiada (2-3 min)
                </Button>
                <Button 
                  onClick={() => navigate('/check-in')}
                  variant="outline"
                  className="text-xs px-4 py-2"
                >
                  <FileText className="h-3 w-3 mr-1" />
                  Registrar y seguir
                </Button>
              </div>
            </div>
          )}

          {/* Input area */}
          <div className="p-4 border-t border-border/50">
            <div className="flex items-center gap-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder={isLoading ? "Escribiendo..." : "Escribe aquí..."}
                className="flex-1 text-sm"
                disabled={isLoading}
                onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), sendMessage())}
              />
              <Button 
                onClick={sendMessage} 
                size="sm"
                disabled={isLoading || !newMessage.trim()}
                className="bg-gradient-brand"
              >
                <Send className="h-3 w-3" />
              </Button>
            </div>
            
            <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Shield className="w-3 h-3" />
                <span>Conversación privada</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageCircle className="w-3 h-3" />
                <span>{messages.length} mensajes</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default IACompanion;
