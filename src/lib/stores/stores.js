// src/lib/stores/stores.js
import { writable } from 'svelte/store';

// Lanes definieren
export const lanes = ['Do', 'Doing', 'Done', 'Archiv'];

// Svelte Store für Issues
function createIssueStore() {
  const { subscribe, set, update } = writable([]);

  return {
    subscribe,
    add(issue) {
      update(items => [...items, issue]);
    },
    move(id, newLane) {
      update(items =>
        items.map(i => (i.id === id ? { ...i, lane: newLane } : i))
      );
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
