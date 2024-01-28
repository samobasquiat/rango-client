import type { PropTypes } from './WalletModal.types';

import { Divider, Modal } from '@samo-dev/ui';
import React from 'react';

import { WIDGET_UI_ID } from '../../constants';

import { ModalContent } from './WalletModalContent';

export function WalletModal(props: PropTypes) {
  const { open, onClose, ...otherProps } = props;

  return (
    <Modal
      open={open}
      onClose={onClose}
      container={
        document.getElementById(WIDGET_UI_ID.SWAP_BOX_ID) || document.body
      }>
      <ModalContent {...otherProps} />
      <Divider direction="vertical" size={32} />
    </Modal>
  );
}
