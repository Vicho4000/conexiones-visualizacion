const MIN_PEOPLE = 1;
const MAX_PEOPLE = 10;

function clamp01(value: number) {
  return Math.min(1, Math.max(0, value));
}

export function getPeopleCount(isolation: number) {
  const normalizedIsolation = clamp01(isolation);
  const supportIndex = 1 - normalizedIsolation;

  return Math.max(MIN_PEOPLE, Math.round(supportIndex * MAX_PEOPLE));
}
