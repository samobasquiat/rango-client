import type { ConfirmRouteRequest, ConfirmRouteResponse } from 'rango-sdk';

import { useRef, useState } from 'react';

import { httpService } from '../services/httpService';

interface UseFetchConfirmQuote {
  fetch: (requestBody: ConfirmRouteRequest) => Promise<ConfirmRouteResponse>;
  cancelFetch: () => void;
  loading: boolean;
}

export function useFetchConfirmQuote(): UseFetchConfirmQuote {
  const [loading, setLoading] = useState(false);
  const abortController = useRef<AbortController | null>(null);
  const cancel = () => abortController.current?.abort();

  const fetch: UseFetchConfirmQuote['fetch'] = async (requestBody) => {
    cancel();
    abortController.current = new AbortController();

    setLoading(true);
    try {
      const res = await httpService().confirmRouteRequest(requestBody, {
        signal: abortController.current.signal,
      });
      abortController.current = null;

      return res;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any, no-useless-catch
    } catch (error: any) {
      throw error;
    } finally {
      setLoading(false);
    }
  };
  return { fetch, loading, cancelFetch: cancel };
}
