import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import qs from 'qs';

/**
 * Syncs filter state to query params and vice versa.
 * @param initialFilter The initial filter state object
 * @returns [filter, setFilter] - the current filter and a setter
 */
export function useSyncFilterQuery<T extends object>(
  initialFilter: T
): [T, (f: T | ((prev: T) => T)) => void] {
  const SYNC_KEYS = Object.keys(initialFilter);

  const [, setSearchParams] = useSearchParams();
  const [filter, setFilter] = useState<T>(() => {
    const params = qs.parse(window.location.search, {
      ignoreQueryPrefix: true,
    });
    const hasQuery = Object.keys(params).length > 0;
    if (!hasQuery) return initialFilter;
    const newFilter = {} as T;
    SYNC_KEYS.forEach((key) => {
      if (params[key] !== undefined && params[key] !== null) {
        const paramValue = params[key];
        if (
          typeof (initialFilter as T)[key as keyof T] === 'number' &&
          paramValue !== '' &&
          !isNaN(Number(paramValue))
        ) {
          (newFilter as T)[key as keyof T] = Number(paramValue) as T[keyof T];
        } else if (typeof paramValue === 'string') {
          (newFilter as T)[key as keyof T] = paramValue as T[keyof T];
        }
      }
    });
    return newFilter;
  });
  const filterString = useMemo(
    () => JSON.stringify(SYNC_KEYS.map((k) => filter[k as keyof T])),
    [filter, SYNC_KEYS]
  );

  const initialFilterString = useMemo(
    () => JSON.stringify(initialFilter),
    [initialFilter]
  );

  useEffect(() => {
    const params: Partial<Record<string, string>> = {};
    SYNC_KEYS.forEach((key) => {
      const value = filter[key as keyof T];
      if (value !== undefined && value !== '' && value !== null) {
        params[key] = String(value);
      }
    });
    const paramEntries = Object.entries(params) as [string, string][];
    const urlHasQuery = window.location.search.length > 0;
    const isDefault = JSON.stringify(filter) === JSON.stringify(initialFilter);

    if (isDefault && !urlHasQuery) return;
    setSearchParams(paramEntries, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterString, initialFilterString]);

  return [filter, setFilter];
}
