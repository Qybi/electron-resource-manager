import { ipcMain, ipcRenderer, WebContents, WebFrameMain } from "electron";
import { EventPayloadMapping } from "../../types/events/eventPayloadMapping";
import { getUiPath, isDev } from "./devUtils";
import { pathToFileURL } from "url";

/**
 * This is a generalized function to handle ipcMain TYPESAFE events.
 * It takes a key and a handler function as arguments.
 * The key is a string that represents the event name.
 * The handler function is called when the event is triggered.
 * It can be used to handle events that do not require a response.
 * Key is a generic that in this case can only be a type specified in the EventPayloadMapping interface and represents the event name.
 *
 * i pulled this from a guide. the way it abstracts the event handling is 5head
 * for different events you just need to update the EventPayloadMapping interface with the event name as the key and the payload type as the result type of the handler
 */

//#region main process
export function ipcMainHandle<Key extends keyof EventPayloadMapping>(
  key: Key,
  handler: () => EventPayloadMapping[Key]
) {
  // ipcMain.handle the default electron method
  ipcMain.handle(key, (event) => {
    validateEventFrame(event.senderFrame);
    return handler();
  });
}

export function ipcWebContentsSend<Key extends keyof EventPayloadMapping>(
  key: Key,
  webContents: WebContents,
  payload: EventPayloadMapping[Key]
) {
  webContents.send(key, payload);
}
//#endregion

//#region renderer process
export function ipcInvoke<Key extends keyof EventPayloadMapping>(
  key: Key
): Promise<EventPayloadMapping[Key]> {
  return ipcRenderer.invoke(key);
}

export function ipcOn<Key extends keyof EventPayloadMapping>(
  key: Key,
  callback: (payload: EventPayloadMapping[Key]) => void
) {
  const cb = (_: Electron.IpcRendererEvent, payload: any) => {
    callback(payload);
  };
  ipcRenderer.on(key, cb);
  // this return a function that can be used to unsubscribe
  return () => ipcRenderer.off(key, cb);
}

//#endregion

export function validateEventFrame(frame: WebFrameMain | null) {
  if (isDev() && new URL(frame?.url ?? "").host === "localhost:5173") {
    return;
  }

  if (frame?.url ?? "" !== pathToFileURL(getUiPath()).toString()) {
    throw new Error("Malicious event");
  }
}
