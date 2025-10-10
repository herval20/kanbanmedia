<script>
    import { issues } from '$lib/stores/stores';
    import { format, parseISO, isPast } from 'date-fns';
    export let issue;
  
    $: dueFormatted = issue.dueDate ? format(parseISO(issue.dueDate), 'dd.MM.yyyy') : '';
    $: overdue = issue.dueDate ? isPast(parseISO(issue.dueDate)) : false;
  
    function deleteIssue() {
      issues.remove(issue.id);
    }
  </script>
  
  <div class="bg-white rounded-xl shadow p-4 w-full border-l-4 select-none"
    class:border-l-red-500={overdue}
    class:border-l-purple-500={!overdue}
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
      <div class="mt-2 text-red-600 font-semibold">⚠ Überfällig!</div>
    {/if}
  </div>
  