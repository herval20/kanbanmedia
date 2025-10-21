<script>
  import IssueCard from './IssueCard.svelte';
  import { issues } from '$lib/stores/stores';

  export let name;
  export let darkMode = false; // receive from parent/page

  $: laneIssues = $issues.filter(i => i.lane === name);
  $: totalSP = laneIssues.reduce((sum, i) => sum + Number(i.storyPoints), 0);

  function allowDrop(event) {
    event.preventDefault();
  }

  function drop(event) {
    const id = Number(event.dataTransfer.getData('text'));
    if (!isNaN(id)) {
      issues.move(id, name);
    }
  }
</script>

<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<div
  class="rounded p-3 min-h-[200px] flex flex-col focus:outline-none focus:ring-2 transition-colors duration-500"
  class:bg-purple-50={!darkMode}
  class:bg-gray-900={darkMode}
  role="region"
  tabindex="0"
  aria-label={`Lane ${name}, contains ${laneIssues.length} issues, total SP ${totalSP}`}
  on:dragover={allowDrop}
  on:drop={drop}
>
  <h2
    class="font-bold mb-1 text-center"
    class:text-purple-700={!darkMode}
    class:text-purple-300={darkMode}
  >
    {name}
  </h2>
  <p
    class="text-sm text-center mb-2"
    class:text-gray-600={!darkMode}
    class:text-gray-400={darkMode}
  >
    Total SP: {totalSP}
  </p>

  {#each laneIssues as issue (issue.id)}
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
      draggable="true"
      on:dragstart={(e) => e.dataTransfer.setData('text', String(issue.id))}
    >
      <IssueCard {issue} {darkMode} />
    </div>
  {/each}

  {#if laneIssues.length === 0}
    <p class="text-gray-400 text-sm text-center mt-5 flex-1">No Issues</p>
  {/if}
</div>
