import type { PropTypes } from './QuoteInfo.types';

import React from 'react';

import { Quote } from '../../components/Quote';
import { QuoteSkeleton } from '../../components/QuoteSkeleton';
import { useQuoteStore } from '../../store/quote';
import { QuoteErrorType } from '../../types';

import { QuoteContainer } from './QuoteInfo.styles';

export function QuoteInfo(props: PropTypes) {
  const {
    quote,
    type,
    loading,
    error,
    warning,
    expanded = false,
    recommended = true,
    selectTag,
    tagHidden,
    onClick,
    tags,
  } = props;
  const { inputAmount, inputUsdValue, outputUsdValue, outputAmount } =
    useQuoteStore();

  const noResult =
    error &&
    (error.type === QuoteErrorType.NO_RESULT ||
      error.type === QuoteErrorType.REQUEST_FAILED);

  const showQuote = !noResult && quote && !loading;

  if (loading) {
    return (
      <QuoteContainer>
        <QuoteSkeleton tag={!tagHidden} type={type} expanded={expanded} />
      </QuoteContainer>
    );
  }

  return showQuote ? (
    <QuoteContainer onClick={() => onClick && onClick(quote)}>
      <Quote
        quote={quote}
        error={error}
        warning={warning}
        tags={tags}
        tagHidden={tagHidden}
        type={type}
        expanded={expanded}
        recommended={recommended}
        selectTag={selectTag}
        input={{
          value: inputAmount,
          usdValue: inputUsdValue?.toString() ?? '',
        }}
        output={{
          value: outputAmount?.toString() ?? '',
          usdValue: outputUsdValue?.toString() ?? '',
        }}
      />
    </QuoteContainer>
  ) : null;
}
