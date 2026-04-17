import { useEffect, useMemo, useState } from "react";
import Layout from "@/components/Layout";
import { Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface MessageRow {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string | null;
}

interface ConversationProfile {
  user_id: string;
  name: string;
  role: string;
  avatar_url: string | null;
}

const Messages = () => {
  const { user } = useAuth();
  const [newMsg, setNewMsg] = useState("");
  const [allMessages, setAllMessages] = useState<MessageRow[]>([]);
  const [profilesById, setProfilesById] = useState<Record<string, ConversationProfile>>({});

  const currentUserId = user?.id || "";

  useEffect(() => {
    const loadMessages = async () => {
      if (!currentUserId) return;

      const { data: messageRows } = await supabase
        .from("messages")
        .select("id, sender_id, receiver_id, content, created_at")
        .or(`sender_id.eq.${currentUserId},receiver_id.eq.${currentUserId}`)
        .order("created_at", { ascending: true });

      const rows = (messageRows ?? []) as MessageRow[];
      setAllMessages(rows);

      const participantIds = Array.from(
        new Set(
          rows
            .flatMap((msg) => [msg.sender_id, msg.receiver_id])
            .filter((id) => id && id !== currentUserId)
        )
      );

      if (participantIds.length === 0) {
        setProfilesById({});
        return;
      }

      const { data: profileRows } = await supabase
        .from("profiles")
        .select("user_id, name, role, avatar_url")
        .in("user_id", participantIds);

      const nextProfiles = (profileRows ?? []).reduce<Record<string, ConversationProfile>>((acc, row) => {
        acc[row.user_id] = {
          user_id: row.user_id,
          name: row.name,
          role: row.role,
          avatar_url: row.avatar_url,
        };
        return acc;
      }, {});

      setProfilesById(nextProfiles);
    };

    void loadMessages();
  }, [currentUserId]);

  // Get unique conversations
  const conversationPartners = useMemo(
    () =>
      Array.from(
        new Set(
          allMessages
            .filter((m) => m.sender_id === currentUserId || m.receiver_id === currentUserId)
            .map((m) => (m.sender_id === currentUserId ? m.receiver_id : m.sender_id))
        )
      ),
    [allMessages, currentUserId]
  );

  const [activePartner, setActivePartner] = useState(conversationPartners[0] || "");

  useEffect(() => {
    if (!activePartner && conversationPartners.length > 0) {
      setActivePartner(conversationPartners[0]);
    }
  }, [activePartner, conversationPartners]);

  const partnerMessages = allMessages.filter(
    (m) =>
      (m.sender_id === currentUserId && m.receiver_id === activePartner) ||
      (m.sender_id === activePartner && m.receiver_id === currentUserId)
  );

  const partner = profilesById[activePartner];

  const handleSendMessage = async () => {
    const content = newMsg.trim();
    if (!content || !activePartner || !currentUserId) return;

    const { data } = await supabase
      .from("messages")
      .insert({ sender_id: currentUserId, receiver_id: activePartner, content })
      .select("id, sender_id, receiver_id, content, created_at")
      .single();

    if (data) {
      setAllMessages((prev) => [...prev, data as MessageRow]);
      setNewMsg("");
    }
  };

  return (
    <Layout>
      <div className="container py-8">
        <h1 className="font-heading text-2xl font-bold text-foreground">Messages</h1>
        <div className="mt-6 grid gap-4 lg:grid-cols-3" style={{ minHeight: "500px" }}>
          {/* Conversations list */}
          <div className="rounded-xl border border-border bg-card shadow-card overflow-hidden">
            <div className="p-4 border-b border-border">
              <h3 className="text-sm font-semibold text-foreground">Conversations</h3>
            </div>
            <div className="divide-y divide-border">
              {conversationPartners.map((pid) => {
                const p = profilesById[pid];
                if (!p) return null;
                return (
                  <button
                    key={pid}
                    onClick={() => setActivePartner(pid)}
                    className={`flex w-full items-center gap-3 p-4 text-left transition-colors ${activePartner === pid ? "bg-muted" : "hover:bg-muted/50"}`}
                  >
                    <img
                      src={p.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(p.name)}&background=F97316&color=fff`}
                      alt={p.name}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="text-sm font-medium text-foreground">{p.name}</p>
                      <p className="text-xs capitalize text-muted-foreground">{p.role}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Chat area */}
          <div className="lg:col-span-2 flex flex-col rounded-xl border border-border bg-card shadow-card overflow-hidden">
            {partner && (
              <div className="flex items-center gap-3 border-b border-border p-4">
                <img
                  src={partner.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(partner.name)}&background=F97316&color=fff`}
                  alt={partner.name}
                  className="h-10 w-10 rounded-full object-cover"
                />
                <div>
                  <p className="text-sm font-medium text-foreground">{partner.name}</p>
                  <p className="text-xs capitalize text-muted-foreground">{partner.role}</p>
                </div>
              </div>
            )}
            <div className="flex-1 space-y-3 overflow-auto p-4">
              {partnerMessages.map((m) => (
                <div key={m.id} className={`flex ${m.sender_id === currentUserId ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[70%] rounded-xl px-4 py-2 text-sm ${m.sender_id === currentUserId ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"}`}>
                    {m.content}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-2 border-t border-border p-4">
              <Input
                value={newMsg}
                onChange={(e) => setNewMsg(e.target.value)}
                placeholder="Type a message..."
                className="flex-1"
              />
              <Button size="icon" onClick={handleSendMessage}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Messages;
