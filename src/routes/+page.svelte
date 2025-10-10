<script>
    import { onMount } from 'svelte';
    import NewIssueDialog from '$lib/components/NewIssueDialog.svelte';
    import { issues, lanes } from '$lib/stores/stores';
    import IssueCard from '$lib/components/IssueCard.svelte';
  
    let draggedIssue = null;
    let showDialog = false;
    let userCountry = '';
  
    // Geo-API to reliably get user's country
    onMount(async () => {
      try {
        const res = await fetch('https://ipapi.co/json/');
        const data = await res.json();
        userCountry = data.country_name || '';
      } catch (err) {
        console.warn('ipapi.co failed, trying fallback API', err);
        try {
          const res2 = await fetch('https://ipwho.is/');
          const data2 = await res2.json();
          userCountry = data2.country || '';
        } catch (err2) {
          console.error('All Geo APIs failed', err2);
          userCountry = 'Unknown';
        }
      }
    });
  
    function onDragStart(issue) {
      draggedIssue = issue;
    }
  
    function onDrop(lane) {
      if (draggedIssue) {
        issues.move(draggedIssue.id, lane);
        draggedIssue = null;
      }
    }
  
    function onDragOver(event) {
      event.preventDefault();
    }
  </script>
  
  <header class="flex justify-between items-center p-4 bg-purple-100 rounded-b-lg">
    <h1 class="text-xl font-bold">Kanban Board</h1>
    <div>
      <span class="mr-4">Your Country: {userCountry}</span>
      <button class="bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700" on:click={() => showDialog = true}>New Issue</button>
    </div>
  </header>
  
  <NewIssueDialog bind:open={showDialog} />
  
  <div class="flex gap-4 p-6 h-screen bg-gray-50 overflow-x-auto">
    {#each lanes as lane}
      <!-- svelte-ignore a11y_no_static_element_interactions -->
      <div
        class="flex-1 bg-white rounded-2xl shadow p-4 flex flex-col"
        on:dragover={onDragOver}
        on:drop={() => onDrop(lane)}
      >
        <h2 class="text-lg font-semibold text-gray-700 mb-3 text-center">{lane}</h2>
  
        {#each $issues.filter(i => i.lane === lane) as issue (issue.id)}
          <div
            draggable="true"
            on:dragstart={() => onDragStart(issue)}
            class="mb-3"
          >
            <IssueCard {issue} />
          </div>
        {/each}
      </div>
    {/each}
  </div>
  