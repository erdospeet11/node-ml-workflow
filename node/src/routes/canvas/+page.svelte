<script lang="ts">
  import { SvelteFlow, Background, Controls, Panel, Position, type ColorMode, type Node, type Edge } from '@xyflow/svelte';

  import '@xyflow/svelte/dist/style.css';

  const nodeDefaults = {
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
  };

  //Mock data for now
  const workflows = [
    {
      id: '1',
      name: 'Default Workflow',
      nodes: [
        {
          id: '1',
          position: { x: 0, y: 150 },
          data: { label: 'default style 1' },
          ...nodeDefaults,
        },
        {
          id: '2',
          position: { x: 250, y: 0 },
          data: { label: 'default style 2' },
          ...nodeDefaults,
        },
        {
          id: '3',
          position: { x: 250, y: 150 },
          data: { label: 'default style 3' },
          ...nodeDefaults,
        },
        {
          id: '4',
          position: { x: 250, y: 300 },
          data: { label: 'default style 4' },
          ...nodeDefaults,
        },
      ],
      edges: [
        { id: 'e1-2', source: '1', target: '2', animated: true },
        { id: 'e1-3', source: '1', target: '3' },
        { id: 'e1-4', source: '1', target: '4' },
      ],
    },
    {
      id: '2',
      name: 'New Project Flow',
      nodes: [
        { id: 'A', position: { x: 50, y: 50 }, data: { label: 'Start' }, ...nodeDefaults },
        { id: 'B', position: { x: 250, y: 100 }, data: { label: 'Process' }, ...nodeDefaults },
        { id: 'C', position: { x: 450, y: 50 }, data: { label: 'End' }, ...nodeDefaults },
      ],
      edges: [
        { id: 'eA-B', source: 'A', target: 'B', animated: true },
        { id: 'eB-C', source: 'B', target: 'C' },
      ],
    },
  ];

  let selectedWorkflowId = $state(workflows[0].id);

  let nodes = $state.raw(workflows[0].nodes);
  let edges = $state.raw(workflows[0].edges);

  function handleWorkflowSelect(id: string) {
    const currentWf = workflows.find((w) => w.id === selectedWorkflowId);
    if (currentWf) {
      currentWf.nodes = nodes;
      currentWf.edges = edges;
    }

    selectedWorkflowId = id;
    const wf = workflows.find((w) => w.id === id);
    if (wf) {
      nodes = wf.nodes;
      edges = wf.edges;
    }
  }

  let colorMode: ColorMode = $state('dark');

  let menu = $state<{ id: string; top: number; left: number; type: 'node' | 'edge' } | null>(null);

  function handleNodeContextMenu({ event, node }: { event: MouseEvent; node: Node }) {
    event.preventDefault();
    menu = {
      id: node.id,
      top: event.clientY,
      left: event.clientX,
      type: 'node',
    };
  }

  function handleEdgeContextMenu({ event, edge }: { event: MouseEvent; edge: Edge }) {
    event.preventDefault();
    menu = {
      id: edge.id,
      top: event.clientY,
      left: event.clientX,
      type: 'edge',
    };
  }

  function handlePaneClick() {
    menu = null;
  }

  function handleDelete() {
    if (!menu) return;

    if (menu.type === 'node') {
      nodes = nodes.filter((n) => n.id !== menu!.id);
      edges = edges.filter((e) => e.source !== menu!.id && e.target !== menu!.id);
    } else if (menu.type === 'edge') {
      edges = edges.filter((e) => e.id !== menu!.id);
    }

    menu = null;
  }
</script>

<div class="flex h-screen w-full bg-neutral-900 text-white overflow-hidden">
	<!-- Left Sidebar (25% width) -->
	<aside class="w-1/5 min-w-[200px] border-r border-neutral-700 bg-neutral-900 flex flex-col">
		<!-- New Chat / Workflow Button -->
		<div class="p-3 flex flex-col gap-2">
			<button
				class="flex items-center gap-2 w-full px-3 py-2 rounded-md border border-neutral-700 hover:bg-neutral-800 transition-colors text-sm text-left text-white"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="16"
					height="16"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					class="lucide lucide-home"
					><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline
						points="9 22 9 12 15 12 15 22"
					/></svg
				>
				<span>Home</span>
			</button>
			<button
				class="flex items-center gap-2 w-full px-3 py-2 rounded-md border border-neutral-700 hover:bg-neutral-800 transition-colors text-sm text-left text-white"
			>
				<span class="text-xl leading-none">+</span>
				<span>New workflow</span>
			</button>
		</div>

		<!-- Workflow List -->
		<div class="flex-1 overflow-y-auto px-2 py-2">
			<div class="text-xs font-semibold text-neutral-500 px-2 py-2">Your Workflows</div>
			{#each workflows as wf}
				<button
					class="w-full text-left px-3 py-2 rounded-md transition-colors text-sm truncate flex items-center gap-2
          {selectedWorkflowId === wf.id ? 'bg-neutral-800' : 'hover:bg-neutral-800'}"
					onclick={() => handleWorkflowSelect(wf.id)}
				>
					<span class="truncate">{wf.name}</span>
				</button>
			{/each}
		</div>

		<!-- User Profile Area -->
		<div class="p-3 border-t border-neutral-700 mt-auto">
			<button
				class="flex items-center gap-3 w-full px-2 py-2 rounded-md hover:bg-neutral-800 transition-colors text-sm text-left"
			>
				<div
					class="w-8 h-8 rounded bg-green-600 flex items-center justify-center text-white font-bold"
				>
					U
				</div>
				<div class="flex flex-col">
					<span class="font-medium">User</span>
				</div>
			</button>
		</div>
	</aside>

	<!-- Main Content (75% width) -->
	<main class="w-4/5 h-full relative">
		<SvelteFlow
			bind:nodes
			bind:edges
			{colorMode}
			fitView
			class="bg-neutral-950"
			onnodecontextmenu={handleNodeContextMenu}
			onedgecontextmenu={handleEdgeContextMenu}
			onpaneclick={handlePaneClick}
		>
			<Background bgColor="#111" />
			<Controls />
			<Panel position="top-center">
				<div
					class="flex items-center gap-2 p-1.5 bg-neutral-800/80 backdrop-blur border border-neutral-700 rounded-lg shadow-lg"
				>
					<button
						class="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white px-3 py-1.5 rounded-md transition-colors font-medium text-sm"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
							class="lucide lucide-play"><polygon points="6 3 20 12 6 21 6 3" /></svg
						>
						Run
					</button>
					<div class="w-px h-6 bg-neutral-700 mx-1"></div>
					<button
						class="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-700/50 rounded-md transition-colors"
						title="Settings"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
							class="lucide lucide-settings"
							><path
								d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.09a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"
							/><circle cx="12" cy="12" r="3" /></svg
						>
					</button>
					<button
						class="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-700/50 rounded-md transition-colors"
						title="Share"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
							class="lucide lucide-share-2"
							><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle
								cx="18"
								cy="19"
								r="3"
							/><line x1="8.59" x2="15.42" y1="13.51" y2="17.49" /><line
								x1="15.41"
								x2="8.59"
								y1="6.51"
								y2="10.49"
							/></svg
						>
					</button>
				</div>
			</Panel>
		</SvelteFlow>
		{#if menu}
			<div
				class="fixed z-50 bg-neutral-800 border border-neutral-700 rounded-md shadow-xl py-1 transform -translate-y-0 min-w-[140px]"
				style="top: {menu.top}px; left: {menu.left}px;"
				role="menu"
				tabindex="-1"
			>
				<button
					class="flex items-center gap-2 w-full px-3 py-2 hover:bg-red-900/30 text-red-500 hover:text-red-400 transition-colors text-sm text-left"
					onclick={handleDelete}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="14"
						height="14"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						class="lucide lucide-trash-2"
						><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path
							d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"
						/><line x1="10" x2="10" y1="11" y2="17" /><line x1="14" x2="14" y1="11" y2="17" /></svg
					>
					Delete {menu.type}
				</button>
			</div>
		{/if}
	</main>
</div>
