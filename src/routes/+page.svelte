<!-- src/routes/+page.svelte -->
<script>
    import Lane from '$lib/components/Lane.svelte';
    import { issues, lanes } from '$lib/stores/stores';
  
    let showDialog = false;
  </script>
  
  <div class="min-h-screen bg-gradient-to-b from-purple-50 to-white p-5 flex flex-col items-center">
    <header class="flex justify-between items-center mb-5 w-full max-w-6xl">
      <h1 class="text-2xl font-bold text-purple-700">🗂️ Kanban Board</h1>
    </header>
  
    <div class="flex gap-4 w-full max-w-6xl">
      {#each lanes as lane}
        <div class="flex-1">
          <Lane name={lane} />
        </div>
      {/each}
    </div>
  </div>
  