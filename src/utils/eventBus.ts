type EventCallback<T = unknown> = (event: BaseEvent<T>) => void;

export class BaseEvent<T = unknown> {
  public readonly eventId: string;
  public readonly payload: T;

  constructor(eventId: string, payload: T) {
    this.eventId = eventId;
    this.payload = payload;
  }
}

class EventBus {
  private events: { [key: string]: EventCallback[] } = {};

  on(event: string, callback: EventCallback) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
    return () => {
      this.events[event] = this.events[event].filter((cb) => cb !== callback);
    };
  }

  emit<T>(event: BaseEvent<T>) {
    if (this.events[event.eventId]) {
      this.events[event.eventId].forEach((callback) => callback(event));
    }
  }
}

export const eventBus = new EventBus();
