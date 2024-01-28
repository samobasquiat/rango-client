import type { SignerFactory } from 'rango-types';

import { DefaultEvmSigner } from '@samo-dev/signer-evm';
import { getNetworkInstance, Networks } from '@samo-dev/wallets-shared';
import { DefaultSignerFactory, TransactionType as TxType } from 'rango-types';

export default function getSigners(provider: any): SignerFactory {
  const ethProvider = getNetworkInstance(provider, Networks.ETHEREUM);
  const signers = new DefaultSignerFactory();
  signers.registerSigner(TxType.EVM, new DefaultEvmSigner(ethProvider));
  return signers;
}
