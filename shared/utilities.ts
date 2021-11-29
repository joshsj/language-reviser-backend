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

export { _throw, _try };
