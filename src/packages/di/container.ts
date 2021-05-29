import { maybe } from '@fluss/core';

interface Injectable<T> {
  key: symbol;
  bean: T;
  single: boolean;
  isFactory: boolean;
}

const container = new Map<symbol, Injectable<unknown>>();

const setOptions = (key: symbol) => ({
  single: () =>
    void maybe(container.get(key)).map((injectable) =>
      container.set(key, { ...injectable, single: true })
    ),
});

export const provide = (key: symbol) => ({
  as: <T>(instance: T) => {
    container.set(key, {
      key,
      bean: instance,
      single: false,
      isFactory: false,
    });
    return setOptions(key);
  },
  asFactory: <T extends () => unknown>(factory: T) => {
    container.set(key, { key, bean: factory, single: false, isFactory: true });
    return setOptions(key);
  },
});

const getBean = <T>(injectable: Injectable<T | (() => T)>): T =>
  injectable.isFactory
    ? (injectable.bean as () => T)()
    : (injectable.bean as T);

export const inject = <T>(key: symbol): T => {
  const injectable = container.get(key) as Injectable<T> | undefined;

  if (injectable === undefined) {
    // We intentionally throw here an error to fail program
    // while development.
    throw new Error(
      `You tried to inject undefined bean with key: ${String(key)}`
    );
  }

  return injectable.single
    ? (provide(key).as(getBean<T>(injectable)), inject<T>(key))
    : getBean<T>(injectable);
};
