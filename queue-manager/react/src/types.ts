import type { Manager } from '@samo-dev/queue-manager-core';

export type ManagerContext = Manager | undefined;
export type ManagerState = {
  loadedFromPersistor: boolean;
};
