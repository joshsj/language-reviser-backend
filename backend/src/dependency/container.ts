type Provide<T extends {}> = <TName extends keyof T>(
  name: TName,
  impl: T[TName]
) => Container<T>;

type Resolve<T extends {}> = <TName extends keyof T>(
  name: TName
) => T[TName] | undefined;

type Container<T extends {}> = {
  provide: Provide<T>;
  resolve: Resolve<T>;
};

const createContainer = <T extends {}>(
  dependencies: T,
  parent?: Container<T>
): Container<T> => {
  const provide: Provide<T> = (name, obj) => {
    !dependencies[name] && (dependencies[name] = obj);

    return container;
  };

  const resolve: Resolve<T> = (name) =>
    dependencies[name] ?? parent?.resolve(name);

  const container: Container<T> = { provide, resolve };

  return container;
};

export { Container, Provide, Resolve, createContainer };
