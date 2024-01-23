import { styled } from '@rango-dev/ui';

export const Blockchains = styled('div', {
  display: 'grid',
  gap: '$10',
  gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
  '@xs': {
    gridTemplateColumns: 'repeat(6, minmax(0, 1fr))',
  },
});
