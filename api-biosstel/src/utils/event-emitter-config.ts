import { EventEmitter } from "events";

EventEmitter.defaultMaxListeners = 20;
process.setMaxListeners(0);
