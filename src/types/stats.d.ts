export interface Stats {
  cpu: number;
  ram: {
    value: number;
    percentage: number;
  };
  disk: {
    total: number;
    used: number;
    free: number;
    usedPercentage: number;
  };
}
