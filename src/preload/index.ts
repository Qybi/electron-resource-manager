import { contextBridge } from "electron";
import { electronAPI } from "@electron-toolkit/preload";
import { Api } from "../types/api";
import { ipcInvoke, ipcOn } from "../main/utils/utils";
import { Stats } from "../types/stats";

// Custom APIs for renderer
// define here functions that will be exposed to the renderer (frontend)
const api: Api = {
  getStaticData: () => ipcInvoke("getStaticData"),
  subscribeStats: (callback) => {
    return ipcOn("stats", (data: Stats) => {
      callback(data);
    });
  }
};

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    // this methods can be used in the frontend with window.<whatever>.<method>
    contextBridge.exposeInMainWorld("electron", electronAPI);
    contextBridge.exposeInMainWorld("api", api);
  } catch (error) {
    console.error(error);
  }
} else {
  window.electron = electronAPI;
  window.api = api;
}
