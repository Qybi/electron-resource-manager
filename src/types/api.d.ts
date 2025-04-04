import { Stats } from "./stats";

export interface Api {
  getStaticData: () => Promise<any>;
  subscribeStats: (callback: (stats: Stats) => void) => void;
}
