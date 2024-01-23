/* eslint-disable @typescript-eslint/no-magic-numbers */
import type { QuoteWarning, SortStrategy, Wallet } from '../types';
import type { PriceImpactWarningLevel, Step } from '@rango-dev/ui';
import type {
  SimulationAssetAndAmount,
  SimulationValidationStatus,
} from '@rango-dev/ui/dist/widget/ui/src/types/swaps';
import type {
  Asset,
  BestRouteResponse,
  BlockchainMeta,
  MultiRouteResponse,
  MultiRouteSimulationResult,
  RouteTag,
  SimulationResult,
  Token,
} from 'rango-sdk';
import type { PendingSwap } from 'rango-types';

import { getLastSuccessfulStep } from '@rango-dev/queue-manager-rango-preset';
import BigNumber from 'bignumber.js';

import { HIGH_PRIORITY_TAGS, ROUTE_SORTING_STRATEGY } from '../constants/quote';
import { HIGHT_PRICE_IMPACT, LOW_PRICE_IMPACT } from '../constants/routing';
import { HIGH_SLIPPAGE } from '../constants/swapSettings';
import { getUsdValue } from '../store/quote';
import { QuoteWarningType } from '../types';

import { areEqual } from './common';
import { findBlockchain, findToken } from './meta';
import {
  checkSlippageWarnings,
  getMinRequiredSlippage,
  getPercentageChange,
  getTotalFeeInUsd,
  hasHighValueLoss,
  hasProperSlippage,
} from './swap';

export function getQuoteToTokenUsdPrice(
  quote: MultiRouteSimulationResult | SimulationResult | null
): number | null | undefined {
  return quote?.swaps[quote?.swaps.length - 1].to.usdPrice;
}

export function isNumberOfSwapsChanged(
  quoteA: MultiRouteSimulationResult | SimulationResult,
  quoteB: MultiRouteSimulationResult | SimulationResult
) {
  const quoteASwaps = quoteA?.swaps || [];
  const quoteBSwaps = quoteB?.swaps || [];
  return quoteASwaps.length !== quoteBSwaps.length;
}

export function isQuoteSwappersUpdated(
  quoteA: MultiRouteSimulationResult | SimulationResult,
  quoteB: MultiRouteSimulationResult | SimulationResult
) {
  const quoteASwappers = quoteA?.swaps.map((swap) => swap.swapperId) || [];
  const quoteBSwappers = quoteB?.swaps.map((swap) => swap.swapperId) || [];
  return !areEqual(quoteASwappers, quoteBSwappers);
}

export function isQuoteInternalCoinsUpdated(
  quoteA: MultiRouteSimulationResult | SimulationResult,
  quoteB: MultiRouteSimulationResult | SimulationResult
) {
  const quoteAInternalCoins = quoteA?.swaps.map((swap) => swap.to.symbol) || [];
  const quoteBInternalCoins = quoteB?.swaps.map((swap) => swap.to.symbol) || [];
  return !areEqual(quoteAInternalCoins, quoteBInternalCoins);
}

export function isQuoteChanged(
  quoteA: MultiRouteSimulationResult | SimulationResult,
  quoteB: MultiRouteSimulationResult | SimulationResult
): boolean {
  return (
    isNumberOfSwapsChanged(quoteA, quoteB) ||
    isQuoteSwappersUpdated(quoteA, quoteB) ||
    isQuoteInternalCoinsUpdated(quoteA, quoteB)
  );
}

export function outToRatioHasWarning(
  fromUsdValue: BigNumber | null,
  outToInRatio: BigNumber | 0
) {
  return (
    (parseInt(outToInRatio?.toFixed(2) || '0') <= -10 &&
      (fromUsdValue === null || fromUsdValue.gte(new BigNumber(200)))) ||
    (parseInt(outToInRatio?.toFixed(2) || '0') <= -5 &&
      (fromUsdValue === null || fromUsdValue.gte(new BigNumber(1000))))
  );
}

export function getRequiredBalanceOfWallet(
  selectedWallet: Wallet,
  fee: SimulationValidationStatus[] | null
): SimulationAssetAndAmount[] | null {
  if (fee === null) {
    return null;
  }
  const relatedFeeStatus = fee
    ?.find((item) => item.blockchain === selectedWallet.chain)
    ?.wallets.find(
      (wallet) =>
        wallet.address?.toLowerCase() === selectedWallet.address.toLowerCase()
    );
  if (!relatedFeeStatus) {
    return null;
  }
  return relatedFeeStatus.requiredAssets;
}

export function getPriceImpactLevel(
  priceImpact: number
): PriceImpactWarningLevel {
  let warningLevel: PriceImpactWarningLevel = undefined;
  if (priceImpact <= LOW_PRICE_IMPACT && priceImpact > HIGHT_PRICE_IMPACT) {
    warningLevel = 'low';
  } else if (priceImpact <= HIGHT_PRICE_IMPACT) {
    warningLevel = 'high';
  }

  return warningLevel;
}

export function findCommonTokens<T extends Asset[], R extends Asset[]>(
  listA: T,
  listB: R
) {
  const tokenToString = (token: Asset): string =>
    `${token.symbol}-${token.blockchain}-${token.address ?? ''}`;

  const set = new Set();

  listA.forEach((token) => set.add(tokenToString(token)));

  return listB.filter((token) => set.has(tokenToString(token))) as R;
}

export function createRetryQuote(
  pendingSwap: PendingSwap,
  blockchains: BlockchainMeta[],
  tokens: Token[]
): {
  fromBlockchain: BlockchainMeta | null;
  fromToken: Token | null;
  toBlockchain: BlockchainMeta | null;
  toToken: Token | null;
  inputAmount: string;
} {
  const firstStep = pendingSwap.steps[0];
  const lastStep = pendingSwap.steps[pendingSwap.steps.length - 1];
  const lastSuccessfulStep = getLastSuccessfulStep(pendingSwap.steps);

  const toToken = {
    blockchain: lastStep.toBlockchain,
    symbol: lastStep.toSymbol,
    address: lastStep.toSymbolAddress,
  };

  const fromBlockchainMeta = findBlockchain(
    lastSuccessfulStep
      ? lastSuccessfulStep.toBlockchain
      : firstStep.fromBlockchain,
    blockchains
  );
  const toBlockchainMeta = findBlockchain(lastStep.toBlockchain, blockchains);
  const fromTokenMeta = findToken(
    lastSuccessfulStep
      ? {
          blockchain: fromBlockchainMeta?.name ?? '',
          symbol: lastSuccessfulStep.toSymbol,
          address: lastSuccessfulStep.toSymbolAddress,
        }
      : {
          blockchain: fromBlockchainMeta?.name ?? '',
          symbol: firstStep.fromSymbol,
          address: firstStep.fromSymbolAddress,
        },
    tokens
  );
  const toTokenMeta = findToken(toToken, tokens);
  const inputAmount = lastSuccessfulStep
    ? lastSuccessfulStep.outputAmount ?? ''
    : pendingSwap.inputAmount;

  return {
    fromBlockchain: fromBlockchainMeta,
    fromToken: fromTokenMeta,
    toBlockchain: toBlockchainMeta,
    toToken: toTokenMeta,
    inputAmount,
  };
}

export function generateQuoteWarnings(
  quote: MultiRouteSimulationResult | BestRouteResponse,
  params: {
    fromToken: Token;
    toToken: Token;
    tokens: Token[];
    userSlippage: number;
    requestAmount: string;
  }
): QuoteWarning | null {
  const innerQuote =
    'result' in quote ? (quote.result as SimulationResult) : quote;

  const { fromToken, toToken, tokens, userSlippage, requestAmount } = params;
  const inputUsdValue = getUsdValue(fromToken, requestAmount);
  const outputUsdValue = getUsdValue(toToken, innerQuote?.outputAmount ?? '');

  if (!!quote && inputUsdValue && outputUsdValue) {
    const priceImpact = getPriceImpact(
      inputUsdValue.toString(),
      outputUsdValue.toString()
    );
    const highValueLoss =
      !!priceImpact && hasHighValueLoss(inputUsdValue, priceImpact);

    if (highValueLoss) {
      const totalFee = getTotalFeeInUsd(innerQuote?.swaps, tokens);
      const warningLevel = getPriceImpactLevel(priceImpact);
      return {
        type: QuoteWarningType.HIGH_VALUE_LOSS,
        inputUsdValue,
        outputUsdValue,
        priceImpact,
        totalFee,
        warningLevel,
      };
    }
  } else if (quote && (!inputUsdValue || !outputUsdValue)) {
    return { type: QuoteWarningType.UNKNOWN_PRICE };
  }

  const minRequiredSlippage = getMinRequiredSlippage(innerQuote.swaps);
  const highSlippage = userSlippage > HIGH_SLIPPAGE;

  if (!hasProperSlippage(params.userSlippage.toString(), minRequiredSlippage)) {
    return {
      type: QuoteWarningType.INSUFFICIENT_SLIPPAGE,
      recommendedSlippages: checkSlippageWarnings(innerQuote, userSlippage),
      minRequiredSlippage: minRequiredSlippage,
    };
  } else if (
    highSlippage &&
    parseFloat(minRequiredSlippage ?? '0') < userSlippage
  ) {
    return {
      type: QuoteWarningType.HIGH_SLIPPAGE,
      slippage: userSlippage.toString(),
    };
  }

  return null;
}

export function getPriceImpact(
  inputUsdValue: BigNumber | string | null,
  outputUsdValue: BigNumber | string | null
): number | null {
  const outputUsdValueIsInvalid =
    typeof outputUsdValue === 'string'
      ? parseFloat(outputUsdValue) <= 0
      : !outputUsdValue?.gt(0);
  const percentageChange =
    !inputUsdValue || !outputUsdValue || outputUsdValueIsInvalid
      ? null
      : getPercentageChange(
          inputUsdValue.toString(),
          outputUsdValue.toString()
        );

  return percentageChange && percentageChange < 0 ? percentageChange : null;
}

export const getUniqueBlockchains = (steps: Step[]) => {
  const set = new Set();
  const result: { displayName: string; image: string }[] = [];
  steps.forEach((step) => {
    if (!set.has(step.from.chain.displayName)) {
      set.add(step.from.chain.displayName);
      result.push(step.from.chain);
    }
    if (!set.has(step.to.chain.displayName)) {
      set.add(step.to.chain.displayName);
      result.push(step.to.chain);
    }
  });

  return result;
};

export const sortRoutesBy = (
  strategy: SortStrategy,
  routes: MultiRouteResponse['results']
): MultiRouteResponse['results'] => {
  return routes.sort((route1, route2) => {
    const sortPreferenceType = ROUTE_SORTING_STRATEGY[strategy];

    const route1Score =
      route1.scores?.find(
        (score) => score.preferenceType === sortPreferenceType
      )?.score ?? 0;
    const route2Score =
      route2.scores?.find(
        (score) => score.preferenceType === sortPreferenceType
      )?.score ?? 0;

    if (sortPreferenceType === 'NET_OUTPUT' || sortPreferenceType === 'PRICE') {
      return route2Score - route1Score;
    }
    return route1Score - route2Score;
  });
};
// Function to get a unique key for each object
const getKey = (obj: RouteTag) => obj.value;
export function getUniqueTags(tags: RouteTag[]) {
  // Create a Map to store unique objects based on their key
  const uniqueObjectsMap = new Map();

  tags.forEach((obj) => {
    const key = getKey(obj);
    uniqueObjectsMap.set(key, obj);
  });
  // Convert the Map values back to an array
  return Array.from(uniqueObjectsMap.values());
}

export const sortTags = (tags: RouteTag[]): RouteTag[] => {
  const customSort = (a: RouteTag, b: RouteTag) => {
    const indexA = HIGH_PRIORITY_TAGS.indexOf(a.value);
    const indexB = HIGH_PRIORITY_TAGS.indexOf(b.value);

    if (indexA !== -1 && indexB !== -1) {
      return indexA - indexB;
    }

    if (indexA !== -1) {
      return -1;
    } else if (indexB !== -1) {
      return 1;
    }

    return 0;
  };

  return tags.sort(customSort);
};
