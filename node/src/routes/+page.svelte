<script lang="ts">
	import { onMount } from 'svelte';
    import { fade, fly } from 'svelte/transition';

	let visible = $state(false);

	onMount(() => {
		visible = true;
	});
</script>

<div
	class="min-h-screen bg-neutral-950 text-white selection:bg-green-500/30 font-sans overflow-x-hidden"
>
	<!-- Background Gradients -->
	<div class="fixed inset-0 z-0 pointer-events-none">
		<div
			class="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-900/20 rounded-full blur-[120px]"
		></div>
		<div
			class="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-green-900/20 rounded-full blur-[100px]"
		></div>
		<div
			class="absolute top-[40%] left-[50%] -translate-x-1/2 w-[60%] h-[40%] bg-blue-900/10 rounded-full blur-[150px]"
		></div>
	</div>

	<!-- Navigation -->
	<nav class="relative z-10 container mx-auto px-6 py-6 flex items-center justify-between">
		<div
			class="text-2xl font-bold tracking-tight bg-gradient-to-r from-green-400 to-emerald-600 bg-clip-text text-transparent"
		>
			CosmicFlow
		</div>
		<div class="hidden md:flex items-center gap-8 text-sm font-medium text-neutral-400">
			<a href="#features" class="hover:text-white transition-colors">Features</a>
			<a href="#about" class="hover:text-white transition-colors">About</a>
			<a href="https://github.com" target="_blank" class="hover:text-white transition-colors"
				>GitHub</a
			>
		</div>
		<a
			href="/canvas"
			class="hidden md:inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-neutral-950 bg-white rounded-full hover:bg-neutral-200 transition-colors"
		>
			Launch App
		</a>
	</nav>

	<!-- Hero Section -->
	<main class="relative z-10 container mx-auto px-6 pt-20 pb-32 md:pt-32 md:pb-48 text-center">
		{#if visible}
			<div in:fly={{ y: 20, duration: 800, delay: 100 }}>
				<div
					class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-xs font-medium text-green-400 mb-8"
				>
					<span class="relative flex h-2 w-2">
						<span
							class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"
						></span>
						<span class="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
					</span>
					v2.0 is now live
				</div>
			</div>

			<h1
				in:fly={{ y: 30, duration: 800, delay: 200 }}
				class="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-8 text-balance"
			>
				Build logical flows <br />
				<span
					class="bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500 bg-clip-text text-transparent"
				>
					visually & instantly.
				</span>
			</h1>

			<p
				in:fly={{ y: 30, duration: 800, delay: 300 }}
				class="text-lg md:text-xl text-neutral-400 max-w-2xl mx-auto mb-12 text-balance leading-relaxed"
			>
				The most intuitive node-based editor for creating, managing, and executing complex workflows
				directly in your browser.
			</p>

			<div
				in:fly={{ y: 30, duration: 800, delay: 400 }}
				class="flex flex-col sm:flex-row items-center justify-center gap-4"
			>
				<a
					href="/canvas"
					class="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-full bg-green-600 px-8 font-medium text-white transition-all duration-300 hover:bg-green-500 hover:ring-2 hover:ring-green-400 hover:ring-offset-2 hover:ring-offset-neutral-950"
				>
					<span class="mr-2">Start Building</span>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="18"
						height="18"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						class="transition-transform group-hover:translate-x-1"
						><line x1="5" x2="19" y1="12" y2="12" /><polyline points="12 5 19 12 12 19" /></svg
					>
				</a>
				<a
					href="https://github.com"
					target="_blank"
					class="inline-flex h-12 items-center justify-center rounded-full border border-neutral-800 bg-neutral-900/50 px-8 font-medium text-white transition-colors hover:bg-neutral-800 hover:text-white backdrop-blur-sm"
				>
					Documentation
				</a>
			</div>
		{/if}
	</main>

	<!-- Visual Preview / Grid -->
	<div class="relative z-10 container mx-auto px-6 pb-24">
		<div
			class="relative rounded-xl border border-neutral-800 bg-neutral-900/50 backdrop-blur overflow-hidden shadow-2xl shadow-green-900/100"
		>
			<!-- Mock UI Header -->
			<div class="border-b border-neutral-800 bg-neutral-900/80 p-4 flex items-center gap-4">
				<div class="flex gap-2">
					<div class="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
					<div class="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
					<div class="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
				</div>
				<div class="h-2 w-32 rounded-full bg-neutral-800"></div>
			</div>
			<!-- Grid Pattern -->
			<div
				class="aspect-video w-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] relative group overflow-hidden"
			>
				<!-- Abstract Nodes -->
				<div
					class="absolute top-1/4 left-1/4 w-32 h-16 rounded-lg border border-neutral-700 bg-neutral-800/80 backdrop-blur shadow-lg flex items-center justify-center text-xs text-neutral-400 transition-transform duration-700 group-hover:translate-x-4"
				>
					Input Source
				</div>
				<div
					class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-20 rounded-lg border border-green-500/30 bg-neutral-800/90 backdrop-blur shadow-lg shadow-green-900/20 flex items-center justify-center text-sm font-medium text-green-400 z-10 transition-transform duration-500 group-hover:scale-105"
				>
					Processing Node
				</div>
				<div
					class="absolute bottom-1/4 right-1/4 w-32 h-16 rounded-lg border border-neutral-700 bg-neutral-800/80 backdrop-blur shadow-lg flex items-center justify-center text-xs text-neutral-400 transition-transform duration-700 group-hover:-translate-x-4"
				>
					Output
				</div>

				<!-- Connecting Lines (CSS SVG) -->
				<svg
					class="absolute inset-0 pointer-events-none stroke-neutral-700"
					width="100%"
					height="100%"
				>
					<path
						d="M 300 200 C 400 200, 400 300, 500 300"
						fill="none"
						stroke-dasharray="5,5"
						class="animate-pulse opacity-50"
					/>
				</svg>
			</div>

			<!-- Overlay Gradient -->
			<div
				class="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent pointer-events-none"
			></div>
		</div>
	</div>

	<footer class="relative z-10 border-t border-neutral-800 bg-neutral-950 py-12">
		<div
			class="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6 text-neutral-500 text-sm"
		>
			<p>&copy; 2024 FlowNode Inc. All rights reserved.</p>
			<div class="flex gap-6">
				<a href="#" class="hover:text-green-400 transition-colors">Privacy</a>
				<a href="#" class="hover:text-green-400 transition-colors">Terms</a>
				<a href="#" class="hover:text-green-400 transition-colors">Twitter</a>
			</div>
		</div>
	</footer>
</div>
