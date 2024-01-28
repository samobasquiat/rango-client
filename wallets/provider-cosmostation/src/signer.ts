import { DefaultEvmSigner } from '@samo-dev/signer-evm';
import { DefaultCosmosSigner } from '@samo-dev/signer-cosmos';
import { Networks, getNetworkInstance } from '@samo-dev/wallets-shared';
import {
  DefaultSignerFactory,
  SignerFactory,
  TransactionType as TxType,
} from 'rango-types';

export default function getSigners(provider: any): SignerFactory {
  const ethProvider = getNetworkInstance(provider, Networks.ETHEREUM);
  const cosmosProvider = getNetworkInstance(provider, Networks.COSMOS);
  const signers = new DefaultSignerFactory();
  signers.registerSigner(TxType.EVM, new DefaultEvmSigner(ethProvider));
  signers.registerSigner(
    TxType.COSMOS,
    new DefaultCosmosSigner(cosmosProvider)
  );
  return signers;
}
