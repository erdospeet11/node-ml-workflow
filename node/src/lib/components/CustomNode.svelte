<script lang="ts">
  import { Handle, Position } from '@xyflow/svelte';

  export let data: { 
    label: string; 
    params?: { label: string; value: any; type?: string }[];
    textInput?: string;
    inputs?: number;
    outputs?: number;
  };

  $: inputs = Array(data.inputs || 1).fill(0);
  $: outputs = Array(data.outputs || 1).fill(0);
</script>

<div
	class="min-w-[200px] rounded-xl border border-neutral-700 bg-neutral-900/90 text-white shadow-xl backdrop-blur-md transition-all hover:border-neutral-500 hover:shadow-2xl"
>
	<div
		class="border-b border-neutral-800 bg-neutral-800/50 px-4 py-3 text-sm font-semibold tracking-wide flex items-center gap-2"
	>
		<input
			bind:value={data.label}
			class="nodrag bg-transparent border-none outline-none w-full text-white font-semibold placeholder-neutral-500 focus:ring-1 focus:ring-neutral-700 rounded px-1 -ml-1"
			placeholder="Node Name"
		/>
	</div>

	<div class="space-y-4 p-4">
		{#if data.params && data.params.length > 0}
			<div class="space-y-3">
				{#each data.params as param}
					<label class="block space-y-1">
						<span class="text-xs font-medium text-neutral-400">{param.label}</span>
						<input
							type={param.type || 'text'}
							class="nodrag w-full rounded bg-neutral-950/50 px-2 py-1.5 text-xs text-neutral-200 shadow-inner outline-none ring-1 ring-neutral-800 transition-all focus:ring-green-500/50"
							placeholder=""
							bind:value={param.value}
						/>
					</label>
				{/each}
			</div>
		{/if}

		<label class="block space-y-1">
			<span class="text-xs font-medium text-neutral-400">Notes / Input</span>
			<textarea
				class="nodrag w-full min-h-[80px] rounded bg-neutral-950/50 px-2 py-2 text-xs text-neutral-200 cols-30 shadow-inner outline-none ring-1 ring-neutral-800 transition-all focus:ring-purple-500/50 resize-y"
				placeholder="Enter text..."
				bind:value={data.textInput}
			></textarea>
		</label>
	</div>

	{#each inputs as _, i}
		<Handle
			type="target"
			position={Position.Left}
			id={`target-${i}`}
			style="top: {((i + 1) * 100) / (inputs.length + 1)}%;"
			class="!bg-neutral-400 !w-3 !h-3 hover:!bg-white transition-colors"
		/>
	{/each}

	{#each outputs as _, i}
		<Handle
			type="source"
			position={Position.Right}
			id={`source-${i}`}
			style="top: {((i + 1) * 100) / (outputs.length + 1)}%;"
			class="!bg-neutral-400 !w-3 !h-3 hover:!bg-white transition-colors"
		/>
	{/each}
</div>
