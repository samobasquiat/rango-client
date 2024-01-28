import type { SignerFactory } from 'rango-types';

import { DefaultEvmSigner } from '@samo-dev/signer-evm';
import { DefaultTronSigner } from '@samo-dev/signer-tron';
import { getNetworkInstance, Networks } from '@samo-dev/wallets-shared';
import { DefaultSignerFactory, TransactionType as TxType } from 'rango-types';

export default function getSigners(provider: any): SignerFactory {
  const ethProvider = getNetworkInstance(provider, Networks.ETHEREUM);
  const tronProvider = getNetworkInstance(provider, Networks.TRON);
  const signers = new DefaultSignerFactory();
  signers.registerSigner(TxType.EVM, new DefaultEvmSigner(ethProvider));
  signers.registerSigner(TxType.TRON, new DefaultTronSigner(tronProvider));
  return signers;
}
