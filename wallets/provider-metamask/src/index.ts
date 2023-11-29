import type {
  CanEagerConnect,
  CanSwitchNetwork,
  Connect,
  ProviderConnectResult,
  Subscribe,
  SwitchNetwork,
  WalletInfo,
} from '@rango-dev/wallets-shared';
import type { BlockchainMeta, SignerFactory } from 'rango-types';

import {
  canEagerlyConnectToEvm,
  canSwitchNetworkToEvm,
  getEvmAccounts,
  subscribeToEvm,
  switchNetworkForEvm,
  WalletTypes,
} from '@rango-dev/wallets-shared';
import { cosmosBlockchains, evmBlockchains } from 'rango-types';

import { metamask as metamask_instance } from './helpers';
import signer from './signer';
import { getAddresses, installCosmosSnap, isCosmosSnapInstalled } from './snap';

const WALLET = WalletTypes.META_MASK;

export const config = {
  type: WALLET,
};

export const getInstance = metamask_instance;
export const connect: Connect = async ({ instance }) => {
  /*
   *  cosmos snap (It's optional)
   * If the user approves to install Snap, we take the Cosmos addresses and add them to the accounts.
   */
  await installCosmosSnap(instance);
  const installed = await isCosmosSnapInstalled(instance);
  let accounts: ProviderConnectResult[] = [];
  if (installed) {
    const addresses = await getAddresses(instance);
    accounts = addresses.map((item) => ({
      accounts: [item.address],
      chainId: item.chain_id,
    }));
  }
  /*
   * Note: We need to get `chainId` here, because for the first time
   * after opening the browser, wallet is locked, and don't give us accounts and chainId
   * on `check` phase, so `network` will be null. For this case we need to get chainId
   * whenever we are requesting accounts.
   */
  const evm = await getEvmAccounts(instance);
  accounts = [...accounts, evm];
  return accounts;
};

export const subscribe: Subscribe = subscribeToEvm;

export const switchNetwork: SwitchNetwork = switchNetworkForEvm;

export const canSwitchNetworkTo: CanSwitchNetwork = canSwitchNetworkToEvm;

export const getSigners: (provider: any) => SignerFactory = signer;

export const canEagerConnect: CanEagerConnect = canEagerlyConnectToEvm;

export const getWalletInfo: (allBlockChains: BlockchainMeta[]) => WalletInfo = (
  allBlockChains
) => {
  const evms = evmBlockchains(allBlockChains);
  const cosmos = cosmosBlockchains(allBlockChains);

  return {
    name: 'MetaMask',
    img: 'https://raw.githubusercontent.com/rango-exchange/assets/main/wallets/metamask/icon.svg',
    installLink: {
      CHROME:
        'https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en',
      BRAVE:
        'https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en',

      FIREFOX: 'https://addons.mozilla.org/en-US/firefox/addon/ether-metamask',
      EDGE: 'https://microsoftedge.microsoft.com/addons/detail/metamask/ejbalbakoplchlghecdalmeeeajnimhm?hl=en-US',
      DEFAULT: 'https://metamask.io/download/',
    },
    color: '#dac7ae',
    supportedChains: [...evms, ...cosmos],
  };
};
