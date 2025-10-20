<script>
  import IssueCard from './IssueCard.svelte';
  import { issues } from '$lib/stores/stores';
  export let name;

  // Alle Issues, die in dieser Lane sind
  $: laneIssues = $issues.filter(i => i.lane === name);

  // Summe Story Points pro Lane
  $: totalSP = laneIssues.reduce((sum, i) => sum + Number(i.storyPoints), 0);

  function allowDrop(event) {
    event.preventDefault();
  }

  function drop(event) {
    const id = Number(event.dataTransfer.getData('text'));
    issues.move(id, name);
  }
</script>

<!-- Lane Container mit ARIA -->
<div
  class="bg-purple-50 rounded p-3 min-h-[200px] flex flex-col focus:outline-none focus:ring-2 focus:ring-purple-400"
  role="region"
  tabindex="0"
  aria-label={`Lane ${name}. Contains ${laneIssues.length} issues. Total story points ${totalSP}.`}
  on:dragover={allowDrop}
  on:drop={drop}
>
  <h2 class="font-bold text-purple-700 mb-1 text-center" aria-level="2" role="heading">{name}</h2>
  <p class="text-sm text-gray-600 text-center mb-2" aria-live="polite">Total SP: {totalSP}</p>

  {#each laneIssues as issue (issue.id)}
    <IssueCard {issue} />
  {/each}

  {#if laneIssues.length === 0}
    <p class="text-gray-400 text-sm text-center mt-5 flex-1" aria-label="No issues in this lane">Keine Issues</p>
  {/if}
</div>
