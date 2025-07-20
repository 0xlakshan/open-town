import { EventEmitter } from 'events';

let id = 0;
const ee = new EventEmitter();
export const db = {
  posts: [
    {
      id: ++id,
      name: 'sam',
    },
  ],
  messages: [createMessage('initial message')],
};
export function createMessage(text: string) {
  const msg = {
    id: ++id,
    text,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
  ee.emit('newMessage', msg);
  return msg;
}