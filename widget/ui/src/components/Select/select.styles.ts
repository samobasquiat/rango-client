import * as Select from '@radix-ui/react-select';

import { darkTheme, styled } from '../../theme';

export const EXPANDABLE_QUOTE_TRANSITION_DURATION = 300;

export const SelectTrigger = styled(Select.Trigger, {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '119px',
  cursor: 'pointer',
  backgroundColor: '$secondary',
  padding: '0 $10',
  border: 0,
  '& svg': {
    transition: `all ${EXPANDABLE_QUOTE_TRANSITION_DURATION}ms ease`,
  },
  variants: {
    open: {
      true: {
        paddingTop: '$15',
        borderTopLeftRadius: '$sm',
        borderTopRightRadius: '$sm',
        '& ._typography, & svg': {
          color: '$secondary',
        },

        '& svg': {
          transform: 'rotate(180deg)',
        },
        backgroundColor: '$neutral100',
        [`.${darkTheme} &`]: {
          backgroundColor: '$neutral300',
        },
      },
      false: {
        borderRadius: '$md',
        paddingTop: '$5',
        paddingBottom: '$5',
        '& ._typography, & svg': {
          color: '$background',
          [`.${darkTheme} &`]: {
            color: '$foreground',
          },
        },
        '& svg': {
          transform: 'rotate(0)',
        },
      },
    },
  },
});

export const SelectContent = styled(Select.Content, {
  padding: '0 $10',
  width: '119px',
  position: 'absolute',
  top: '44px',
  maxHeight: '146px',
  overflowY: 'auto',
  paddingBottom: '$5',
  paddingTop: '$10',
  borderBottomLeftRadius: '$sm',
  borderBottomRightRadius: '$sm',
  boxShadow: '-5px 5px 10px 0px rgba(86, 86, 86, 0.10)',
  backgroundColor: '$neutral100',
  [`.${darkTheme} &`]: {
    backgroundColor: '$neutral300',
  },
});

export const SelectItem = styled(Select.Item, {
  padding: '$10 0',
  borderTop: '1px solid $neutral300',
  listStyleType: 'none',
  cursor: 'pointer',
  '&:hover': {
    '& ._typography': {
      color: '$colors$secondary',
    },
  },
  '&:focus': {
    outline: 'none',
    '& ._typography': {
      color: '$colors$secondary',
    },
  },
});
