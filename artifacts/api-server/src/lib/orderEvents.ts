import { EventEmitter } from "events";

export interface OrderUpdatePayload {
  id: number;
  trackingToken: string;
  status: string;
  updatedAt: string;
}

const emitter = new EventEmitter();
emitter.setMaxListeners(200);

export function emitOrderUpdate(payload: OrderUpdatePayload): void {
  emitter.emit("order:update", payload);
  emitter.emit(`order:update:${payload.trackingToken}`, payload);
}

export function onOrderUpdate(
  listener: (payload: OrderUpdatePayload) => void,
): () => void {
  emitter.on("order:update", listener);
  return () => emitter.off("order:update", listener);
}

export function onOrderUpdateByToken(
  token: string,
  listener: (payload: OrderUpdatePayload) => void,
): () => void {
  const event = `order:update:${token}`;
  emitter.on(event, listener);
  return () => emitter.off(event, listener);
}
