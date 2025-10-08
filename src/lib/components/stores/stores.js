// src/lib/stores.js
import { writable } from 'svelte/store';

// Lanes definieren
export const lanes = ['Do', 'Doing', 'Done', 'Archiv'];

// Issues Store
function createIssueStore() {
  const { subscribe, set, update } = writable([]);

  return {
    subscribe,

    add(issue) {
      update(items => {
        const newItems = [...items, issue];
        return newItems;
      });
    },

    move(id, newLane) {
      update(items => {
        return items.map(i => i.id === id ? { ...i, lane: newLane } : i);
      });
    },

    remove(id) {
      update(items => items.filter(i => i.id !== id));
    },

    clear() {
      set([]);
    }
  };
}

export const issues = createIssueStore();
