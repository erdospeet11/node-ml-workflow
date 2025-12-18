export interface NodeTemplateParam {
    label: string;
    value: any;
    type: 'text' | 'number' | 'boolean' | 'select';
    options?: string[];
}

export interface NodeTemplate {
    id: string;
    label: string;
    description?: string;
    inputs: number;
    outputs: number;
    params: NodeTemplateParam[];
    defaultLabel?: string;
    defaultTextInput?: string;
}

export const nodeTemplates: NodeTemplate[] = [
    {
        id: 'generic_process',
        label: 'Generic Process',
        description: 'A standard processing node with 1 input and 1 output.',
        inputs: 1,
        outputs: 1,
        defaultLabel: 'Process Node',
        params: [
            { label: 'Process Name', value: 'process_1', type: 'text' },
            { label: 'Timeout (ms)', value: 1000, type: 'number' }
        ]
    },
    {
        id: 'data_source',
        label: 'Data Source',
        description: 'Start node for fetching data.',
        inputs: 0,
        outputs: 1,
        defaultLabel: 'Data Source',
        params: [
            { label: 'Connection String', value: 'http://localhost:8080', type: 'text' },
            { label: 'Auth Token', value: '', type: 'text' }
        ]
    },
    {
        id: 'data_sink',
        label: 'Data Sink',
        description: 'End node for saving/outputting data.',
        inputs: 1,
        outputs: 0,
        defaultLabel: 'Output',
        params: [
            { label: 'File Path', value: '/tmp/output.json', type: 'text' },
            { label: 'Format', value: 'json', type: 'select', options: ['json', 'csv', 'xml'] }
        ]
    },
    {
        id: 'filter',
        label: 'Filter',
        description: 'Filters data based on a condition.',
        inputs: 1,
        outputs: 1,
        defaultLabel: 'Filter',
        params: [
            { label: 'Field', value: 'status', type: 'text' },
            { label: 'Condition', value: 'equals', type: 'select', options: ['equals', 'contains', 'greater_than'] },
            { label: 'Value', value: 'active', type: 'text' }
        ]
    }
];
