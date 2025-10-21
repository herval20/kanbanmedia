<script>
  import { issues } from '$lib/stores/stores';
  import { isPast, parseISO } from 'date-fns';

  export let issue;
  export let darkMode;

  const overdue = issue.dueDate ? isPast(parseISO(issue.dueDate)) : false;

  function deleteIssue() {
    issues.remove(issue.id);
  }

  function exportICS() {
    if (!issue.dueDate) return;
    const start = new Date(issue.dueDate).toISOString().replace(/-|:|\.\d+/g, '');
    const ics = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
UID:${issue.id}
SUMMARY:${issue.title}
DESCRIPTION:${issue.description}
DTSTART:${start}
DTEND:${start}
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([ics], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${issue.title}.ics`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function shareIssue() {
    if (navigator.share) {
      navigator.share({ title: issue.title, text: issue.description }).catch(console.error);
    } else {
      alert('Web Share API not supported.');
    }
  }
</script>

<div class={`rounded-xl shadow p-4 mb-3 border-l-4 transition-colors duration-500
  ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}
  ${overdue ? 'border-red-500' : 'border-l-purple-500'}`}>

  <div class="flex justify-between items-start">
    <h3 class="font-bold text-lg">{issue.title}</h3>
    <button class="text-red-500 font-bold" on:click={deleteIssue}>✖</button>
  </div>

  <p class={issue.description
      ? (darkMode ? 'text-gray-300 mt-1' : 'text-gray-700 mt-1')
      : 'text-gray-400 italic'}>
    {issue.description || 'No description'}
  </p>

  <div class="flex justify-between items-center mt-3 text-sm">
    <span>SP: {issue.storyPoints}</span>
    <span class="px-2 py-0.5 rounded-full text-white bg-purple-500">{issue.priority}</span>
  </div>

  <div class="flex justify-end mt-2 gap-2">
    <button on:click={exportICS} class="text-xs bg-blue-500 text-white px-2 py-1 rounded">ICS</button>
    <button on:click={shareIssue} class="text-xs bg-green-500 text-white px-2 py-1 rounded">Share</button>
  </div>
</div>
