const _throw = (message: string, condition = true) => {
  if (condition) {
    throw { message };
  }
};

const _try = <T = void>(f: () => T, _catch?: (e: unknown) => any) => {
  try {
    return f();
  } catch (e) {
    _catch?.(e);
  }

  return void 0;
};

const random = (n: number) => Math.round(Math.random() * (n - 1));

export { _throw, _try, random };
