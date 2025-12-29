import { useEffect, useState, useRef } from "react";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MessageCircle, Send, Search, 
  CheckCircle, Clock, ArrowLeft, Phone, Video, MoreVertical
} from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { SEOHead } from "@/components/seo/SEOHead";
import { FloatingContact } from "@/components/ui/floating-contact";

interface Conversation {
  id: string;
  otherParticipant: {
    id: string;
    first_name: string | null;
    avatar_url: string | null;
  } | null;
  lastMessage: {
    content: string;
    created_at: string;
    read: boolean;
    sender_id: string;
  } | null;
  unreadCount: number;
}

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
  read: boolean;
}

const Messages = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation.otherParticipant?.id || '');
    }
  }, [selectedConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Setup real-time subscription
  useEffect(() => {
    if (!currentUserId) return;

    const channel = supabase
      .channel('messages-realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `receiver_id=eq.${currentUserId}`
        },
        (payload) => {
          const newMsg = payload.new as Message;
          
          if (selectedConversation?.otherParticipant?.id === newMsg.sender_id) {
            setMessages(prev => [...prev, newMsg]);
            supabase
              .from('messages')
              .update({ read: true })
              .eq('id', newMsg.id);
          }
          
          fetchConversations(currentUserId);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `sender_id=eq.${currentUserId}`
        },
        (payload) => {
          const newMsg = payload.new as Message;
          if (selectedConversation?.otherParticipant?.id === newMsg.receiver_id) {
            setMessages(prev => {
              if (prev.some(m => m.id === newMsg.id)) return prev;
              return [...prev, newMsg];
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUserId, selectedConversation]);

  useEffect(() => {
    if (location.state?.selectedWalkerId && conversations.length > 0) {
      const conv = conversations.find(c => c.otherParticipant?.id === location.state.selectedWalkerId);
      if (conv) {
        setSelectedConversation(conv);
      }
    }
  }, [location.state, conversations]);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate('/auth');
      return;
    }
    setCurrentUserId(session.user.id);
    fetchConversations(session.user.id);
  };

  const fetchConversations = async (userId: string) => {
    try {
      const { data: messagesData, error } = await supabase
        .from('messages')
        .select('*')
        .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (!messagesData || messagesData.length === 0) {
        setConversations([]);
        setLoading(false);
        return;
      }

      const conversationMap = new Map<string, Message[]>();
      messagesData.forEach(msg => {
        const otherId = msg.sender_id === userId ? msg.receiver_id : msg.sender_id;
        if (!conversationMap.has(otherId)) {
          conversationMap.set(otherId, []);
        }
        conversationMap.get(otherId)!.push(msg);
      });

      const otherIds = Array.from(conversationMap.keys());
      const { data: participantsData } = await supabase
        .from('profiles')
        .select('id, first_name, avatar_url')
        .in('id', otherIds);

      const participantMap = new Map(participantsData?.map(p => [p.id, p]) || []);

      const convs: Conversation[] = Array.from(conversationMap.entries()).map(([otherId, msgs]) => {
        const lastMessage = msgs[0];
        const unreadCount = msgs.filter(m => m.receiver_id === userId && !m.read).length;
        
        return {
          id: otherId,
          otherParticipant: participantMap.get(otherId) || null,
          lastMessage: lastMessage ? {
            content: lastMessage.content,
            created_at: lastMessage.created_at,
            read: lastMessage.read,
            sender_id: lastMessage.sender_id
          } : null,
          unreadCount
        };
      });

      setConversations(convs);
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (otherUserId: string) => {
    if (!currentUserId) return;
    
    try {
      const { data: messagesData, error } = await supabase
        .from('messages')
        .select('*')
        .or(`and(sender_id.eq.${currentUserId},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${currentUserId})`)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(messagesData || []);

      await supabase
        .from('messages')
        .update({ read: true })
        .eq('receiver_id', currentUserId)
        .eq('sender_id', otherUserId);
        
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation || !currentUserId) return;

    const messageContent = newMessage.trim();
    setNewMessage('');
    setSendingMessage(true);

    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          sender_id: currentUserId,
          receiver_id: selectedConversation.otherParticipant?.id || '',
          content: messageContent
        });

      if (error) throw error;

    } catch (error: any) {
      setNewMessage(messageContent);
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setSendingMessage(false);
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.otherParticipant?.first_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatTime = (date: string) => {
    const now = new Date();
    const msgDate = new Date(date);
    const diffDays = Math.floor((now.getTime() - msgDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return msgDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      return 'Hier';
    } else if (diffDays < 7) {
      return msgDate.toLocaleDateString('fr-FR', { weekday: 'short' });
    }
    return msgDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-24">
          <div className="flex items-center justify-center h-64">
            <motion.div 
              className="rounded-full h-8 w-8 border-b-2 border-primary"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Messagerie | DogWalking"
        description="Communiquez avec vos promeneurs en temps réel. Messagerie sécurisée DogWalking pour organiser les promenades de votre chien."
        canonical="https://dogwalking.fr/messages"
        noindex
      />
      
      <Header />
      
      <main className="container mx-auto px-4 py-24">
        <motion.h1 
          className="text-4xl font-bold mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Mes Messages
        </motion.h1>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[600px]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {/* Conversations List */}
          <Card className="md:col-span-1 overflow-hidden shadow-card">
            <CardHeader className="pb-3 border-b">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Rechercher..." 
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[500px]">
                {filteredConversations.length === 0 ? (
                  <motion.div 
                    className="text-center py-12 px-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <MessageCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <p className="text-muted-foreground">Aucune conversation</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Vos conversations avec les promeneurs apparaîtront ici
                    </p>
                  </motion.div>
                ) : (
                  <div className="divide-y">
                    <AnimatePresence>
                      {filteredConversations.map((conv, index) => (
                        <motion.div
                          key={conv.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ delay: index * 0.05 }}
                          className={`p-4 cursor-pointer transition-all duration-200 ${
                            selectedConversation?.id === conv.id 
                              ? 'bg-primary/10 border-l-4 border-l-primary' 
                              : 'hover:bg-muted/50'
                          }`}
                          onClick={() => setSelectedConversation(conv)}
                        >
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <Avatar className="h-12 w-12">
                                <AvatarImage src={conv.otherParticipant?.avatar_url || ''} />
                                <AvatarFallback className="bg-primary/10 text-primary">
                                  {conv.otherParticipant?.first_name?.[0] || 'U'}
                                </AvatarFallback>
                              </Avatar>
                              {conv.unreadCount > 0 && (
                                <motion.span 
                                  className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold"
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  transition={{ type: "spring", stiffness: 500 }}
                                >
                                  {conv.unreadCount}
                                </motion.span>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <p className={`font-semibold truncate ${conv.unreadCount > 0 ? 'text-foreground' : ''}`}>
                                  {conv.otherParticipant?.first_name || 'Utilisateur'}
                                </p>
                                {conv.lastMessage && (
                                  <span className="text-xs text-muted-foreground">
                                    {formatTime(conv.lastMessage.created_at)}
                                  </span>
                                )}
                              </div>
                              {conv.lastMessage && (
                                <p className={`text-sm truncate ${
                                  conv.unreadCount > 0 ? 'text-foreground font-medium' : 'text-muted-foreground'
                                }`}>
                                  {conv.lastMessage.sender_id === currentUserId && (
                                    <span className="text-primary">Vous: </span>
                                  )}
                                  {conv.lastMessage.content}
                                </p>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Messages Area */}
          <Card className="md:col-span-2 flex flex-col overflow-hidden shadow-card">
            <AnimatePresence mode="wait">
              {selectedConversation ? (
                <motion.div
                  key="conversation"
                  className="flex flex-col h-full"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {/* Conversation Header */}
                  <CardHeader className="border-b pb-4 bg-gradient-to-r from-primary/5 to-transparent">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="md:hidden"
                          onClick={() => setSelectedConversation(null)}
                        >
                          <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={selectedConversation.otherParticipant?.avatar_url || ''} />
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {selectedConversation.otherParticipant?.first_name?.[0] || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold">
                            {selectedConversation.otherParticipant?.first_name || 'Utilisateur'}
                          </p>
                          <p className="text-xs text-primary flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                            En ligne
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon">
                          <Phone className="h-5 w-5" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Video className="h-5 w-5" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>

                  {/* Messages */}
                  <CardContent className="flex-1 p-4 overflow-hidden">
                    <ScrollArea className="h-full pr-4">
                      <div className="space-y-4">
                        <AnimatePresence>
                          {messages.map((msg, index) => {
                            const isOwn = msg.sender_id === currentUserId;
                            return (
                              <motion.div
                                key={msg.id}
                                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                transition={{ delay: index * 0.02 }}
                                className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                              >
                                <div className={`max-w-[70%] ${isOwn ? 'order-2' : 'order-1'}`}>
                                  <div className={`px-4 py-2 rounded-2xl ${
                                    isOwn 
                                      ? 'bg-primary text-primary-foreground rounded-br-md' 
                                      : 'bg-muted rounded-bl-md'
                                  }`}>
                                    <p className="text-sm">{msg.content}</p>
                                  </div>
                                  <div className={`flex items-center gap-1 mt-1 ${isOwn ? 'justify-end' : 'justify-start'}`}>
                                    <span className="text-xs text-muted-foreground">
                                      {formatTime(msg.created_at)}
                                    </span>
                                    {isOwn && (
                                      msg.read 
                                        ? <CheckCircle className="h-3 w-3 text-primary" />
                                        : <Clock className="h-3 w-3 text-muted-foreground" />
                                    )}
                                  </div>
                                </div>
                              </motion.div>
                            );
                          })}
                        </AnimatePresence>
                        <div ref={messagesEndRef} />
                      </div>
                    </ScrollArea>
                  </CardContent>

                  {/* Message Input */}
                  <div className="p-4 border-t bg-background">
                    <form 
                      onSubmit={(e) => { e.preventDefault(); sendMessage(); }}
                      className="flex gap-2"
                    >
                      <Input
                        placeholder="Écrire un message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        className="flex-1"
                        disabled={sendingMessage}
                      />
                      <Button type="submit" disabled={sendingMessage || !newMessage.trim()}>
                        <Send className="h-4 w-4" />
                      </Button>
                    </form>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  className="flex flex-col items-center justify-center h-full text-center p-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                    <MessageCircle className="h-10 w-10 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Sélectionnez une conversation</h3>
                  <p className="text-muted-foreground max-w-sm">
                    Choisissez une conversation dans la liste pour commencer à discuter
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        </motion.div>
      </main>
      
      <Footer />
      <FloatingContact />
    </div>
  );
};

export default Messages;
