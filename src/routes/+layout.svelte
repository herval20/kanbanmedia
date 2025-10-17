<script>
	import '../app.css';

	// ✅ Register Service Worker
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
	<!-- Prevent browser from requesting favicon.ico -->
	<link rel="icon" href="data:," />

	<!-- ✅ Link to PWA Manifest -->
	<link rel="manifest" href="/manifest.webmanifest" />
	<meta name="theme-color" content="#7c3aed" />
</svelte:head>

<!-- Your App Layout -->
<slot />
