<script lang="ts">
  import '../app.css';
  import { onMount } from 'svelte';

  // local dark mode variable
  let darkMode = false;

  // toggle dark mode
  const toggleDark = () => {
    darkMode = !darkMode;
    if (darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  };

  // optional: use system preference on mount
  onMount(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    darkMode = prefersDark;
    if (darkMode) document.documentElement.classList.add('dark');
  });

  // service worker registration
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/service-worker.js')
        .then(() => console.log('🟢 Service Worker registered'))
        .catch((err) => console.error('🔴 Service Worker registration failed:', err));
    });
  }
</script>

<svelte:head>
  <link rel="icon" href="data:," />
  <link rel="manifest" href="/manifest.webmanifest" />
  <meta name="theme-color" content="#7c3aed" />
</svelte:head>

<div class="{darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'} min-h-screen transition-colors duration-500">

  <!-- pass darkMode to slot content -->
  <slot {darkMode} />
</div>
