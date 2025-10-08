<!-- src/lib/components/NewIssueDialog.svelte -->
<script>
    import { createEventDispatcher } from 'svelte';
    import { issues } from '$lib/stores/stores';
  
    export let open = false;
    const dispatch = createEventDispatcher();
  
    let title = '';
    let description = '';
    let storyPoints = 1;
    let priority = 'Medium';
    let lane = 'Do';
  
    function addIssue() {
      if (!title) return;
      issues.add({
        id: Date.now(),
        title,
        description,
        storyPoints,
        priority,
        lane,
        createdAt: new Date().toISOString(),
        dueDate: null
      });
      open = false;
  
      // reset fields
      title = '';
      description = '';
      storyPoints = 1;
      priority = 'Medium';
      lane = 'Do';
    }
  </script>
  
  {#if open}
    <div class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div class="bg-white rounded p-5 w-96 shadow-lg">
        <h2 class="text-xl font-bold mb-3">Neues Issue</h2>
  
        <input
          class="w-full mb-2 border rounded p-1"
          placeholder="Titel"
          bind:value={title}
        />
        <textarea
          class="w-full mb-2 border rounded p-1"
          placeholder="Beschreibung"
          bind:value={description}
        ></textarea>
        <input
          type="number"
          class="w-full mb-2 border rounded p-1"
          placeholder="Story Points"
          bind:value={storyPoints}
          min="1"
        />
        <select bind:value={priority} class="w-full mb-2 border rounded p-1">
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>
        <select bind:value={lane} class="w-full mb-2 border rounded p-1">
          <option>Do</option>
          <option>Doing</option>
          <option>Done</option>
          <option>Archiv</option>
        </select>
  
        <div class="flex justify-end gap-2 mt-3">
          <button class="px-3 py-1 bg-gray-300 rounded" on:click={()=>open=false}>Abbrechen</button>
          <button class="px-3 py-1 bg-purple-600 text-white rounded" on:click={addIssue}>Hinzufügen</button>
        </div>
      </div>
    </div>
  {/if}
  