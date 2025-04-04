import { ipcMain, WebContents } from "electron";
import { EventPayloadMapping } from "../../types/events/eventPayloadMapping";

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

export function ipcMainHandle<Key extends keyof EventPayloadMapping>(
  key: Key,
  handler: () => EventPayloadMapping[Key]
) {
  // ipcMain.handle the default electron method
  ipcMain.handle(key, () => handler());
}

export function ipcWebContentsSend<Key extends keyof EventPayloadMapping>(
  key: Key,
  webContents: WebContents,
  payload: EventPayloadMapping[Key]
) {
  webContents.send(key, payload);
}
