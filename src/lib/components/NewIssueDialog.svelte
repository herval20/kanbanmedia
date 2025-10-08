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
    let dueDate = '';
  
    function addIssue() {
      if (!title) return;
  
      const newIssue = {
        id: Date.now(),
        title,
        description,
        storyPoints,
        priority,
        lane,
        dueDate,
        createdAt: new Date().toISOString()
      };
  
      issues.add(newIssue);
  
      // Reset form
      title = '';
      description = '';
      storyPoints = 1;
      priority = 'Medium';
      lane = 'Do';
      dueDate = '';
  
      open = false;
      dispatch('close');
    }
  
    function closeDialog() {
      open = false;
      dispatch('close');
    }
  </script>
  
  {#if open}
  <div class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
      <h2 class="text-xl font-bold mb-4">Neues Issue erstellen</h2>
  
      <input type="text" placeholder="Titel" bind:value={title} class="w-full p-2 border rounded mb-2"/>
      <textarea placeholder="Beschreibung" bind:value={description} class="w-full p-2 border rounded mb-2"></textarea>
  
      <div class="flex gap-2 mb-2">
        <input type="number" min="1" max="10" bind:value={storyPoints} class="w-20 p-2 border rounded" placeholder="SP"/>
        <select bind:value={priority} class="p-2 border rounded">
          <option>Low</option>
          <option selected>Medium</option>
          <option>High</option>
        </select>
        <select bind:value={lane} class="p-2 border rounded">
          <option>Do</option>
          <option>Doing</option>
          <option>Done</option>
          <option>Archiv</option>
        </select>
        <input type="date" bind:value={dueDate} class="p-2 border rounded"/>
      </div>
  
      <div class="flex justify-end gap-2 mt-4">
        <button class="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400" on:click={closeDialog}>Abbrechen</button>
        <button class="px-4 py-2 rounded bg-purple-600 text-white hover:bg-purple-700" on:click={addIssue}>Hinzufügen</button>
      </div>
    </div>
  </div>
  {/if}
  