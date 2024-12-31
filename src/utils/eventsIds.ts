export module EVENT_IDS {
  export enum TRANSACTION {
    ADDED = "transaction:added",
    DELETED = "transaction:deleted",
    UPDATED = "transaction:updated",
    SAVE_REQUESTED = "transaction:save:requested",
    SAVE_SUCCEEDED = "transaction:save:succeeded",
    SAVE_FAILED = "transaction:save:failed",
    DELETE_REQUESTED = "transaction:delete:requested",
    DELETE_SUCCEEDED = "transaction:delete:succeeded",
    DELETE_FAILED = "transaction:delete:failed",
    FETCH_REQUESTED = "transaction:fetch:requested",
    FETCH_SUCCEEDED = "transaction:fetch:succeeded",
    FETCH_FAILED = "transaction:fetch:failed",
  }

  export enum MONTH {
    CREATED = "month:created",
    ERROR = "month:error",
    SELECTED = "month:selected",
    DELETED = "month:deleted",
    FETCH_REQUESTED = "months:fetch:requested",
    FETCH_SUCCEEDED = "months:fetch:succeeded",
    FETCH_FAILED = "months:fetch:failed",
  }
}
