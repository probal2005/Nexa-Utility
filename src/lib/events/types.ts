export type NexaEventMap = {
  "reminders:changed": undefined;
  "calendar:changed": undefined;
  "tasks:changed": undefined;
  "notifications:changed": undefined;
  "settings:changed": undefined;
  "shortcuts:changed": undefined;
  "permissions:changed": undefined;
  "command:center:open": undefined;
  "weather:changed": undefined;
  "notes:changed": undefined;
  "profile:changed": undefined;
  "command:executed": {
    command: string;
    toolId?: string;
  };
};
