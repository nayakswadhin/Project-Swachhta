import { WASTE_EVENTS } from '../constants/events.js';

export const emitNewWaste = (io, waste) => {
  io.emit(WASTE_EVENTS.NEW_WASTE, waste);
};

