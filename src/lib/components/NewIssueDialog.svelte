<script>
  import { createEventDispatcher } from 'svelte';
  import { issues } from '$lib/stores/stores';

  export let open = false;
  export let darkMode = false;
  const dispatch = createEventDispatcher();

  let title = '';
  let description = '';
  let storyPoints = 1;
  let priority = 'Medium';
  let lane = 'Do';
  let dueDate = '';
  let errors = {};

  function validate() {
    errors = {};
    if (!title.trim()) errors.title = 'Title is required.';
    if (!description.trim()) errors.description = 'Description is required.';
    if (!dueDate) errors.dueDate = 'Due date is required.';
    if (storyPoints <= 0) errors.storyPoints = 'Story points must be positive.';
    if (!priority) errors.priority = 'Priority required.';
    return Object.keys(errors).length === 0;
  }

  function addIssue() {
    if (!validate()) return;

    issues.add({
      id: Date.now(),
      title: title.trim(),
      description: description.trim(),
      storyPoints: Number(storyPoints),
      priority,
      lane,
      dueDate,
      createdAt: new Date().toISOString()
    });

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
  <div class="{ darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900' } rounded-lg shadow-lg p-6 w-full max-w-md transition-colors duration-500">
    <h2 class="text-xl font-bold mb-4">New Issue</h2>

    <div class="mb-2">
      <input type="text" placeholder="Title" bind:value={title} class="w-full p-2 border rounded mb-1 text-black"/>
      {#if errors.title}<p class="text-red-500 text-sm">{errors.title}</p>{/if}
    </div>

    <div class="mb-2">
      <textarea placeholder="Description" bind:value={description} class="w-full p-2 border rounded mb-1 text-black"></textarea>
      {#if errors.description}<p class="text-red-500 text-sm">{errors.description}</p>{/if}
    </div>

    <div class="flex gap-2 mb-2">
      <div>
        <input type="number" min="1" max="10" bind:value={storyPoints} class="w-20 p-2 border rounded text-black" placeholder="SP"/>
        {#if errors.storyPoints}<p class="text-red-500 text-xs">{errors.storyPoints}</p>{/if}
      </div>
      <select bind:value={priority} class="p-2 border rounded text-black">
        <option>Low</option>
        <option selected>Medium</option>
        <option>High</option>
      </select>
      <select bind:value={lane} class="p-2 border rounded text-black">
        <option>Do</option>
        <option>Doing</option>
        <option>Done</option>
        <option>Archiv</option>
      </select>
      <div>
        <input type="date" bind:value={dueDate} class="p-2 border rounded text-black"/>
        {#if errors.dueDate}<p class="text-red-500 text-xs">{errors.dueDate}</p>{/if}
      </div>
    </div>

    <div class="flex justify-end gap-2 mt-4">
      <button class="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 text-black" on:click={closeDialog}>Cancel</button>
      <button class="px-4 py-2 rounded bg-purple-600 text-white hover:bg-purple-700" on:click={addIssue}>Add</button>
    </div>
  </div>
</div>
{/if}
