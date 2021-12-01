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

const random = (max: number, min: number = 0) =>
  min + Math.round(Math.random() * (max - min));

export { _throw, _try, random };
