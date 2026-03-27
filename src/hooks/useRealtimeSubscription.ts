import { useEffect, useRef } from "react";
import { useQueryClient, type QueryKey } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { RealtimePostgresChangesPayload } from "@supabase/supabase-js";

type RealtimeEvent = "INSERT" | "UPDATE" | "DELETE" | "*";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface UseRealtimeSubscriptionOptions<T extends Record<string, any>> {
  channelName: string;
  table?: string;
  schema?: string;
  event?: RealtimeEvent;
  filter?: string;
  queryKeys?: QueryKey[];
  onReceive?: (payload: RealtimePostgresChangesPayload<T> | any) => void;
  enabled?: boolean;
  // Broadcast options
  isBroadcast?: boolean;
  broadcastEvent?: string;
}

export function useRealtimeSubscription<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  T extends Record<string, any> = Record<string, unknown>,
>(options: UseRealtimeSubscriptionOptions<T>) {
  const {
    channelName,
    table,
    schema = "public",
    event = "*",
    filter,
    queryKeys: keys,
    onReceive,
    enabled = true,
  } = options;

  const queryClient = useQueryClient();

  // Ref giữ callback mới nhất, tránh re-subscribe khi callback thay đổi
  const onReceiveRef = useRef(onReceive);
  onReceiveRef.current = onReceive;

  const keysRef = useRef(keys);
  keysRef.current = keys;

  useEffect(() => {
    if (!enabled) return;

    let channel = supabase.channel(channelName);

    if (options.isBroadcast && options.broadcastEvent) {
      channel = channel.on(
        "broadcast",
        { event: options.broadcastEvent },
        (payload: any) => {
          if (onReceiveRef.current) {
            onReceiveRef.current(payload);
          } else if (keysRef.current?.length) {
            for (const key of keysRef.current) {
              void queryClient.invalidateQueries({ queryKey: key });
            }
          }
        }
      );
    } else if (table) {
      channel = channel.on(
        "postgres_changes" as const,
        {
          event,
          schema,
          table,
          ...(filter ? { filter } : {}),
        },
        (payload: RealtimePostgresChangesPayload<T>) => {
          if (onReceiveRef.current) {
            // Custom handler — caller tự quyết định làm gì
            onReceiveRef.current(payload);
          } else if (keysRef.current?.length) {
            // Mặc định: invalidate tất cả query keys được truyền vào
            for (const key of keysRef.current) {
              void queryClient.invalidateQueries({ queryKey: key });
            }
          }
        },
      );
    }

    channel.subscribe();

    // Cleanup: unsubscribe khi unmount hoặc dependencies thay đổi
    return () => {
      void supabase.removeChannel(channel);
    };
  }, [channelName, table, schema, event, filter, enabled, queryClient]);
}
