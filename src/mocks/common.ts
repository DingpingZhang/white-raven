export function getMockItems<T>(
  templates: ReadonlyArray<T>,
  count: number,
  callback?: (item: T, index: number) => T
): ReadonlyArray<T> {
  const result = [];
  for (let i = 0; i < count; i++) {
    let item = templates[Math.floor(Math.random() * templates.length)];
    if (callback) {
      item = callback(item, i);
    }

    result.push(item);
  }

  return result;
}
