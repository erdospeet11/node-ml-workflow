<script lang="ts">
  import { useSvelteFlow } from '@xyflow/svelte';

  const { getNodes, getEdges } = useSvelteFlow();

  function logContext() {
    const nodes = getNodes();
    const edges = getEdges();

    console.group('Svelte Flow Context');
    console.log('Nodes:', nodes);
    console.log('Edges:', edges);
    console.groupEnd();
    
    alert(`Current Nodes: ${nodes.length}\nCurrent Edges: ${edges.length}\n(Check console for details)`);
  }
</script>

<button onclick={logContext} class="inspect-btn"> Inspect Flow Context </button>

<style>
  .inspect-btn {
    padding: 8px 12px;
    background: #333;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 12px;
    pointer-events: all;
  }
  
  .inspect-btn:hover {
    background: #555;
  }
</style>
