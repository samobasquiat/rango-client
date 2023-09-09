import { styled } from '../../theme';

export const BackDrop = styled('div', {
  position: 'absolute',
  top: '0',
  left: '0',
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(0,0,0,.1)',
  zIndex: 10,
  borderRadius: '$sm',
  display: 'flex',

  variants: {
    anchor: {
      bottom: {
        justifyContent: 'end',
        alignItems: 'end',
        bottom: '0',
      },
      center: {
        justifyContent: 'center',
        alignItems: 'center',
      },
    },
  },
});

export const ModalContainer = styled('div', {
  backgroundColor: '$background',
  padding: '$10 $20',
  borderRadius: '$sm',
  display: 'flex',
  flexDirection: 'column',
  zIndex: 9999999,
  variants: {
    anchor: {
      bottom: {
        width: '100%',
        maxHeight: '90%',
      },
      center: {},
    },
  },
});
export const Flex = styled('div', {
  display: 'flex',
  alignItems: 'center',
});
export const ModalHeader = styled('div', {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  position: 'relative',
  variants: {
    noTitle: {
      true: {
        justifyContent: 'flex-end',
      },
    },
  },
});