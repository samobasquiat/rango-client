import type { WidgetConfig } from '../types';

import React from 'react';
import { useRoutes } from 'react-router-dom';

import { navigationRoutes } from '../constants/navigationRoutes';
import { ConfirmSwapPage } from '../pages/ConfirmSwapPage';
import { HistoryPage } from '../pages/HistoryPage';
import { Home } from '../pages/Home';
import { LiquiditySourcePage } from '../pages/LiquiditySourcesPage';
import { SelectChainPage } from '../pages/SelectChainPage';
import { SelectTokenPage } from '../pages/SelectTokenPage';
import { SettingsPage } from '../pages/SettingsPage';
import { SwapDetailsPage } from '../pages/SwapDetailsPage';
import { ThemePage } from '../pages/ThemePage';
import { WalletsPage } from '../pages/WalletsPage';

const getAbsolutePath = (path: string) => path.replace('/', '');

interface PropTypes {
  config?: WidgetConfig;
}

export function AppRoutes(props: PropTypes) {
  const { config } = props;

  return useRoutes([
    {
      path: navigationRoutes.home,
      element: <Home />,
    },
    {
      path: navigationRoutes.fromChain,
      element: (
        <SelectChainPage
          type="from"
          supportedChains={config?.from?.blockchains}
        />
      ),
    },
    {
      path: navigationRoutes.toChain,
      element: (
        <SelectChainPage type="to" supportedChains={config?.to?.blockchains} />
      ),
    },
    {
      path: navigationRoutes.fromToken,
      element: (
        <SelectTokenPage type="from" supportedTokens={config?.from?.tokens} />
      ),
    },
    {
      path: navigationRoutes.toToken,
      element: (
        <SelectTokenPage type="to" supportedTokens={config?.to?.tokens} />
      ),
    },
    {
      path: navigationRoutes.settings,
      element: (
        <SettingsPage
          singleTheme={config?.theme?.singleTheme}
          supportedSwappers={config?.liquiditySources}
        />
      ),
    },
    {
      path: navigationRoutes.liquiditySources,
      element: (
        <LiquiditySourcePage supportedSwappers={config?.liquiditySources} />
      ),
    },
    {
      path: navigationRoutes.themes,
      element: <ThemePage />,
    },
    { path: navigationRoutes.swaps, element: <HistoryPage /> },
    {
      path: navigationRoutes.swapDetails,
      element: <SwapDetailsPage />,
    },
    {
      path: navigationRoutes.wallets,
      element: (
        <WalletsPage
          supportedWallets={config?.wallets}
          multiWallets={
            typeof config?.multiWallets === 'undefined'
              ? true
              : config.multiWallets
          }
          config={config}
        />
      ),
    },
    {
      path: getAbsolutePath(navigationRoutes.confirmSwap),
      element: (
        <ConfirmSwapPage customDestinationEnabled={config?.customDestination} />
      ),
    },
  ]);
}
