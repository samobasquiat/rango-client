import * as argentx from '@samo-dev/provider-argentx';
import * as bitget from '@samo-dev/provider-bitget';
import * as braavos from '@samo-dev/provider-braavos';
import * as brave from '@samo-dev/provider-brave';
import * as clover from '@samo-dev/provider-clover';
import * as coin98 from '@samo-dev/provider-coin98';
import * as coinbase from '@samo-dev/provider-coinbase';
import * as cosmostation from '@samo-dev/provider-cosmostation';
import * as defaultInjected from '@samo-dev/provider-default';
import * as enkrypt from '@samo-dev/provider-enkrypt';
import * as exodus from '@samo-dev/provider-exodus';
import * as frontier from '@samo-dev/provider-frontier';
import * as halo from '@samo-dev/provider-halo';
import * as keplr from '@samo-dev/provider-keplr';
import * as leapCosmos from '@samo-dev/provider-leap-cosmos';
import * as mathwallet from '@samo-dev/provider-math-wallet';
import * as metamask from '@samo-dev/provider-metamask';
import * as okx from '@samo-dev/provider-okx';
import * as phantom from '@samo-dev/provider-phantom';
import * as safe from '@samo-dev/provider-safe';
import * as safepal from '@samo-dev/provider-safepal';
import * as taho from '@samo-dev/provider-taho';
import * as tokenpocket from '@samo-dev/provider-tokenpocket';
import * as tronLink from '@samo-dev/provider-tron-link';
import * as trustwallet from '@samo-dev/provider-trustwallet';
import * as walletconnect2 from '@samo-dev/provider-walletconnect-2';
import * as xdefi from '@samo-dev/provider-xdefi';

type Enviroments = Record<string, Record<string, string>>;

export const allProviders = (enviroments?: Enviroments) => {
  walletconnect2.init(enviroments?.walletconnect2 || {});

  return [
    safe,
    defaultInjected,
    metamask,
    walletconnect2,
    keplr,
    phantom,
    argentx,
    tronLink,
    trustwallet,
    bitget,
    enkrypt,
    xdefi,
    clover,
    safepal,
    brave,
    coin98,
    coinbase,
    cosmostation,
    exodus,
    mathwallet,
    okx,
    tokenpocket,
    halo,
    leapCosmos,
    frontier,
    taho,
    braavos,
  ];
};
