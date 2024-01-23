import type { ConfirmSwap, Params } from './useConfirmSwap.types';
import type { PendingSwapSettings } from '../../types';
import type { ConfirmRouteRequest } from 'rango-sdk';

import { calculatePendingSwap } from '@rango-dev/queue-manager-rango-preset';
import { useEffect } from 'react';

import { useAppStore } from '../../store/AppStore';
import { useQuoteStore } from '../../store/quote';
import { getWalletsForNewSwap } from '../../utils/swap';
import { useFetchConfirmQuote } from '../useFetchConfirmQuote';

import {
  generateWarnings,
  handleQuoteErrors,
  throwErrorIfResponseIsNotValid,
} from './useConfirmSwap.helpers';

export function useConfirmSwap(): ConfirmSwap {
  const {
    fromToken,
    toToken,
    inputAmount,
    setSelectedQuote,
    selectedQuote: initialQuote,
    customDestination: customDestinationFromStore,
    setQuoteWarningsConfirmed,
  } = useQuoteStore();

  const { slippage, customSlippage, disabledLiquiditySources } = useAppStore();
  const blockchains = useAppStore().blockchains();
  const tokens = useAppStore().tokens();

  const userSlippage = customSlippage || slippage;

  const { fetch: fetchQuote, cancelFetch, loading } = useFetchConfirmQuote();

  useEffect(() => cancelFetch, []);

  const fetch: ConfirmSwap['fetch'] = async (params: Params) => {
    const selectedWallets = params.selectedWallets;
    const customDestination =
      params?.customDestination ?? customDestinationFromStore;

    if (!fromToken || !toToken || !inputAmount) {
      return {
        quote: null,
        swap: null,
        error: null,
        warnings: null,
      };
    }

    const wallets = selectedWallets.reduce((acc, item) => {
      acc[item.chain] = item.address;
      return acc;
    }, {} as Record<string, string>);
    const requestBody: ConfirmRouteRequest = {
      requestId: initialQuote?.requestId || '',
      selectedWallets: wallets,
      destination: customDestination,
    };

    try {
      return await fetchQuote(requestBody).then((response) => {
        const { result: currentQuote } = response;
        throwErrorIfResponseIsNotValid({
          diagnosisMessages: currentQuote.diagnosisMessages,
          requestId: currentQuote.requestId,
          swaps: currentQuote.result?.swaps,
        });

        const swapSettings: PendingSwapSettings = {
          slippage: userSlippage.toString(),
          disabledSwappersGroups: disabledLiquiditySources,
        };
        const swap = calculatePendingSwap(
          inputAmount.toString(),
          currentQuote,
          getWalletsForNewSwap(selectedWallets),
          swapSettings,
          false,
          { blockchains, tokens }
        );

        const confirmSwapWarnings = !!initialQuote
          ? generateWarnings(initialQuote, currentQuote, {
              fromToken,
              toToken,
              meta: { blockchains, tokens },
              selectedWallets,
              userSlippage,
            })
          : null;

        if (confirmSwapWarnings?.quoteUpdate) {
          setQuoteWarningsConfirmed(false);
        }

        setSelectedQuote(currentQuote);
        return {
          quote: currentQuote,
          swap,
          error: null,
          warnings: confirmSwapWarnings,
        };
      });
    } catch (error: any) {
      const confirmSwapResult = handleQuoteErrors(error);
      return confirmSwapResult;
    }
  };

  return {
    loading,
    fetch,
    cancelFetch,
  };
}
