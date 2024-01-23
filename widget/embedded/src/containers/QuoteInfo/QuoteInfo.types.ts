import type { QuoteProps } from '../../components/Quote/Quote.types';
import type { QuoteError, QuoteWarning } from '../../types';
import type {
  BestRouteResponse,
  MultiRouteSimulationResult,
  RouteTag,
  TagValue,
} from 'rango-sdk';

export type PropTypes = {
  quote: MultiRouteSimulationResult | BestRouteResponse | null;
  type: QuoteProps['type'];
  onClick?: (quote: MultiRouteSimulationResult | BestRouteResponse) => void;
  loading: boolean;
  tagHidden?: boolean;
  error: QuoteError | null;
  warning: QuoteWarning | null;
  autoScrollOnExpanding?: boolean;
  expanded?: boolean;
  recommended?: boolean;
  tags?: RouteTag[];
  selectTag?: (value: { label: string; value: TagValue | string }) => void;
};
