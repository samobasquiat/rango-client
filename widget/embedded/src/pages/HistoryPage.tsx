import type { PendingSwap, PendingSwapStep } from 'rango-types';

import { i18n } from '@lingui/core';
import { useManager } from '@samo-dev/queue-manager-react';
import { Divider, NotFound, styled } from '@samo-dev/ui';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Layout, PageContainer } from '../components/Layout';
import { SearchInput } from '../components/SearchInput';
import { SwapsGroup } from '../components/SwapsGroup';
import { NotFoundContainer } from '../components/SwapsGroup/SwapsGroup.styles';
import { groupSwapsByDate } from '../utils/date';
import { containsText } from '../utils/numbers';
import { getPendingSwaps } from '../utils/queue';

const SwapsGroupContainer = styled('div', {
  overflowY: 'visible',
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: 15,
  height: '100%',
});

const isStepContainsText = (steps: PendingSwapStep[], value: string) => {
  if (!steps?.length) {
    return false;
  }
  return steps.filter(
    (step) =>
      containsText(step.fromBlockchain, value) ||
      containsText(step.toBlockchain, value) ||
      containsText(step.toSymbol, value) ||
      containsText(step.fromSymbol, value)
  ).length;
};

export function HistoryPage() {
  const navigate = useNavigate();
  const { manager, state } = useManager();
  const list: PendingSwap[] = getPendingSwaps(manager).map(({ swap }) => swap);
  const [searchedFor, setSearchedFor] = useState<string>('');
  const loading = !state.loadedFromPersistor;

  const searchHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchedFor(value);
  };

  let filteredList = list;
  if (searchedFor) {
    filteredList = list.filter(
      (swap) =>
        containsText(swap.inputAmount, searchedFor) ||
        containsText(swap.status, searchedFor) ||
        isStepContainsText(swap.steps, searchedFor) ||
        containsText(swap.requestId, searchedFor)
    );
  }

  const isEmpty = !filteredList?.length && !loading;

  return (
    <Layout
      header={{
        title: i18n.t('History'),
      }}>
      <PageContainer>
        <SearchInput
          setValue={setSearchedFor}
          fullWidth
          variant="contained"
          placeholder={i18n.t('Search Transaction')}
          autoFocus
          onChange={searchHandler}
          value={searchedFor}
        />
        <Divider size="16" />
        <SwapsGroupContainer>
          {isEmpty && (
            <NotFoundContainer>
              <Divider size={32} />
              <NotFound
                title={i18n.t('No results found')}
                description={
                  searchedFor ? i18n.t('Try using different keywords') : ''
                }
              />
            </NotFoundContainer>
          )}
          {!isEmpty && (
            <SwapsGroup
              list={filteredList}
              onSwapClick={navigate}
              groupBy={groupSwapsByDate}
              isLoading={loading}
            />
          )}
        </SwapsGroupContainer>
      </PageContainer>
    </Layout>
  );
}
