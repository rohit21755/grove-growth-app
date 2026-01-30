import { queryKeys } from "@/lib/query-client";
import { buildConnectUrl } from "@/lib/ws";
import { useAuthStore } from "@/store/auth-store";
import type {
    LeaderboardDataPayload,
    NotificationPayload,
    WSMessage,
} from "@/types/ws";
import { useQueryClient } from "@tanstack/react-query";
import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
    type ReactNode,
} from "react";

const MAX_NOTIFICATIONS = 50;
const RECONNECT_BASE_MS = 1000;
const RECONNECT_MAX_MS = 30000;
const RECONNECT_BACKOFF = 2;

type WsContextValue = {
  connected: boolean;
  notifications: NotificationPayload[];
  lastMessage: WSMessage | null;
  leaderboardData: LeaderboardDataPayload | null;
  clearNotifications: () => void;
  send: (data: unknown) => void;
};

const WsContext = createContext<WsContextValue | null>(null);

export function WsProvider({ children }: { children: ReactNode }) {
  const token = useAuthStore((s) => s.token);
  const queryClient = useQueryClient();
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const reconnectAttemptRef = useRef(0);

  const [connected, setConnected] = useState(false);
  const [notifications, setNotifications] = useState<NotificationPayload[]>([]);
  const [lastMessage, setLastMessage] = useState<WSMessage | null>(null);
  const [leaderboardData, setLeaderboardData] =
    useState<LeaderboardDataPayload | null>(null);

  const clearNotifications = useCallback(() => setNotifications([]), []);

  const connect = useCallback(() => {
    if (!token?.trim()) return;

    const url = buildConnectUrl(token);
    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => {
      reconnectAttemptRef.current = 0;
      setConnected(true);
    };

    ws.onmessage = (event) => {
      try {
        const raw = event.data;
        if (raw === "Ping" || raw === "ping") {
          ws.send("Pong");
          return;
        }
        const msg = JSON.parse(raw as string) as WSMessage;
        if (msg.type === "ping") {
          ws.send(JSON.stringify({ type: "pong" }));
          return;
        }

        setLastMessage(msg);
        const payload = msg.payload ?? msg.data;

        switch (msg.type) {
          case "notification":
            if (payload && typeof payload === "object") {
              setNotifications((prev) => {
                const next = [{ ...payload } as NotificationPayload, ...prev];
                return next.slice(0, MAX_NOTIFICATIONS);
              });
            }
            break;
          case "leaderboard_data":
            if (payload && typeof payload === "object") {
              setLeaderboardData(payload as LeaderboardDataPayload);
            }
            break;
          case "task":
            queryClient.invalidateQueries({ queryKey: queryKeys.tasks });
            break;
          default:
            break;
        }
      } catch {
        // ignore parse errors
      }
    };

    ws.onclose = () => {
      wsRef.current = null;
      setConnected(false);
      if (!token?.trim()) return;

      const delay = Math.min(
        RECONNECT_BASE_MS *
          Math.pow(RECONNECT_BACKOFF, reconnectAttemptRef.current),
        RECONNECT_MAX_MS,
      );
      reconnectAttemptRef.current += 1;
      reconnectTimeoutRef.current = setTimeout(() => {
        reconnectTimeoutRef.current = null;
        connect();
      }, delay);
    };

    ws.onerror = () => {
      // close will handle reconnect
    };
  }, [token, queryClient]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    reconnectAttemptRef.current = 0;
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setConnected(false);
  }, []);

  useEffect(() => {
    if (token?.trim()) {
      connect();
    } else {
      disconnect();
    }
    return () => disconnect();
  }, [token, connect, disconnect]);

  const send = useCallback((data: unknown) => {
    const ws = wsRef.current;
    if (ws?.readyState === WebSocket.OPEN) {
      ws.send(typeof data === "string" ? data : JSON.stringify(data));
    }
  }, []);

  const value: WsContextValue = {
    connected,
    notifications,
    lastMessage,
    leaderboardData,
    clearNotifications,
    send,
  };

  return <WsContext.Provider value={value}>{children}</WsContext.Provider>;
}

export function useWS(): WsContextValue {
  const ctx = useContext(WsContext);
  if (!ctx) {
    throw new Error("useWS must be used within WsProvider");
  }
  return ctx;
}

export function useWSOptional(): WsContextValue | null {
  return useContext(WsContext);
}
