import { writable } from 'svelte/store';

function createIssues() {
  const stored = typeof localStorage !== 'undefined' ? localStorage.getItem('kanban_issues') : null;
  const { subscribe, set, update } = writable(stored ? JSON.parse(stored) : []);

  let history = [];
  let future = [];

  function saveHistory(issues) {
    history.push(JSON.stringify(issues));
    if (history.length > 50) history.shift();
    future = [];
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('kanban_issues', JSON.stringify(issues));
    }
  }

  return {
    subscribe,
    set: (val) => { saveHistory(val); set(val); },
    add: (issue) => update((issues) => {
      const newIssues = [...issues, issue];
      saveHistory(newIssues);
      return newIssues;
    }),
    remove: (id) => update((issues) => {
      const newIssues = issues.filter(i => i.id !== id);
      saveHistory(newIssues);
      return newIssues;
    }),
    move: (id, lane) => update((issues) => {
      const newIssues = issues.map(i => i.id === id ? { ...i, lane } : i);
      saveHistory(newIssues);
      return newIssues;
    }),
    undo: () => update((issues) => {
      if (!history.length) return issues;
      future.push(JSON.stringify(issues));
      const prev = JSON.parse(history.pop());
      if (typeof localStorage !== 'undefined') localStorage.setItem('kanban_issues', JSON.stringify(prev));
      return prev;
    }),
    redo: () => update((issues) => {
      if (!future.length) return issues;
      history.push(JSON.stringify(issues));
      const next = JSON.parse(future.pop());
      if (typeof localStorage !== 'undefined') localStorage.setItem('kanban_issues', JSON.stringify(next));
      return next;
    }),
    reset: () => {
      if (typeof localStorage !== 'undefined') localStorage.removeItem('kanban_issues');
      set([]);
      history = [];
      future = [];
    }
  };
}

export const issues = createIssues();
export const lanes = ['Do', 'Doing', 'Done', 'Archiv'];
