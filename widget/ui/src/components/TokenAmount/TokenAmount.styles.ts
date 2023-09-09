import { styled } from '@stitches/react';

export const Container = styled('div', {
  display: 'flex',
  justifyContent: 'space-between',
  variants: {
    direction: {
      vertical: {
        flexDirection: 'column',
        alignItems: 'start',
      },
      horizontal: { flexDirection: 'row', width: '100%' },
    },
  },
  '& .token-amount': {
    display: 'flex',
    justifyContent: 'center',
  },
  '& .usd-value': {
    display: 'flex',
    paddingTop: '$5',
  },
});