<script>
    import { issues } from '$lib/stores/stores';
    import { format, parseISO, isPast } from 'date-fns';
    export let issue;
  
    // --- Position and drag state ---
    let pos = { x: issue.x || 100, y: issue.y || 100 };
    let isDragging = false;
    let offset = { x: 0, y: 0 };
  
    // --- Date formatting and overdue check ---
    $: dueFormatted = issue.dueDate ? format(parseISO(issue.dueDate), 'dd.MM.yyyy') : '';
    $: overdue = issue.dueDate ? isPast(parseISO(issue.dueDate)) : false;
  
    // --- Drag logic ---
    function startDrag(e) {
      isDragging = true;
      offset = { x: e.clientX - pos.x, y: e.clientY - pos.y };
    }
  
    function onDrag(e) {
      if (!isDragging) return;
      pos = { x: e.clientX - offset.x, y: e.clientY - offset.y };
    }
  
    function endDrag() {
      isDragging = false;
      issues.updatePosition(issue.id, pos.x, pos.y);
    }
  
    // --- Delete issue ---
    function deleteIssue() {
      issues.remove(issue.id);
    }
  </script>
  
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div
    class="absolute bg-white rounded-xl shadow p-4 w-64 border-l-4 cursor-move select-none"
    class:border-l-red-500={overdue}
    class:border-l-purple-500={!overdue}
    on:mousedown={startDrag}
    on:mousemove={onDrag}
    on:mouseup={endDrag}
    style="left: {pos.x}px; top: {pos.y}px;"
  >
    <div class="flex justify-between items-start">
      <h3 class="font-bold text-lg">{issue.title}</h3>
      <button class="text-red-500 font-bold" on:click={deleteIssue}>✖</button>
    </div>
  
    <p class="text-gray-700 mt-1">{issue.description}</p>
  
    <div class="flex justify-between items-center mt-3 text-sm text-gray-600">
      <span>Due: {dueFormatted}</span>
      <span>SP: {issue.storyPoints}</span>
    </div>
  
    {#if overdue}
      <div class="mt-2 text-red-600 font-semibold">⚠ Overdue!</div>
    {/if}
  </div>
  
  <style>
    .absolute {
      position: absolute;
    }
  </style>
  