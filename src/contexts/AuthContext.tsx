import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

const MOCK_AUTH_ENABLED = import.meta.env.VITE_USE_MOCK_AUTH !== "false";
const MOCK_AUTH_STORAGE_KEY = "rentrate_mock_auth";
const MOCK_AUTH_USERS_KEY = "rentrate_mock_users";

interface MockAccount {
  id: string;
  email: string;
  password: string;
  name: string;
  role: string;
  phone?: string;
}

const DEFAULT_MOCK_USERS: MockAccount[] = [
  {
    id: "mock-owner-1",
    email: "owner@rentrate.com",
    password: "password123",
    name: "Demo Owner",
    role: "owner",
    phone: "+91 90000 00000",
  },
  {
    id: "mock-tenant-1",
    email: "renter@rentrate.com",
    password: "password123",
    name: "Demo Renter",
    role: "tenant",
    phone: "+91 91111 11111",
  },
];

interface Profile {
  id: string;
  user_id: string;
  name: string;
  role: string;
  phone: string | null;
  avatar_url: string | null;
  bio: string | null;
  trust_score: number | null;
  average_rating: number | null;
  total_reviews: number | null;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  signUp: (email: string, password: string, metadata: { name: string; role: string; phone?: string }) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const toMockProfile = (account: MockAccount): Profile => ({
  id: account.id,
  user_id: account.id,
  name: account.name,
  role: account.role,
  phone: account.phone ?? null,
  avatar_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(account.name)}&background=F97316&color=fff`,
  bio: null,
  trust_score: 80,
  average_rating: 4.5,
  total_reviews: 12,
});

const toMockUser = (account: MockAccount): User =>
  ({
    id: account.id,
    email: account.email,
    aud: "authenticated",
    app_metadata: { provider: "email" },
    user_metadata: { name: account.name, role: account.role, phone: account.phone ?? null },
    created_at: new Date().toISOString(),
  } as unknown as User);

const toMockSession = (user: User): Session =>
  ({
    access_token: "mock-access-token",
    refresh_token: "mock-refresh-token",
    token_type: "bearer",
    expires_in: 60 * 60,
    expires_at: Math.floor(Date.now() / 1000) + 60 * 60,
    user,
  } as unknown as Session);

const getStoredMockUsers = (): MockAccount[] => {
  const ensureDefaultUsers = (users: MockAccount[]): MockAccount[] => {
    const existingEmails = new Set(users.map((item) => item.email.toLowerCase()));
    const missingDefaults = DEFAULT_MOCK_USERS.filter((item) => !existingEmails.has(item.email.toLowerCase()));
    return missingDefaults.length > 0 ? [...missingDefaults, ...users] : users;
  };

  const raw = localStorage.getItem(MOCK_AUTH_USERS_KEY);
  if (!raw) {
    localStorage.setItem(MOCK_AUTH_USERS_KEY, JSON.stringify(DEFAULT_MOCK_USERS));
    return DEFAULT_MOCK_USERS;
  }

  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      const merged = ensureDefaultUsers(parsed as MockAccount[]);
      localStorage.setItem(MOCK_AUTH_USERS_KEY, JSON.stringify(merged));
      return merged;
    }
  } catch {
    // ignore parse errors and reset mock storage
  }

  localStorage.setItem(MOCK_AUTH_USERS_KEY, JSON.stringify(DEFAULT_MOCK_USERS));
  return DEFAULT_MOCK_USERS;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (userId: string) => {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", userId)
      .single();
    setProfile(data);
  };

  useEffect(() => {
    if (MOCK_AUTH_ENABLED) {
      const storedSessionUserId = localStorage.getItem(MOCK_AUTH_STORAGE_KEY);
      const storedUsers = getStoredMockUsers();
      const account = storedUsers.find((item) => item.id === storedSessionUserId) ?? null;

      if (account) {
        const mockUser = toMockUser(account);
        setUser(mockUser);
        setSession(toMockSession(mockUser));
        setProfile(toMockProfile(account));
      } else {
        setUser(null);
        setSession(null);
        setProfile(null);
      }

      setLoading(false);
      return;
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          setTimeout(() => fetchProfile(session.user.id), 0);
        } else {
          setProfile(null);
        }
        setLoading(false);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, metadata: { name: string; role: string; phone?: string }) => {
    if (MOCK_AUTH_ENABLED) {
      const users = getStoredMockUsers();
      const normalizedEmail = email.trim().toLowerCase();

      if (users.some((item) => item.email.toLowerCase() === normalizedEmail)) {
        throw new Error("Account already exists for this email.");
      }

      const account: MockAccount = {
        id: `mock-${Date.now()}`,
        email: normalizedEmail,
        password,
        name: metadata.name,
        role: metadata.role,
        phone: metadata.phone,
      };

      const nextUsers = [...users, account];
      localStorage.setItem(MOCK_AUTH_USERS_KEY, JSON.stringify(nextUsers));
      return;
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
        emailRedirectTo: window.location.origin,
      },
    });
    if (error) throw error;
  };

  const signIn = async (email: string, password: string) => {
    if (MOCK_AUTH_ENABLED) {
      const users = getStoredMockUsers();
      const normalizedEmail = email.trim().toLowerCase();
      const account = users.find((item) => item.email.toLowerCase() === normalizedEmail && item.password === password);

      if (!account) {
        throw new Error("Invalid email or password.");
      }

      const mockUser = toMockUser(account);
      localStorage.setItem(MOCK_AUTH_STORAGE_KEY, account.id);
      setUser(mockUser);
      setSession(toMockSession(mockUser));
      setProfile(toMockProfile(account));
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const signOut = async () => {
    if (MOCK_AUTH_ENABLED) {
      localStorage.removeItem(MOCK_AUTH_STORAGE_KEY);
      setUser(null);
      setSession(null);
      setProfile(null);
      return;
    }

    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setProfile(null);
  };

  return (
    <AuthContext.Provider value={{ user, session, profile, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
