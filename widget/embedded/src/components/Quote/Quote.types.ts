import type { QuoteError, QuoteWarning } from '../../types';
import type { Step } from '@rango-dev/ui';
import type {
  BestRouteResponse,
  MultiRouteSimulationResult,
  RouteTag,
  SimulationResult,
  TagValue,
} from 'rango-sdk';
import type { ReactNode } from 'react';

export type QuoteProps = {
  type: 'basic' | 'list-item' | 'swap-preview';
  error: QuoteError | null;
  warning: QuoteWarning | null;
  recommended: boolean;
  tag?: ReactNode;
  quote: MultiRouteSimulationResult | BestRouteResponse;
  input: { value: string; usdValue: string };
  output: { value: string; usdValue?: string };
  expanded?: boolean;
  tags?: RouteTag[];
  tagHidden?: boolean;
  selectTag?: (value: { label: string; value: TagValue | string }) => void;
};

export type optionProps = {
  value: string;
  label: string;
};

export type QuoteTriggerProps = {
  quoteRef: React.MutableRefObject<HTMLButtonElement | null>;
  recommended: boolean;
  setExpanded: React.Dispatch<React.SetStateAction<boolean | undefined>>;
  steps: Step[];
  expanded?: boolean;
};

export type QuoteTriggerImagesProps = {
  content: ReactNode;
  state?: 'error' | 'warning' | undefined;
  src: string;
  open?: boolean;
  className?: string;
};

export type QuoteCostDetailsProps = {
  quote: MultiRouteSimulationResult | SimulationResult | null;
  steps: number;
};
