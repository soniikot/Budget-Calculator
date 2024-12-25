import { eventBus } from "@/utils/eventBus";
import { monthService } from "@/lib/monthService";
import { BUDGET_EVENTS } from "../utils/eventTypes";

export function initializeEventListeners() {
  eventBus.on(BUDGET_EVENTS.MONTHS_FETCH_REQUESTED, async () => {
    try {
      const months = await monthService.getAllMonths();
      eventBus.emit(BUDGET_EVENTS.MONTHS_FETCH_SUCCEEDED, { months });
    } catch (error) {
      eventBus.emit(BUDGET_EVENTS.MONTHS_FETCH_FAILED, { error });
    }
  });

  eventBus.on(BUDGET_EVENTS.TRANSACTION_SAVE_REQUESTED, async (data) => {
    try {
      const { transaction, month } = data;
      // Handle transaction save
      eventBus.emit(BUDGET_EVENTS.TRANSACTION_SAVE_SUCCEEDED, { transaction });
    } catch (error) {
      eventBus.emit(BUDGET_EVENTS.TRANSACTION_SAVE_FAILED, { error });
    }
  });
}

export { eventBus, monthService };
