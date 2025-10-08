<!-- src/routes/+page.svelte -->
<script>
    import { onMount } from 'svelte';
    import Lane from '$lib/components/Lane.svelte';
    import NewIssueDialog from '$lib/components/NewIssueDialog.svelte';
    import { issues, lanes } from '$lib/stores/stores';
  
    let showDialog = false;
    let userCountry = '...';
  
    // Geo-IP API
    onMount(async () => {
      try {
        const res = await fetch('https://ipapi.co/json/');
        const data = await res.json();
        userCountry = data.country_name;
      } catch (e) {
        console.error('Geo-IP failed', e);
      }
    });
  
    function openNewIssue() {
      showDialog = true;
    }
  </script>
  
  <div class="min-h-screen bg-gradient-to-b from-purple-50 to-white p-5 flex flex-col items-center">
    <header class="flex justify-between items-center mb-5 w-full max-w-6xl">
      <h1 class="text-2xl font-bold text-purple-700">🗂️ Kanban Board</h1>
      <div class="flex gap-3 items-center">
        <button
          class="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
          on:click={openNewIssue}
        >
          + Neues Issue
        </button>
        <span class="text-sm text-gray-500">Land: {userCountry}</span>
      </div>
    </header>
  
    <div class="flex gap-4 w-full max-w-6xl">
      {#each lanes as lane}
        <div class="flex-1">
          <Lane name={lane} />
        </div>
      {/each}
    </div>
  
    <!-- Neues Issue Dialog -->
    <NewIssueDialog bind:open={showDialog} />
  </div>
  