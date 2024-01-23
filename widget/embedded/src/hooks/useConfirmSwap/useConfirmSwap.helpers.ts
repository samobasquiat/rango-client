import type { ConfirmSwapFetchResult } from './useConfirmSwap.types';
import type { ConfirmSwapWarnings, QuoteResponse, Wallet } from '../../types';
import type {
  BestRouteResponse,
  BlockchainMeta,
  MultiRouteSimulationResult,
  SimulationResult,
  Token,
} from 'rango-sdk';

import { errorMessages } from '../../constants/errors';
import { QuoteErrorType, QuoteUpdateType } from '../../types';
import { numberToString } from '../../utils/numbers';
import {
  generateQuoteWarnings,
  getPriceImpact,
  isNumberOfSwapsChanged,
  isQuoteChanged,
  isQuoteInternalCoinsUpdated,
  isQuoteSwappersUpdated,
} from '../../utils/quote';
import {
  checkSlippageErrors,
  generateBalanceWarnings,
  getLimitErrorMessage,
  getMinRequiredSlippage,
  getQuoteOutputAmount,
  hasLimitError,
  isOutputAmountChangedALot,
} from '../../utils/swap';

/**
 * A request can be successful but in body of the response, it can be some case which is considered as failed.
 */
export function throwErrorIfResponseIsNotValid(response: QuoteResponse) {
  if (!response.swaps) {
    throw new Error(errorMessages().noResultError.title, {
      cause: {
        type: QuoteErrorType.NO_RESULT,
        diagnosisMessage: response.diagnosisMessages?.[0],
      },
    });
  }

  const limitError = hasLimitError(response.swaps);
  if (limitError) {
    const { swap, recommendation, fromAmountRangeError } = getLimitErrorMessage(
      response.swaps
    );

    throw new Error('bridge limit error', {
      cause: {
        type: QuoteErrorType.BRIDGE_LIMIT,
        swap: swap,
        recommendation,
        fromAmountRangeError,
      },
    });
  }

  const recommendedSlippages = checkSlippageErrors(response.swaps);

  if (recommendedSlippages) {
    const minRequiredSlippage = getMinRequiredSlippage(response.swaps);
    throw new Error('', {
      cause: {
        type: QuoteErrorType.INSUFFICIENT_SLIPPAGE,
        recommendedSlippages,
        minRequiredSlippage,
      },
    });
  }
}

export function generateWarnings(
  previousQuote: MultiRouteSimulationResult | BestRouteResponse,
  currentQuote: MultiRouteSimulationResult | BestRouteResponse,
  params: {
    fromToken: Token;
    toToken: Token;
    meta: { blockchains: BlockchainMeta[]; tokens: Token[] };
    selectedWallets: Wallet[];
    userSlippage: number;
  }
): ConfirmSwapWarnings {
  const innerPreviousQuote =
    'result' in previousQuote
      ? (previousQuote.result as SimulationResult)
      : previousQuote;
  const innerCurrentQuote =
    'result' in currentQuote
      ? (currentQuote.result as SimulationResult)
      : currentQuote;
  let quoteChanged = false;
  if (previousQuote) {
    quoteChanged = isQuoteChanged(innerPreviousQuote, innerCurrentQuote);
  }
  const output: ConfirmSwapWarnings = {
    quote: null,
    quoteUpdate: null,
    balance: null,
  };

  const quoteWarning = generateQuoteWarnings(currentQuote, {
    fromToken: params.fromToken,
    toToken: params.toToken,
    tokens: params.meta.tokens,
    userSlippage: params.userSlippage,
    requestAmount: '',
  });

  if (quoteWarning) {
    output.quote = quoteWarning;
  }

  if (previousQuote && quoteChanged) {
    if (isOutputAmountChangedALot(innerPreviousQuote, innerCurrentQuote)) {
      output.quoteUpdate = {
        type: QuoteUpdateType.QUOTE_AND_OUTPUT_AMOUNT_UPDATED,
        newOutputAmount: numberToString(
          getQuoteOutputAmount(innerCurrentQuote)
        ),
        percentageChange: numberToString(
          getPriceImpact(
            getQuoteOutputAmount(innerPreviousQuote) ?? '',
            getQuoteOutputAmount(innerCurrentQuote) ?? ''
          ),
          null,
          2
        ),
      };
    } else if (isNumberOfSwapsChanged(innerPreviousQuote, innerCurrentQuote)) {
      output.quoteUpdate = {
        type: QuoteUpdateType.QUOTE_UPDATED,
      };
    } else if (isQuoteSwappersUpdated(innerPreviousQuote, innerCurrentQuote)) {
      output.quoteUpdate = {
        type: QuoteUpdateType.QUOTE_SWAPPERS_UPDATED,
      };
    } else if (
      isQuoteInternalCoinsUpdated(innerPreviousQuote, innerCurrentQuote)
    ) {
      output.quoteUpdate = {
        type: QuoteUpdateType.QUOTE_COINS_UPDATED,
      };
    }
  }

  const balanceWarnings = generateBalanceWarnings(
    currentQuote,
    params.selectedWallets,
    params.meta.blockchains
  );
  const enoughBalance = balanceWarnings.length === 0;

  if (!enoughBalance) {
    output.balance = {
      messages: balanceWarnings,
    };
  }

  return output;
}

export function handleQuoteErrors(error: any): ConfirmSwapFetchResult {
  if (error?.code === 'ERR_CANCELED') {
    return {
      swap: null,
      error: {
        type: QuoteErrorType.REQUEST_CANCELED,
      },
      warnings: null,
    };
  }

  if (error.cause) {
    return {
      swap: null,
      error: error.cause,
      warnings: null,
    };
  }

  return {
    swap: null,
    error: {
      type: QuoteErrorType.REQUEST_FAILED,
    },
    warnings: null,
  };
}
