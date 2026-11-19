export const COMPARE_LIMIT = 4;
export const COMPARE_STORAGE_KEY = "k12-compare-ids";

export function sanitizeCompareIds(value, validIds) {
  if (!Array.isArray(value)) return [];
  return [...new Set(value.filter(id => typeof id === "string" && id.length > 0 && (!validIds || validIds.has(id))))].slice(0, COMPARE_LIMIT);
}

export function comparisonReducer(state, action) {
  const { ids } = state;
  if (action.type === "clear") return { ids: [], limitReached: false };
  if (action.type === "dismiss") return { ...state, limitReached: false };
  if (action.type === "validate") {
    const next = sanitizeCompareIds(ids, new Set(action.validIds));
    return JSON.stringify(next) === JSON.stringify(ids) ? state : { ids: next, limitReached: false };
  }
  if (action.type === "remove" || (action.type === "toggle" && ids.includes(action.id))) {
    return { ids: ids.filter(id => id !== action.id), limitReached: false };
  }
  if (action.type === "add" || action.type === "toggle") {
    if (typeof action.id !== "string" || !action.id || ids.includes(action.id)) return state;
    if (ids.length >= COMPARE_LIMIT) return { ...state, limitReached: true };
    return { ids: [...ids, action.id], limitReached: false };
  }
  return state;
}

// Compare values as displayed, including fee currency, year and scope.
export const rowDiffers = values => values.length > 1 && new Set(values.map(v => JSON.stringify(v))).size > 1;
