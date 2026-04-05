// BACKWARDS COMPATIBILITY: re-exports from the JSONL persistence layer.
// The old in-memory Map implementation has been replaced with JSONL-based
// file persistence that survives restarts and redeployments.
//
// All imports of `db` or `localDb` from this module continue to work.
// New code should import directly from `@/lib/db/jsonl`.

export { jsonlDb as localDb, db } from "./jsonl";

