import { StaticData } from "./staticData";
import { Stats } from "./stats";

export interface Api {
  getStaticData: () => Promise<StaticData>;
  subscribeStats: (callback: (stats: Stats) => void) => UnsubscribeFunction;
}
