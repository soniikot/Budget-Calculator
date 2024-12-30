import { eventBus } from "@/utils/eventBus";
import { monthService } from "@/utils/monthService";
import { EVENT_IDS } from "./eventsIds";
import { BaseEvent } from "@/utils/eventBus";

type TransactionSavePayload = {
  transaction: { id: string; amount: number };
  month: string;
};

export function initializeEventListeners() {
  eventBus.on(EVENT_IDS.MONTH.FETCH_REQUESTED, async () => {
    try {
      const months = await monthService.getAllMonths();
      eventBus.emit(new BaseEvent(EVENT_IDS.MONTH.FETCH_SUCCEEDED, { months }));
    } catch (error) {
      eventBus.emit(new BaseEvent(EVENT_IDS.MONTH.FETCH_FAILED, { error }));
    }
  });

  eventBus.on<TransactionSavePayload>(
    EVENT_IDS.TRANSACTION.SAVE_REQUESTED,
    async (data) => {
      try {
        const { transaction, month } = data;

        eventBus.emit(
          new BaseEvent<TransactionSavePayload>(
            EVENT_IDS.TRANSACTION.SAVE_SUCCEEDED,
            { transaction, month }
          )
        );
      } catch (error) {
        eventBus.emit(
          new BaseEvent<{ error: string }>(EVENT_IDS.TRANSACTION.SAVE_FAILED, {
            error: error.message,
          })
        );
      }
    }
  );
}
