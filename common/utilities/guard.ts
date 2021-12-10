type GuardRequired<T extends {}> = {
  [K in keyof Required<T>]: Exclude<T[K], null | undefined>;
};

type Error<T> = string | ((missing: Array<keyof T>) => string);

const BadRequiredTypes = Object.freeze(["undefined", "null"]);

const required = <T extends object>(obj: T, error: Error<T>): GuardRequired<T> => {
  const missing: Array<keyof T> = [];

  Object.entries(obj).forEach(([k, o]) => BadRequiredTypes.includes(typeof o) && missing.push(k as keyof T));

  if (missing.length) {
    throw new Error(typeof error === "function" ? error(missing) : error);
  }

  return obj as GuardRequired<T>;
};

const when = (condition: boolean, error: string) => {
  if (condition) {
    throw new Error(error);
  }

  return guard;
};

const guard = { required, when };
type Guard = typeof guard;

export { guard, Guard };
