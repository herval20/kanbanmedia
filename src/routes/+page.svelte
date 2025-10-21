<script>
  import IssueCard from '$lib/components/IssueCard.svelte';
  import NewIssueDialog from '$lib/components/NewIssueDialog.svelte';
  import { issues, lanes } from '$lib/stores/stores';
  import { onMount } from 'svelte';

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

    if (lane === 'Done') {
      if (Notification.permission === 'granted') {
        new Notification('🎉 Issue Completed!', {
          body: `${draggedIssue.title} was moved to Done ✅`,
          icon: '/favicon.ico'
        });
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            new Notification('🎉 Issue Completed!', {
              body: `${draggedIssue.title} was moved to Done ✅`,
              icon: '/favicon.ico'
            });
          }
        });
      }
    }

    draggedIssue = null;
  }

  function onDragOver(e) {
    e.preventDefault();
  }

  function exportCSV() {
    if (!$issues.length) return;
    const headers = ['Title', 'Description', 'CreationDate', 'DueDate', 'StoryPoints', 'Priority', 'Lane'];
    const rows = $issues.map(i =>
      [i.title, i.description, i.createdAt || '', i.dueDate || '', i.storyPoints, i.priority, i.lane].join(',')
    );
    const blob = new Blob([[headers.join(','), ...rows].join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'kanban_issues.csv';
    a.click();
    URL.revokeObjectURL(url);
  }
</script>

<div style="min-height:100vh; transition: all 0.3s; background-color:{darkMode ? '#111' : '#eee'}; color:{darkMode ? 'white' : 'black'}; padding:1rem;">
  <header style="display:flex; flex-wrap:wrap; justify-content:space-between; align-items:center; margin-bottom:1rem;">
    <h1>Kanban Board</h1>

    <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
      <input placeholder="Filter..." style="padding:0.25rem;" bind:value={filterText} />
      <select bind:value={filterPriority} style="padding:0.25rem;">
        <option value=''>All</option>
        <option value='High'>High</option>
        <option value='Medium'>Medium</option>
        <option value='Low'>Low</option>
      </select>

      <button on:click={toggleDarkMode} style="padding:0.25rem 0.5rem; cursor:pointer;">
        {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
      </button>

      <button style="padding:0.25rem 0.5rem;" on:click={() => issues.undo()}>Undo</button>
      <button style="padding:0.25rem 0.5rem;" on:click={() => issues.redo()}>Redo</button>
      <button style="padding:0.25rem 0.5rem;" on:click={exportCSV}>Export CSV</button>
      <button style="padding:0.25rem 0.5rem;" on:click={() => showDialog = true}>New Issue</button>
    </div>
  </header>

  <div style="display:flex; gap:1rem; overflow-x:auto; height:80vh;">
    {#each lanes as lane}
      <!-- svelte-ignore a11y_no_static_element_interactions -->
      <div on:dragover={onDragOver} on:drop={() => onDrop(lane)}
           style="flex:1; background-color:{darkMode ? '#333' : 'white'}; padding:1rem; border-radius:1rem; box-shadow:0 0 5px rgba(0,0,0,0.2);">
        <h2 style="text-align:center;">{lane}</h2>
        <p style="text-align:center;">
          Total SP: {$issues.filter(i => i.lane === lane).reduce((sum, i) => sum + Number(i.storyPoints || 0), 0)}
        </p>

        {#each $issues.filter(i =>
          i.lane === lane &&
          (i.title.toLowerCase().includes(filterText.toLowerCase()) ||
           i.description.toLowerCase().includes(filterText.toLowerCase())) &&
          (filterPriority ? i.priority === filterPriority : true)
        ) as issue (issue.id)}
          <div draggable="true"
               on:dragstart={(e) => { e.dataTransfer.setData('text', String(issue.id)); onDragStart(issue); }}
               style="margin-bottom:0.5rem;">
            <IssueCard {issue} {darkMode} />
          </div>
        {/each}
      </div>
    {/each}
  </div>

  <NewIssueDialog bind:open={showDialog} {darkMode}/>
</div>
