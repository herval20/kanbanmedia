<script>
    import { issues } from '$lib/stores/stores';
    export let issue;
  
    function deleteIssue() {
      issues.remove(issue.id);
    }
  </script>
  
  <div class="bg-white rounded-xl shadow p-4 mb-3 border-l-4 border-purple-500">
    <div class="flex justify-between items-start">
      <h3 class="font-bold text-lg">{issue.title}</h3>
      <button class="text-red-500 font-bold" on:click={deleteIssue}>✖</button>
    </div>
  
    {#if issue.description}
      <p class="text-gray-700 mt-1">{issue.description}</p>
    {/if}
  
    <div class="flex justify-between items-center mt-3 text-sm text-gray-600">
      <span>Due: {issue.dueDate}</span>
      <span>SP: {issue.storyPoints}</span>
      <span class="px-2 py-0.5 rounded-full text-white"
        class:bg-green-500={issue.priority === 'Low'}
        class:bg-yellow-500={issue.priority === 'Medium'}
        class:bg-red-500={issue.priority === 'High'}
      >
        {issue.priority}
      </span>
    </div>
  </div>
  