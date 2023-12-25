import type { BlockchainMeta, Token } from 'rango-sdk';

import { useInRouterContext, useSearchParams } from 'react-router-dom';

import { SearchParams } from '../../constants/searchParams';
import { useAppStore } from '../../store/AppStore';
import { useQuoteStore } from '../../store/quote';

type UseUpdateQuoteParams = {
  setFromBlockchain: (blockchain: BlockchainMeta | null) => void;
  setToBlockchain: (blockchain: BlockchainMeta | null) => void;
  setFromToken: (token: Token | null) => void;
  setToToken: (token: Token | null) => void;
  setInputAmount: (amount: string) => void;
};

function blockchainToSearchParam(blockchain: BlockchainMeta | null): string {
  return blockchain?.name ?? '';
}

function tokenToSearchParam(token: Token | null): string {
  return (token?.symbol ?? '') + (token?.address ? `--${token?.address}` : '');
}

function updateSearchParams(
  prevSearchParams: URLSearchParams,
  updatedSearchParams?: Record<string, string>
) {
  const fromBlockchain = prevSearchParams.get(SearchParams.FROM_CHAIN);
  const fromToken = prevSearchParams.get(SearchParams.FROM_TOKEN);
  const toBlockchain = prevSearchParams.get(SearchParams.TO_CHAIN);
  const toToken = prevSearchParams.get(SearchParams.TO_TOKEN);
  const fromAmount = prevSearchParams.get(SearchParams.FROM_AMOUNT);
  const autoConnectWallet = prevSearchParams.get(SearchParams.AUTO_CONNECT);
  return {
    ...(fromBlockchain && {
      [SearchParams.FROM_CHAIN]: fromBlockchain,
    }),
    ...(fromToken && {
      [SearchParams.FROM_TOKEN]: fromToken,
    }),
    ...(toBlockchain && { [SearchParams.TO_CHAIN]: toBlockchain }),
    ...(toToken && { [SearchParams.TO_TOKEN]: toToken }),
    ...(fromAmount && {
      [SearchParams.FROM_AMOUNT]: fromAmount.toString(),
    }),
    ...(autoConnectWallet && {
      [SearchParams.AUTO_CONNECT]: autoConnectWallet,
    }),
    ...updatedSearchParams,
  };
}

export function useUpdateQuoteParams(): UseUpdateQuoteParams {
  const [, setSearchParams] = useSearchParams();
  const isRouterInContext = useInRouterContext();
  const { blockchains, tokens } = useAppStore();
  const meta = { blockchains: blockchains(), tokens: tokens() };
  const quoteStore = useQuoteStore();

  const setFromBlockchain: UseUpdateQuoteParams['setFromBlockchain'] = (
    blockchain
  ) => {
    quoteStore.setFromBlockchain(blockchain);
    if (isRouterInContext) {
      setSearchParams(
        (prevSearchParams) =>
          updateSearchParams(prevSearchParams, {
            [SearchParams.FROM_CHAIN]: blockchainToSearchParam(blockchain),
          }),
        { replace: true }
      );
    }
  };
  const setFromToken: UseUpdateQuoteParams['setFromToken'] = (token) => {
    quoteStore.setFromToken({ token, meta });
    if (isRouterInContext) {
      setSearchParams(
        (prevSearchParams) =>
          updateSearchParams(prevSearchParams, {
            [SearchParams.FROM_CHAIN]: token?.blockchain ?? '',
            [SearchParams.FROM_TOKEN]: tokenToSearchParam(token),
          }),
        { replace: true }
      );
    }
  };
  const setToBlockchain: UseUpdateQuoteParams['setToBlockchain'] = (
    blockchain
  ) => {
    quoteStore.setFromBlockchain(blockchain);
    if (isRouterInContext) {
      setSearchParams(
        (prevSearchParams) =>
          updateSearchParams(prevSearchParams, {
            [SearchParams.TO_CHAIN]: blockchainToSearchParam(blockchain),
          }),
        { replace: true }
      );
    }
  };

  const setToToken: UseUpdateQuoteParams['setToToken'] = (token) => {
    quoteStore.setToToken({ token, meta });
    if (isRouterInContext) {
      setSearchParams(
        (prevSearchParams) =>
          updateSearchParams(prevSearchParams, {
            [SearchParams.TO_CHAIN]: token?.blockchain ?? '',
            [SearchParams.TO_TOKEN]: tokenToSearchParam(token),
          }),
        { replace: true }
      );
    }
  };
  const setInputAmount: UseUpdateQuoteParams['setInputAmount'] = (amount) => {
    quoteStore.setInputAmount(amount);
    if (isRouterInContext) {
      setSearchParams(
        (prevSearchParams) =>
          updateSearchParams(prevSearchParams, {
            ...(amount && { [SearchParams.FROM_AMOUNT]: amount }),
          }),
        { replace: true }
      );
    }
  };

  return {
    setFromBlockchain,
    setFromToken,
    setToBlockchain,
    setToToken,
    setInputAmount,
  };
}
