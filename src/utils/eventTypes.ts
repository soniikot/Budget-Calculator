export const BUDGET_EVENTS = {
  // Transaction events
  TRANSACTION_ADDED: "transaction:added",
  TRANSACTION_DELETED: "transaction:deleted",
  TRANSACTION_UPDATED: "transaction:updated",
  TRANSACTION_SAVE_REQUESTED: "transaction:save:requested",
  TRANSACTION_SAVE_SUCCEEDED: "transaction:save:succeeded",
  TRANSACTION_SAVE_FAILED: "transaction:save:failed",
  TRANSACTION_DELETE_REQUESTED: "transaction:delete:requested",
  TRANSACTION_DELETE_SUCCEEDED: "transaction:delete:succeeded",
  TRANSACTION_DELETE_FAILED: "transaction:delete:failed",
  TRANSACTION_FETCH_REQUESTED: "transaction:fetch:requested",
  TRANSACTION_FETCH_SUCCEEDED: "transaction:fetch:succeeded",
  TRANSACTION_FETCH_FAILED: "transaction:fetch:failed",

  // Month events
  MONTH_SELECTED: "month:selected",
  MONTH_DELETED: "month:deleted",
  MONTHS_FETCH_REQUESTED: "months:fetch:requested",
  MONTHS_FETCH_SUCCEEDED: "months:fetch:succeeded",
  MONTHS_FETCH_FAILED: "months:fetch:failed",
} as const;
