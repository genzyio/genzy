import { useCallback, useEffect } from "react";
import { eventEmitter, type Event, type EventHandler } from "@core/utils/event-emitter";

export const useEvent = (event: Event, callback: EventHandler, dependencies: any[] = []) => {
  const dispatch = useCallback((data: any) => eventEmitter.dispatch(event, data), [event]);

  useEffect(() => {
    eventEmitter.subscribe(event, callback);

    return () => {
      eventEmitter.unsubscribe(event);
    };
  }, [dependencies]);

  return dispatch;
};
