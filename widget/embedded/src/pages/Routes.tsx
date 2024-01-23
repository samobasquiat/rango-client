import type { BestRouteResponse, MultiRouteSimulationResult } from 'rango-sdk';

import { i18n } from '@lingui/core';
import { Divider } from '@rango-dev/ui';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { HomeButtons } from '../components/HeaderButtons';
import { Layout, PageContainer } from '../components/Layout';
import { QuoteSkeleton } from '../components/QuoteSkeleton';
import { navigationRoutes } from '../constants/navigationRoutes';
import { QuoteInfo } from '../containers/QuoteInfo';
import { useNavigateBack } from '../hooks/useNavigateBack';
import { useSwapInput } from '../hooks/useSwapInput';
import { useQuoteStore } from '../store/quote';
import { sortTags } from '../utils/quote';

const ITEM_SKELETON_COUNT = 6;
export function RoutesPage() {
  const navigate = useNavigate();
  const navigateBack = useNavigateBack();

  const {
    selectedQuote,
    quotes,
    refetchQuote,
    setSelectedQuote,
    setSelectedTag,
    setRefetchQuote,
  } = useQuoteStore();
  const {
    fetch: fetchQuote,
    loading: fetchingQuote,
    error: quoteError,
  } = useSwapInput({ refetchQuote });

  const onClickOnQuote = (
    quote: MultiRouteSimulationResult | BestRouteResponse
  ) => {
    setSelectedQuote(quote);
    if ('tags' in quote) {
      const sortedQuoteTags = sortTags(quote.tags);
      setSelectedTag(sortedQuoteTags[0]);
    }
    navigateBack();
  };
  useEffect(() => {
    setRefetchQuote(false);
  }, []);

  return (
    <Layout
      hasLogo
      header={{
        onWallet: () => {
          navigate(`/${navigationRoutes.wallets}`);
        },
        title: i18n.t('Routes'),
        suffix: (
          <HomeButtons
            onClickRefresh={
              !!selectedQuote || quoteError ? fetchQuote : undefined
            }
            notificationsHidden
            onClickSettings={() => navigate(`/${navigationRoutes.settings}`)}
          />
        ),
      }}>
      <PageContainer>
        {fetchingQuote
          ? Array.from(Array(ITEM_SKELETON_COUNT), (e) => (
              <React.Fragment key={e}>
                <QuoteSkeleton tag type="list-item" expanded={false} />
                <Divider size={16} />
              </React.Fragment>
            ))
          : !!quotes &&
            quotes.results?.map((route) => (
              <React.Fragment key={route.requestId}>
                <QuoteInfo
                  tagHidden={false}
                  quote={route}
                  loading={fetchingQuote}
                  error={null}
                  warning={null}
                  onClick={onClickOnQuote}
                  type="list-item"
                  recommended={selectedQuote?.requestId === route.requestId}
                />
                <Divider size={16} />
              </React.Fragment>
            ))}
      </PageContainer>
    </Layout>
  );
}
