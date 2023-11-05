import { Button, styled } from '@rango-dev/ui';

export const Container = styled('div', {
  display: 'flex',
  justifyContent: 'space-around',
  alignItems: 'center',
  position: 'relative',
});

export const ColorDiv = styled('div', {
  border: '1px solid $neutral300',
  borderRadius: '$xs',
  width: '$20',
  height: '$20',
});
export const Cover = styled('div', {
  position: 'fixed',
  top: '0px',
  right: '0px',
  bottom: '0px',
  left: '0px',
});

export const ColorButton = styled(Button, {
  border: '1px solid $neutral300',
  backgroundColor: 'transparent',
  borderRadius: '$xs',
  width: 93,
  justifyContent: 'normal',
});