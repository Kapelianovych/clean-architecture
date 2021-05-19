import { maybe } from '@fluss/core';

const container = new Map<symbol, object>();

const isFactory = <T>(value: unknown): value is () => T =>
  typeof value === 'function';

const setOptions = <T>(key: symbol) => ({
  single: () =>
    void maybe(container.get(key)).map((injectable) =>
      container.set(key, { ...injectable, single: true })
    ),
});

export const provide = (key: symbol) => ({
  to: <T>(instance: T) => {
    container.set(key, { key, bean: instance, single: false });
    return setOptions(key);
  },
  toFactory: <T extends () => unknown>(factory: T) => {
    container.set(key, { key, bean: factory, single: false });
    return setOptions(key);
  },
});

export const inject = <T>(key: symbol): T => {
  const bean = container.get(key) as T | (() => T);
  return isFactory(bean) ? bean() : bean;
};
