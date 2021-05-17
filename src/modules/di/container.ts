const container = new Map<symbol, object>();

type Bean = Record<string, any>;

interface Bound {
  key: symbol;
  bean: Bean;
  single: boolean;
}

let bounds: ReadonlyArray<Bound> = [];

const updateBounds = (changed: ReadonlyArray<Bound>): void =>
  void (bounds = changed);

const isFactory = (value: unknown): value is () => Bean =>
  typeof value === 'function';

const setOptions = <T extends Bean>(key: symbol) => ({
  single: () =>
    updateBounds(
      bounds
        .filter(({ key: beanKey }) => key === beanKey)
        .map(({ key, bean }) => ({
          key,
          bean,
          single: true,
        }))
    ),
});

export const init = () =>
  bounds.forEach(({ key, bean, single }) =>
    single
      ? isFactory(bean)
        ? container.set(key, bean())
        : container.set(key, bean)
      : container.set(key, bean)
  );

export const bind = (key: symbol) => ({
  to: <T extends Bean>(instance: T) => {
    updateBounds(bounds.concat({ key, bean: instance, single: false }));
    return setOptions(key);
  },
  toFactory: <T extends () => Bean>(factory: T) => {
    updateBounds(bounds.concat({ key, bean: factory, single: false }));
    return setOptions(key);
  },
});

export const inject = <T extends Bean>(key: symbol): T => {
  const bean = container.get(key) as T | (() => T);
  return isFactory(bean) ? bean() : bean;
};
