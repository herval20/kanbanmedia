<script>
    import { issues } from '$lib/stores/stores';
    import { format, parseISO, isPast } from 'date-fns';
  
    export let issue;
  
    // Datum hübsch formatiert anzeigen
    $: dueFormatted = issue.dueDate ? format(parseISO(issue.dueDate), 'dd.MM.yyyy') : '';
    $: createdFormatted = issue.createdAt ? format(parseISO(issue.createdAt), 'dd.MM.yyyy') : '';
  
    // Überfällig?
    $: overdue = issue.dueDate ? isPast(parseISO(issue.dueDate)) : false;
  
    function deleteIssue() {
      issues.remove(issue.id);
    }
  
    function dragStart(event) {
      event.dataTransfer.setData('text', issue.id);
      event.dataTransfer.effectAllowed = 'move';
    }
  </script>
  
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div
    class="bg-white rounded-xl shadow p-4 mb-3 border-l-4 transition-transform hover:scale-[1.01]"
    class:border-l-red-500={overdue}
    class:border-l-purple-500={!overdue}
    draggable="true"
    on:dragstart={dragStart}
  >
    <div class="flex justify-between items-start">
      <h3 class="font-bold text-lg">{issue.title}</h3>
      <button class="text-red-500 font-bold hover:text-red-700" on:click={deleteIssue}>✖</button>
    </div>
  
    {#if issue.description}
      <p class="text-gray-700 mt-1">{issue.description}</p>
    {/if}
  
    <div class="flex justify-between items-center mt-3 text-sm text-gray-600">
      <span>📅 {dueFormatted}</span>
      <span>SP: {issue.storyPoints}</span>
      <span
        class="px-2 py-0.5 rounded-full text-white"
        class:bg-green-500={issue.priority === 'Low'}
        class:bg-yellow-500={issue.priority === 'Medium'}
        class:bg-red-500={issue.priority === 'High'}
      >
        {issue.priority}
      </span>
    </div>
  
    {#if overdue}
      <div class="mt-2 text-red-600 font-semibold">⚠ Überfällig!</div>
    {/if}
  </div>
  