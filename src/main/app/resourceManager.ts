import { RESOURCE_POLLING_RATE } from "../consts";
import osUtils from "os-utils";
import fs from "fs";
import os from "os";
import { BrowserWindow } from "electron";
import { ipcWebContentsSend } from "../utils/utils";
import { Stats } from "../../types/stats";

export function pollingResources(window: BrowserWindow) {
  setInterval(async () => {
    const cpu = await getCpuUsage();
    const ram = await getRamUsage();
    const disk = await getDiskUsage();
    // this creates an event called 'stats' and sends the data on it.
    // the frontend CAN subscribe to this event in the preload/index.ts file that will expose an api for the renderer (frontend) process
    ipcWebContentsSend("stats", window.webContents, { cpu, ram, disk });
  }, RESOURCE_POLLING_RATE);
}

export function getStaticData() {
  const totalMem = Math.floor(osUtils.totalmem() / 1024);
  const totalDisk = getDiskUsage().total;
  const cpu = os.cpus()[0];
  return {
    totalMem,
    totalDisk,
    cpu: { model: cpu.model, speed: cpu.speed }
  };
}

function getCpuUsage(): Promise<number> {
  return new Promise<number>((resolve) => osUtils.cpuUsage(resolve));
}

function getRamUsage(): Stats["ram"] {
  const totalMem = osUtils.totalmem();
  const usedMem = totalMem - osUtils.freemem();

  return {
    value: usedMem,
    percentage: usedMem / totalMem
  };
}

function getDiskUsage(): Stats["disk"] {
  const stats = fs.statfsSync(process.platform === "win32" ? "C:\\" : "/");
  const total = stats.blocks * stats.bsize;
  const free = stats.bfree * stats.bsize;
  const used = total - free;

  return {
    total: total / 1_000_000_000,
    used: used / 1_000_000_000,
    free: free / 1_000_000_000,
    usedPercentage: (used / total) * 100
  };
}
