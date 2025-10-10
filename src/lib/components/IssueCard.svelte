<script>
    import { issues } from '$lib/stores/stores';
    import { format, parseISO, isPast } from 'date-fns';
    export let issue;
  
    $: dueFormatted = issue.dueDate ? format(parseISO(issue.dueDate), 'dd.MM.yyyy') : '';
    $: overdue = issue.dueDate ? isPast(parseISO(issue.dueDate)) : false;
  
    function deleteIssue() {
      issues.remove(issue.id);
    }
  
    // ICS export **per individual issue**
    function exportICS() {
      if (!issue.dueDate) return;
  
      const start = new Date(issue.dueDate).toISOString().replace(/[-:]/g,'').split('.')[0] + 'Z';
      const endDate = new Date(new Date(issue.dueDate).getTime() + 60*60*1000); // +1h
      const end = endDate.toISOString().replace(/[-:]/g,'').split('.')[0] + 'Z';
  
      const icsContent = `BEGIN:VCALENDAR
  VERSION:2.0
  BEGIN:VEVENT
  SUMMARY:${issue.title}
  DESCRIPTION:${issue.description}
  DTSTART:${start}
  DTEND:${end}
  END:VEVENT
  END:VCALENDAR`;
  
      const blob = new Blob([icsContent], { type: 'text/calendar' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${issue.title}.ics`;
      a.click();
      URL.revokeObjectURL(url);
    }
  </script>
  
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div class="bg-white rounded-xl shadow p-4 mb-3 border-l-4"
       class:border-l-pink-400={overdue}
       class:border-l-purple-500={!overdue}
       draggable="true"
       on:dragstart={(e) => e.dataTransfer.setData('text', issue.id)}>
  
    <div class="flex justify-between items-start">
      <h3 class="font-bold text-lg">{issue.title}</h3>
      <button class="text-red-500 font-bold" on:click={deleteIssue}>✖</button>
    </div>
  
    {#if issue.description}
      <p class="text-gray-700 mt-1">{issue.description}</p>
    {/if}
  
    <div class="flex justify-between items-center mt-3 text-sm text-gray-600">
      <span>Due: {dueFormatted}</span>
      <span>SP: {issue.storyPoints}</span>
      <span class="px-2 py-0.5 rounded-full text-white bg-purple-500">
        {issue.priority}
      </span>
    </div>
  
    {#if overdue}
      <div class="mt-2 text-pink-500 font-semibold">⚠ Overdue!</div>
    {/if}
  
    <!-- ICS Export Button for individual issue -->
    <div class="flex justify-end mt-2">
      <button class="text-purple-600 text-sm hover:underline" on:click={exportICS}>Export ICS</button>
    </div>
  </div>
  