<script lang="ts">
    import { SvelteFlow, Background, Panel, MiniMap, type ColorMode, } from '@xyflow/svelte';
    import FlowInspector from '$lib/components/FlowInspector.svelte';
   
    import '@xyflow/svelte/dist/style.css';
   
    let nodes = $state.raw([
      { id: '1', position: { x: 200*2, y: 200*2 }, data: { label: '1' } },
      { id: '2', position: { x: 200*2, y: 400*2 }, data: { label: '2' } },
    ]);
   
    let edges = $state.raw([]);

    let colorMode: ColorMode = $state('system');
</script>

<div style:width="100vw" style:height="100vh">
	<SvelteFlow bind:nodes bind:edges {colorMode} fitView>
		<Panel position="center-left" style="width: 200px; height: 50%; background-color: #f0f0f0;"
		></Panel>
		<Panel
			position="top-center"
			style="width: 20vw; background-color: #f0f0f0; display: flex; gap: 10px; align-items: center; justify-content: center;"
		>
			Start, End, Pause
			<FlowInspector />
		</Panel>
		<Background />
		<MiniMap />

		<Panel>
			<select bind:value={colorMode}>
				<option value="dark">dark</option>
				<option value="light">light</option>
				<option value="system">system</option>
			</select>
		</Panel>
	</SvelteFlow>
</div>
