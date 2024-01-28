import type { WidgetConfig } from '../../types';
import type { EventHandler } from '@samo-dev/wallets-react';

export type PropTypes = {
  onUpdateState?: EventHandler;
  config: WidgetConfig;
};
