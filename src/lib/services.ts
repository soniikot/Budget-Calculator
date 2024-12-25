import { eventBus } from "@/utils/eventBus";
import { budgetService } from "@/lib/budgetService";
import { BUDGET_EVENTS } from "../utils/eventTypes";

export function initializeEventListeners() {
  // Initialize event listeners
  eventBus.on(BUDGET_EVENTS.MONTHS_FETCH_REQUESTED, async () => {
    try {
      const months = await budgetService.getAllMonths();
      eventBus.emit(BUDGET_EVENTS.MONTHS_FETCH_SUCCEEDED, { months });
    } catch (error) {
      eventBus.emit(BUDGET_EVENTS.MONTHS_FETCH_FAILED, { error });
    }
  });

  // Initialize transaction service event listeners
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

export { eventBus, budgetService };
