import type { PropTypes } from './HistoryGroupedList.types';

import { i18n } from '@lingui/core';
import {
  Divider,
  GroupedVirtualizedList,
  SwapListItem,
  Typography,
} from '@rango-dev/ui';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import {
  TOKEN_AMOUNT_MAX_DECIMALS,
  TOKEN_AMOUNT_MIN_DECIMALS,
} from '../../constants/routing';
import { getContainer } from '../../utils/common';
import { formatTooltipNumbers, numberToString } from '../../utils/numbers';

import {
  Group,
  groupStyles,
  SwapItemContainer,
  SwapList,
  Time,
} from './HistoryGroupedList.styles';

const ITEMS_PER_PAGE = 10;

export function HistoryGroupedList(props: PropTypes) {
  const { list, onSwapClick, groupBy, isLoading } = props;
  const [currentGroupCounts, setCurrentGroupCounts] = useState<number[]>([]);
  const loadedItems = useRef(0);
  const { swaps, groupCounts, groups } = groupBy(list);

  const calculateGroupsSoFar = useCallback(
    (totalGroups: number[], count: number) => {
      const groups: number[] = [];
      let index = 0;
      do {
        const group = totalGroups[index];
        groups.push(Math.min(group, count));
        count -= group;
        index++;
      } while (count > 0 && index <= totalGroups.length);
      return groups;
    },
    []
  );

  const loadMore = useCallback(() => {
    const remainedItems = list.length - loadedItems.current;
    if (remainedItems) {
      loadedItems.current += Math.min(remainedItems, ITEMS_PER_PAGE);
      setCurrentGroupCounts(
        calculateGroupsSoFar(groupCounts, loadedItems.current)
      );
    }
  }, [list.length]);

  useEffect(() => {
    if (!isLoading) {
      loadMore();
    }
  }, [isLoading, loadMore]);

  if (isLoading) {
    const swaps = [{}, {}];

    const loadingGroups = [
      {
        title: i18n.t('Today'),
        swaps,
      },
      {
        title: i18n.t('This month'),
        swaps,
      },
    ];
    return (
      <>
        {loadingGroups.map((group) => (
          <React.Fragment key={group.title}>
            <Group>
              <Time>
                <Typography
                  variant="label"
                  size="medium"
                  className={groupStyles()}>
                  {group.title}
                </Typography>
              </Time>
              <Divider size={4} />
              <SwapList>
                {group.swaps.map((_, index) => {
                  const key = index + group.title;
                  return (
                    <React.Fragment key={key}>
                      <SwapListItem isLoading={true} />
                    </React.Fragment>
                  );
                })}
              </SwapList>
            </Group>
          </React.Fragment>
        ))}
      </>
    );
  }

  return (
    <GroupedVirtualizedList
      endReached={() => {
        if (loadedItems.current < list.length) {
          loadMore();
        }
      }}
      groupCounts={currentGroupCounts}
      groupContent={(index) => {
        return (
          <Group>
            <Time>
              <Typography
                variant="label"
                size="medium"
                className={groupStyles()}>
                {groups[index]}
              </Typography>
            </Time>
          </Group>
        );
      }}
      itemContent={(index, groupIndex) => {
        const swap = swaps[index];
        const firstStep = swap.steps[0];
        const lastStep = swap.steps[swap.steps.length - 1];
        return (
          <SwapItemContainer key={swap.requestId}>
            <SwapListItem
              requestId={swap.requestId}
              creationTime={swap.creationTime}
              status={swap.status}
              onClick={onSwapClick}
              tooltipContainer={getContainer()}
              onlyShowTime={groups[groupIndex] === i18n.t('Today')}
              swapTokenData={{
                from: {
                  token: {
                    image: firstStep.fromLogo,
                    displayName: firstStep.fromSymbol,
                  },
                  blockchain: {
                    image: firstStep.fromBlockchainLogo || '',
                  },
                  amount: numberToString(
                    swap.inputAmount,
                    TOKEN_AMOUNT_MIN_DECIMALS,
                    TOKEN_AMOUNT_MAX_DECIMALS
                  ),
                  realAmount: formatTooltipNumbers(swap.inputAmount),
                },
                to: {
                  token: {
                    image: lastStep.toLogo,
                    displayName: lastStep.toSymbol,
                  },
                  blockchain: {
                    image: lastStep.toBlockchainLogo || '',
                  },
                  amount: numberToString(
                    lastStep.outputAmount ||
                      lastStep.expectedOutputAmountHumanReadable ||
                      '',
                    TOKEN_AMOUNT_MIN_DECIMALS,
                    TOKEN_AMOUNT_MAX_DECIMALS
                  ),
                  realAmount: formatTooltipNumbers(
                    lastStep.outputAmount ||
                      lastStep.expectedOutputAmountHumanReadable
                  ),
                },
              }}
            />
          </SwapItemContainer>
        );
      }}
    />
  );
}
