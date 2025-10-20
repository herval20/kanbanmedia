<script>
  import { issues } from '$lib/stores/stores';
  import { format, parseISO, isPast } from 'date-fns';
  export let issue;

  $: dueFormatted = issue.dueDate ? format(parseISO(issue.dueDate), 'dd.MM.yyyy') : '';
  $: overdue = issue.dueDate ? isPast(parseISO(issue.dueDate)) : false;

  function deleteIssue() {
    issues.remove(issue.id);
  }

  function exportICS() {
    if (!issue.dueDate) return;

    const start = new Date(issue.dueDate).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const endDate = new Date(new Date(issue.dueDate).getTime() + 60 * 60 * 1000); // +1h
    const end = endDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

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

  async function shareIssue() {
    if (navigator.share) {
      try {
        await navigator.share({
          title: issue.title,
          text: `${issue.description}\nDue: ${dueFormatted}`,
          url: window.location.href
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      alert('Web Share API not supported in this browser.');
    }
  }
</script>

<!-- Issue Card -->
<div
  class="bg-white rounded-xl shadow p-4 mb-3 border-l-4 focus:outline-none focus:ring-2 focus:ring-purple-400"
  class:border-l-pink-400={overdue}
  class:border-l-purple-500={!overdue}
  draggable="true"
  tabindex="0"
  role="article"
  aria-label={`Issue ${issue.title}, Priority ${issue.priority}, ${overdue ? 'Overdue' : 'Due ' + dueFormatted}`}
  on:dragstart={(e) => e.dataTransfer.setData('text', issue.id)}
  on:keydown={(e) => {
    if (e.key === 'Delete') deleteIssue();
    if (e.key === 'Enter') exportICS();
  }}
>
  <div class="flex justify-between items-start">
    <h3 class="font-bold text-lg">{issue.title}</h3>
    <button
      class="text-red-500 font-bold"
      aria-label="Delete issue"
      on:click={deleteIssue}
    >
      ✖
    </button>
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
    <div class="mt-2 text-pink-500 font-semibold" aria-live="assertive">⚠ Overdue!</div>
  {/if}

  <div class="flex justify-end mt-2 gap-2">
    <button
      class="text-purple-600 text-sm hover:underline"
      aria-label="Export this issue as ICS"
      on:click={exportICS}
    >
      Export ICS
    </button>
    <button
      class="text-purple-600 text-sm hover:underline"
      aria-label="Share this issue"
      on:click={shareIssue}
    >
      Share
    </button>
  </div>
</div>
