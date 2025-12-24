<script lang="ts">
  import { SvelteFlow, Background, Controls, Panel, Position, type ColorMode, type Node, type Edge, useSvelteFlow, SvelteFlowProvider } from '@xyflow/svelte';
  import CustomNode from '$lib/components/CustomNode.svelte';
  import { nodeTemplates, type NodeTemplate } from '$lib/nodeTemplates';

  import '@xyflow/svelte/dist/style.css';

  const nodeDefaults = {
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
  };

  const nodeTypes = {
    custom: CustomNode,
  };

  let workflows = $state([
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
          type: 'custom',
          position: { x: 250, y: 300 },
          data: { 
            label: 'Configurable Node',
            inputs: 2,
            outputs: 3,
            params: [
              { label: 'Max Output', value: 100, type: 'number' },
              { label: 'Prefix', value: 'MK-', type: 'text' }
            ],
            textInput: 'Initial configuration notes...'
          },
          ...nodeDefaults,
        },
        {
          id: '5',
          type: 'custom',
          position: { x: 550, y: 150 },
          data: { 
            label: 'Data Source',
            inputs: 0,
            outputs: 1,
            params: [
              { label: 'Connection String', value: 'mysql://localhost:3306', type: 'text' },
              { label: 'Timeout (ms)', value: 5000, type: 'number' }
            ],
            textInput: 'Primary database connection'
          },
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
  ]);

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

  function handleNewWorkflow() {
    const id = crypto.randomUUID();
    const newWorkflow = {
      id,
      name: `Workflow ${workflows.length + 1}`,
      nodes: [],
      edges: [],
    };
    workflows = [...workflows, newWorkflow];
    handleWorkflowSelect(id);
  }

  let colorMode: ColorMode = $state('dark');

  let menu = $state<{ 
    id: string; 
    top: number; 
    left: number; 
    type: 'node' | 'edge' | 'canvas' | 'workflow'; 
    event?: MouseEvent;
  } | null>(null);

  function handleNodeContextMenu({ event, node }: { event: MouseEvent; node: Node }) {
    event.preventDefault();
    menu = {
      id: node.id,
      top: event.clientY,
      left: event.clientX,
      type: 'node',
    };
  }

  function handleWorkflowMenu(event: MouseEvent, id: string) {
    event.stopPropagation();
    menu = {
        id,
        top: event.clientY,
        left: event.clientX,
        type: 'workflow'
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
  
  function handlePaneContextMenu({ event }: { event: MouseEvent }) {
    event.preventDefault();
    menu = {
        id: 'pane',
        top: event.clientY,
        left: event.clientX,
        type: 'canvas',
        event,
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
    } else if (menu.type === 'workflow') {
       workflows = workflows.filter(w => w.id !== menu!.id);
       if (selectedWorkflowId === menu!.id) {
           if (workflows.length > 0) {
               handleWorkflowSelect(workflows[0].id);
           } else {
               nodes = [];
               edges = [];
               selectedWorkflowId = '';
           }
       }
    }

    menu = null;
  }
  
  function handleAddNode(template: NodeTemplate) {
    if (!menu) return;
    
    const id = `${Date.now()}`;
    const newNode = {
        id,
        type: 'custom',
        position: { x: menu.left - 200, y: menu.top - 50 },
        data: {
            label: template.defaultLabel || template.label,
            inputs: template.inputs,
            outputs: template.outputs,
            params: template.params.map(p => ({...p})),
            textInput: template.defaultTextInput || ''
        },
        ...nodeDefaults
    };

    
    nodes = [...nodes, newNode];
    menu = null;
  }

  function runFlow() {
    fetch('/run-flow', {
        method: 'POST',
        body: JSON.stringify({ nodes, edges }),
        headers: {
            'Content-Type': 'application/json'
        }
    });
  }

  let showConsole = $state(false);
  let consoleInput = $state('');
  let consoleLogs = $state([
    '> Initializing console...',
    '> Connected to local backend service',
    '> Ready for events'
  ]);

  function handleConsoleSubmit() {
    if (consoleInput.trim()) {
       consoleLogs = [...consoleLogs, `> ${consoleInput}`];

       const cmd = consoleInput;
       setTimeout(() => {
           consoleLogs = [...consoleLogs, `> executed: ${cmd}`];
       }, 100);
       consoleInput = '';
    }
  }

  let showDashboard = $state(false);
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
				onclick={handleNewWorkflow}
			>
				<span class="text-xl leading-none">+</span>
				<span>New workflow</span>
			</button>
		</div>

		<div class="flex-1 overflow-y-auto px-2 py-2">
			<div class="text-xs font-semibold text-neutral-500 px-2 py-2">Your Workflows</div>
			{#each workflows as wf}
				<div
					class="group flex items-center w-full rounded-md transition-colors {selectedWorkflowId ===
					wf.id
						? 'bg-neutral-800'
						: 'hover:bg-neutral-800'} pr-1 mb-1"
				>
					<button
						class="flex-1 text-left px-3 py-2 text-sm truncate bg-transparent border-none outline-none cursor-pointer"
						onclick={() => handleWorkflowSelect(wf.id)}
					>
						<span class="truncate">{wf.name}</span>
					</button>
					<button
						class="p-1 text-neutral-400 hover:text-white rounded hover:bg-neutral-700/50 opacity-0 group-hover:opacity-100 transition-all"
						onclick={(e) => handleWorkflowMenu(e, wf.id)}
						title="Workflow options"
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
							class="lucide lucide-more-horizontal"
							><circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /><circle
								cx="5"
								cy="12"
								r="1"
							/></svg
						>
					</button>
				</div>
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
		{#if !showDashboard}
			<SvelteFlow
				bind:nodes
				bind:edges
				{nodeTypes}
				{colorMode}
				fitView
				class="bg-neutral-950"
				onnodecontextmenu={handleNodeContextMenu}
				onedgecontextmenu={handleEdgeContextMenu}
				onpanecontextmenu={handlePaneContextMenu}
				onpaneclick={handlePaneClick}
				panOnDrag={[1]}
				selectionOnDrag={true}
			>
				<Background bgColor="#111" />
				<Controls />
			</SvelteFlow>
		{:else}
			<div class="w-full h-full overflow-y-auto bg-neutral-950 p-8">
				<div class="max-w-6xl mx-auto">
					<h1 class="text-3xl font-bold mb-8">System Dashboard</h1>

					<div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
						{#each [{ label: 'Total Requests', value: '1.2M', change: '+12%', color: 'blue' }, { label: 'Active Users', value: '42.5k', change: '+5%', color: 'green' }, { label: 'Avg Latency', value: '45ms', change: '-2%', color: 'purple' }, { label: 'Error Rate', value: '0.01%', change: '-0.05%', color: 'red' }] as stat}
							<div class="bg-neutral-900/50 border border-neutral-800 p-4 rounded-xl">
								<div class="text-neutral-400 text-sm mb-1">{stat.label}</div>
								<div class="flex items-end gap-2">
									<div class="text-2xl font-bold">{stat.value}</div>
									<div
										class="text-xs mb-1 {stat.change.startsWith('+')
											? 'text-green-400'
											: 'text-red-400'}"
									>
										{stat.change}
									</div>
								</div>
							</div>
						{/each}
					</div>

					<div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
						<div class="bg-neutral-900/50 border border-neutral-800 p-6 rounded-xl h-80">
							<h3 class="font-medium mb-4 text-neutral-300">Throughput History</h3>
							<div class="w-full h-full flex items-end justify-between px-2 pb-8 gap-2">
								{#each Array(20) as _, i}
									<div
										class="w-full bg-blue-500/20 hover:bg-blue-500/40 transition-colors rounded-t-sm relative group"
										style="height: {30 + Math.random() * 70}%"
									>
										<div
											class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-neutral-800 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10"
										>
											{Math.floor(Math.random() * 1000)} req/s
										</div>
									</div>
								{/each}
							</div>
						</div>
						<div class="bg-neutral-900/50 border border-neutral-800 p-6 rounded-xl h-80">
							<h3 class="font-medium mb-4 text-neutral-300">Resource Usage</h3>
							<div class="space-y-4">
								{#each ['CPU Core 1', 'CPU Core 2', 'Memory', 'Disk I/O', 'Network'] as resource}
									<div>
										<div class="flex justify-between text-xs mb-1">
											<span class="text-neutral-400">{resource}</span>
											<span class="text-neutral-300">{Math.floor(Math.random() * 100)}%</span>
										</div>
										<div class="w-full bg-neutral-800 h-2 rounded-full overflow-hidden">
											<div
												class="bg-purple-500 h-full rounded-full"
												style="width: {Math.random() * 100}%"
											></div>
										</div>
									</div>
								{/each}
							</div>
						</div>
					</div>

					<div class="bg-neutral-900/50 border border-neutral-800 rounded-xl overflow-hidden">
						<div class="p-6 border-b border-neutral-800">
							<h3 class="font-medium text-neutral-300">Detailed Logs</h3>
						</div>
						<div class="divide-y divide-neutral-800/50">
							{#each Array(5) as _, i}
								<div class="p-4 flex items-center gap-4 hover:bg-neutral-800/30 transition-colors">
									<div
										class="w-2 h-2 rounded-full {['bg-green-500', 'bg-blue-500', 'bg-yellow-500'][
											i % 3
										]}"
									></div>
									<div class="flex-1 text-sm text-neutral-300">
										System update successfully completed for module core-pk-{i}
									</div>
									<div class="text-xs text-neutral-500 font-mono">10:2{i}:45 AM</div>
								</div>
							{/each}
						</div>
					</div>
				</div>
			</div>
		{/if}

		<div class="absolute top-4 left-1/2 -translate-x-1/2 z-50 pointer-events-auto">
			<div
				class="flex items-center gap-2 p-1.5 bg-neutral-800/80 backdrop-blur border border-neutral-700 rounded-lg shadow-lg"
			>
				<button
					class="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white px-3 py-1.5 rounded-md transition-colors font-medium text-sm"
					onclick={runFlow}
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
				<button
					class="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white px-3 py-1.5 rounded-md transition-colors font-medium text-sm {showDashboard
						? 'ring-2 ring-purple-400'
						: ''}"
					onclick={() => (showDashboard = !showDashboard)}
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
						class="lucide lucide-layout-dashboard"
						><rect width="7" height="9" x="3" y="3" rx="1" /><rect
							width="7"
							height="5"
							x="14"
							y="3"
							rx="1"
						/><rect width="7" height="9" x="14" y="12" rx="1" /><rect
							width="7"
							height="5"
							x="3"
							y="16"
							rx="1"
						/></svg
					>
					Dash
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
				<button
					class="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-700/50 rounded-md transition-colors {showConsole
						? 'text-green-400 bg-neutral-700/50'
						: ''}"
					title="Console"
					onclick={() => (showConsole = !showConsole)}
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
						class="lucide lucide-terminal-square"
						><path d="m7 11 2-2-2-2" /><path d="M11 13h4" /><rect
							width="18"
							height="18"
							x="3"
							y="3"
							rx="2"
							ry="2"
						/></svg
					>
				</button>
			</div>
		</div>
		{#if menu}
			<div
				class="fixed z-50 bg-neutral-800 border border-neutral-700 rounded-md shadow-xl py-1 transform -translate-y-0 min-w-[140px]"
				style="top: {menu.top}px; left: {menu.left}px;"
				role="menu"
				tabindex="-1"
			>
				{#if menu.type === 'canvas'}
					<div
						class="px-3 py-1 text-xs font-semibold text-neutral-500 uppercase tracking-wider border-b border-neutral-700 mb-1"
					>
						Add Node
					</div>
					{#each nodeTemplates as template}
						<button
							class="flex items-center gap-2 w-full px-3 py-2 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors text-sm text-left"
							onclick={() => handleAddNode(template)}
						>
							<div class="flex flex-col">
								<span class="font-medium">{template.label}</span>
								{#if template.description}
									<span class="text-[10px] text-neutral-500 line-clamp-1"
										>{template.description}</span
									>
								{/if}
							</div>
						</button>
					{/each}
				{:else if menu.type === 'workflow'}
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
							/><line x1="10" x2="10" y1="11" y2="17" /><line
								x1="14"
								x2="14"
								y1="11"
								y2="17"
							/></svg
						>
						Delete Workflow
					</button>
				{:else}
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
							/><line x1="10" x2="10" y1="11" y2="17" /><line
								x1="14"
								x2="14"
								y1="11"
								y2="17"
							/></svg
						>
						Delete {menu.type}
					</button>
				{/if}
			</div>
		{/if}

		{#if showConsole}
			<div
				class="absolute bottom-4 right-4 w-96 h-64 bg-neutral-900 border border-neutral-700 rounded-lg shadow-2xl flex flex-col overflow-hidden z-50"
			>
				<div
					class="flex items-center justify-between px-3 py-2 bg-neutral-800 border-b border-neutral-700"
				>
					<span class="flex items-center gap-2 text-xs font-mono text-neutral-400">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="12"
							height="12"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
							class="lucide lucide-terminal"
							><polyline points="4 17 10 11 4 5" /><line x1="12" x2="20" y1="19" y2="19" /></svg
						>
						Backend Console
					</span>
					<button
						class="text-neutral-500 hover:text-white"
						aria-label="Close console"
						onclick={() => (showConsole = false)}
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
							class="lucide lucide-x"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg
						>
					</button>
				</div>
				<div
					class="flex-1 p-3 font-mono text-xs text-green-400 overflow-y-auto bg-black/50 scrollbar-thin scrollbar-thumb-neutral-700 scrollbar-track-transparent"
				>
					{#each consoleLogs as log}
						<div class="mb-0.5 opacity-80 font-mono">{log}</div>
					{/each}
				</div>
				<form
					class="flex items-center gap-2 px-2 py-1.5 bg-neutral-950 border-t border-neutral-800"
					onsubmit={(e) => {
						e.preventDefault();
						handleConsoleSubmit();
					}}
				>
					<span class="text-green-500 font-bold text-xs">➜</span>
					<input
						type="text"
						class="flex-1 bg-transparent border-none outline-none text-xs font-mono text-white placeholder-neutral-600 focus:ring-0 p-0"
						placeholder="Type command..."
						bind:value={consoleInput}
					/>
				</form>
			</div>
		{/if}
	</main>
</div>
