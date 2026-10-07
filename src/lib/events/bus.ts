import type { NexaEventMap } from "./types";

type EventHandler<T> = (payload: T) => void;

const handlers = new Map<
  keyof NexaEventMap,
  Set<EventHandler<never>>
>();

export function emit<K extends keyof NexaEventMap>(
  event: K,
  ...args: NexaEventMap[K] extends undefined
    ? []
    : [payload: NexaEventMap[K]]
): void {
  const listeners = handlers.get(event);

  if (!listeners) {
    return;
  }

  const payload = args[0] as NexaEventMap[K];

  listeners.forEach((handler) => {
    handler(payload as never);
  });
}

export function on<K extends keyof NexaEventMap>(
  event: K,
  handler: EventHandler<NexaEventMap[K]>,
): () => void {
  let listeners = handlers.get(event);

  if (!listeners) {
    listeners = new Set();
    handlers.set(event, listeners);
  }

  listeners.add(
    handler as EventHandler<never>,
  );

  return () => {
    listeners?.delete(
      handler as EventHandler<never>,
    );

    if (listeners?.size === 0) {
      handlers.delete(event);
    }
  };
}

export function once<K extends keyof NexaEventMap>(
  event: K,
  handler: EventHandler<NexaEventMap[K]>,
): () => void {
  const unsubscribe = on(
    event,
    (payload) => {
      unsubscribe();

      if (
        payload === undefined
      ) {
        handler(
          undefined as NexaEventMap[K],
        );
      } else {
        handler(payload);
      }
    },
  );

  return unsubscribe;
}
