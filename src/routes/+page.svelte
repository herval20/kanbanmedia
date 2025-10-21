<script>
  import IssueCard from '$lib/components/IssueCard.svelte';
  import NewIssueDialog from '$lib/components/NewIssueDialog.svelte';
  import { issues, lanes } from '$lib/stores/stores';

  let showDialog = false;
  let filterText = '';
  let filterPriority = '';
  let draggedIssue = null;
  let darkMode = false;

  function toggleDarkMode() {
    darkMode = !darkMode;
  }

  $: allIssues = $issues;

  function onDragStart(issue) {
    draggedIssue = issue;
  }

  function onDrop(lane) {
    if (!draggedIssue) return;

    issues.move(draggedIssue.id, lane);

    // Done notification
    if (lane === 'Done') {
      if ("Notification" in window) {
        if (Notification.permission === 'granted') {
          new Notification('Issue Completed', {
            body: `${draggedIssue.title} moved to Done.`,
            icon: '/favicon.ico'
          });
        } else if (Notification.permission !== 'denied') {
          Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
              new Notification('Issue Completed', {
                body: `${draggedIssue.title} moved to Done.`,
                icon: '/favicon.ico'
              });
            }
          });
        }
      }
    }

    draggedIssue = null;
  }

  function onDragOver(e) {
    e.preventDefault();
  }

  function exportCSV() {
    if (!$issues.length) return;
    const headers = ['Title','Description','CreationDate','DueDate','StoryPoints','Priority','Lane'];
    const rows = $issues.map(i => [i.title,i.description,i.createdAt||'',i.dueDate||'',i.storyPoints,i.priority,i.lane].join(','));
    const blob = new Blob([[headers.join(','),...rows].join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'kanban_issues.csv';
    a.click();
    URL.revokeObjectURL(url);
  }
</script>

<div style="min-height:100vh; background:{darkMode ? '#121212' : '#f8f8f8'}; color:{darkMode ? '#fff' : '#111'}; padding:2rem; transition: all 0.3s; font-family:sans-serif;">

  <!-- Header -->
  <header style="display:flex; flex-wrap:wrap; justify-content:space-between; align-items:center; margin-bottom:2rem;">
    <h1 style="font-size:2rem; font-weight:700; color:{darkMode ? '#fff' : '#111'};">Kanban Board</h1>

    <div style="display:flex; gap:0.5rem; flex-wrap:wrap; align-items:center;">
      <input placeholder="Filter..." bind:value={filterText} 
             style="padding:0.5rem; border-radius:0.5rem; border:1px solid #ccc; background:{darkMode ? '#1c1c1c' : '#fff'}; color:{darkMode ? '#fff' : '#111'};" />
      <select bind:value={filterPriority} 
              style="padding:0.5rem; border-radius:0.5rem; border:1px solid #ccc; background:{darkMode ? '#1c1c1c' : '#fff'}; color:{darkMode ? '#fff' : '#111'};">
        <option value=''>All</option>
        <option value='High'>High</option>
        <option value='Medium'>Medium</option>
        <option value='Low'>Low</option>
      </select>

      <button on:click={toggleDarkMode} 
              style="padding:0.5rem 1rem; border-radius:0.5rem; background:{darkMode ? '#333' : '#e0e0e0'}; border:none; color:{darkMode ? '#fff' : '#111'}; cursor:pointer;">
        {darkMode ? 'Light Mode' : 'Dark Mode'}
      </button>

      <button on:click={() => issues.undo()} 
              style="padding:0.5rem 1rem; border-radius:0.5rem; background:#e0e0e0; border:none; color:#111; cursor:pointer;">Undo</button>
      <button on:click={() => issues.redo()} 
              style="padding:0.5rem 1rem; border-radius:0.5rem; background:#e0e0e0; border:none; color:#111; cursor:pointer;">Redo</button>
      <button on:click={exportCSV} 
              style="padding:0.5rem 1rem; border-radius:0.5rem; background:#e0e0e0; border:none; color:#111; cursor:pointer;">Export CSV</button>
      <button on:click={() => showDialog = true} 
              style="padding:0.5rem 1rem; border-radius:0.5rem; background:#111; border:none; color:#fff; cursor:pointer;">New Issue</button>
    </div>
  </header>

  <!-- Lanes -->
  <div style="display:flex; gap:1.5rem; overflow-x:auto; height:80vh;">
    {#each lanes as lane}
      <div on:dragover={onDragOver} on:drop={() => onDrop(lane)}
           style="flex:1; min-width:250px; background:{darkMode ? (lane === 'Archive' ? '#2f2f2f' : '#1c1c1c') : (lane === 'Archive' ? '#dcdcdc' : '#fff')} ; padding:1.5rem; border-radius:1rem; box-shadow:0 8px 16px rgba(0,0,0,0.15); transition: all 0.3s;">
        <h2 style="text-align:center; font-size:1.25rem; font-weight:600; color:{darkMode ? '#fff' : '#111'};">{lane}</h2>
        <p style="text-align:center; margin-bottom:1rem; font-weight:bold;">
          Total SP: {$issues.filter(i => i.lane === lane).reduce((sum,i) => sum + Number(i.storyPoints||0),0)}
        </p>

        {#each $issues.filter(i =>
          i.lane === lane &&
          (i.title.toLowerCase().includes(filterText.toLowerCase()) ||
           i.description.toLowerCase().includes(filterText.toLowerCase())) &&
          (filterPriority ? i.priority === filterPriority : true)
        ) as issue (issue.id)}
          <div draggable="true" 
               on:dragstart={(e) => { e.dataTransfer.setData('text', String(issue.id)); onDragStart(issue); }}
               style="margin-bottom:1rem;">
            <IssueCard {issue} {darkMode}/>
          </div>
        {/each}
      </div>
    {/each}
  </div>

  <NewIssueDialog bind:open={showDialog} {darkMode}/>
</div>
