import { experimental_createQueryPersister } from "@tanstack/query-persist-client-core";
import { MAX_STALE_TIME } from "../_constants/cache";
import { storage } from "./storage";

export const persister = experimental_createQueryPersister({
  storage,
  maxAge: MAX_STALE_TIME,
});
