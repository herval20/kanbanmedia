import { writable } from 'svelte/store';

// Lanes
export const lanes = ['Do', 'Doing', 'Done', 'Archiv'];

// Load & Save Helpers
function loadFromStorage() {
  if (typeof localStorage === 'undefined') return [];
  const data = localStorage.getItem('issues');
  return data ? JSON.parse(data) : [];
}

function saveToStorage(issues) {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('issues', JSON.stringify(issues));
  }
}

// Store Creation
function createIssuesStore() {
  const { subscribe, set, update } = writable(loadFromStorage());

  return {
    subscribe,

    add: (issue) =>
      update((all) => {
        const newIssue = { ...issue, x: issue.x || 100, y: issue.y || 100 };
        const newList = [...all, newIssue];
        saveToStorage(newList);
        return newList;
      }),

    remove: (id) =>
      update((all) => {
        const newList = all.filter((i) => i.id !== id);
        saveToStorage(newList);
        return newList;
      }),

    move: (id, newLane) =>
      update((all) => {
        const updated = all.map((i) => {
          if (i.id === id) {
            if (newLane === 'Done' && i.lane !== 'Done') {
              showNotification(`Issue "${i.title}" wurde abgeschlossen ✅`);
            }
            return { ...i, lane: newLane };
          }
          return i;
        });
        saveToStorage(updated);
        return updated;
      }),

    // ✅ NEW: update position of issue on drag
    updatePosition: (id, x, y) =>
      update((all) => {
        const updated = all.map((i) => (i.id === id ? { ...i, x, y } : i));
        saveToStorage(updated);
        return updated;
      }),

    reset: () => set([])
  };
}

// Desktop Notification for "Done"
function showNotification(message) {
  if (typeof window !== 'undefined' && 'Notification' in window) {
    if (Notification.permission === 'granted') {
      new Notification('Kanban Board', { body: message });
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          new Notification('Kanban Board', { body: message });
        }
      });
    }
  }
}

export const issues = createIssuesStore();
