export const removeEmptyStrings = <T>(obj: T): Partial<T> => {
  return Object.fromEntries(
    Object.entries(obj as object).filter(([_, v]) => v !== "")
  ) as Partial<T>;
};
