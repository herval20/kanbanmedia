import { writable } from 'svelte/store';

// Lanes
export const lanes = ['Do', 'Doing', 'Done', 'Archiv'];

// LocalStorage helpers
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

// Issues Store
function createIssuesStore() {
  const { subscribe, set, update } = writable(loadFromStorage());

  return {
    subscribe,
    add: (issue) =>
      update((all) => {
        const newList = [...all, issue];
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
            // ✅ Notification for Done
            if (newLane === 'Done' && i.lane !== 'Done') {
              showNotification(`Issue "${i.title}" has been completed ✅`);
            }
            return { ...i, lane: newLane };
          }
          return i;
        });
        saveToStorage(updated);
        return updated;
      }),
    reset: () => set([])
  };
}

// Notifications
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
