type EventCallback = (data: any) => void;

export class EventEmitter {
  private _events: Map<string, Set<EventCallback>>;

  constructor() {
    this._events = new Map();
  }

  on(eventName: string, callback: EventCallback): void {
    if (!this._events.has(eventName)) {
      this._events.set(eventName, new Set());
    }
    this._events.get(eventName)?.add(callback);
  }

  emit(eventName: string, data: any): void {
    if (this._events.has(eventName)) {
      const subscribers = this._events.get(eventName);
      subscribers?.forEach((callback) => callback(data));
    }
  }

  offAll(): void {
    this._events.clear();
  }
}
