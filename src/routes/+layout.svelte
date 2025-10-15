<script>
	import '../app.css';
  </script>
  
  <svelte:head>
	<!-- Prevent browser from requesting favicon.ico -->
	<link rel="icon" href="data:," />
  </svelte:head>
  
  <slot />
  