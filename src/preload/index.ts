import { contextBridge } from "electron";
import { electronAPI } from "@electron-toolkit/preload";
import { getStaticData } from "../main/app/resourceManager";
import { Api } from "./index.d";

// Custom APIs for renderer
// define here functions that will be exposed to the renderer (frontend)
const api: Api = {
  getStaticData: () => getStaticData(),
  subscribeStats: (callback: (stats: any) => void) => {
    electronAPI.ipcRenderer.on("os-stats", (_ /*event*/, data) => {
      callback(data);
    });
  }
};

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld("electron", electronAPI);
    contextBridge.exposeInMainWorld("api", api);
  } catch (error) {
    console.error(error);
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI;
  // @ts-ignore (define in dts)
  window.api = api;
}
