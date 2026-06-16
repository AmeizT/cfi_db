import type { Messages } from './types';
import { useTranslations as _useTranslations } from 'next-intl';

type DeepTranslate<T> = {
    [K in keyof T]: T[K] extends Record<string, unknown>
    ? DeepTranslate<T[K]>
    : string;
};

const RESERVED_KEYS = new Set([
    'toString',
    'valueOf',
    'inspect',
    'constructor',
    'displayName',
]);

export function useTypedTranslations<K extends keyof Messages>(namespace: K) {
    const t = _useTranslations(namespace);

    const createProxy = (path = ''): unknown =>
        new Proxy(() => '', {
            get(_, prop: string | symbol) {
                // ✅ Ignore symbols
                if (typeof prop !== 'string') return undefined;

                // ✅ Ignore React / JS internals
                if (RESERVED_KEYS.has(prop)) {
                    return () => path; // or return undefined
                }

                const fullPath = path ? `${path}.${prop}` : prop;
                return createProxy(fullPath);
            },

            apply() {
                return (t as unknown as (key: string) => string)(path);
            },
        });

    return {
        t,
        typed: createProxy() as DeepTranslate<Messages[K]>,
    };
}