import { DefaultCosmosSigner } from '@samo-dev/signer-cosmos';
import { Networks, getNetworkInstance } from '@samo-dev/wallets-shared';
import {
  DefaultSignerFactory,
  SignerFactory,
  TransactionType as TxType,
} from 'rango-types';

export default function getSigners(provider: any): SignerFactory {
  const cosmosProvider = getNetworkInstance(provider, Networks.COSMOS);
  const signers = new DefaultSignerFactory();
  signers.registerSigner(
    TxType.COSMOS,
    new DefaultCosmosSigner(cosmosProvider)
  );
  return signers;
}
