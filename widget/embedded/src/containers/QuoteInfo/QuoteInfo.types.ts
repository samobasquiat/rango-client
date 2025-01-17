import type { QuoteProps } from '../../components/Quote/Quote.types';
import type { QuoteError, QuoteWarning } from '../../types';
import type { BestRouteResponse } from 'rango-sdk';

export type PropTypes = {
  quote: BestRouteResponse | null;
  type: QuoteProps['type'];
  loading: boolean;
  error: QuoteError | null;
  warning: QuoteWarning | null;
  autoScrollOnExpanding?: boolean;
  expanded?: boolean;
};
