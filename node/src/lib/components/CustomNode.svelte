<script lang="ts">
    import { Handle, Position } from '@xyflow/svelte';
    export let data;
  </script>
  
<div class="my-node">
    {data.label}
    <Handle type="source" position={Position.Top} />
    <Handle type="source" position={Position.Right} />
    <Handle type="source" position={Position.Bottom} />
    <Handle type="source" position={Position.Left} />
</div>