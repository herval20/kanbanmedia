import { writable } from 'svelte/store';
export const lanes = ['To Do', 'Doing', 'Done', 'Archiv'];


function loadFromLocalStorage() {
  if (typeof localStorage === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem('issues')) || [];
  } catch {
    return [];
  }
}

function saveToLocalStorage(data) {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem('issues', JSON.stringify(data));
}

function createIssuesStore() {
  const { subscribe, set, update } = writable(loadFromLocalStorage());

  return {
    subscribe,
    add: (issue) =>
      update((all) => {
        const newIssues = [...all, issue];
        saveToLocalStorage(newIssues);
        return newIssues;
      }),
    move: (id, newLane) =>
      update((all) => {
        const updated = all.map((i) =>
          i.id === id ? { ...i, lane: newLane } : i
        );
        saveToLocalStorage(updated);
        return updated;
      }),
    remove: (id) =>
      update((all) => {
        const filtered = all.filter((i) => i.id !== id);
        saveToLocalStorage(filtered);
        return filtered;
      }),
    set: (data) => {
      saveToLocalStorage(data);
      set(data);
    },
  };
}

export const issues = createIssuesStore();
