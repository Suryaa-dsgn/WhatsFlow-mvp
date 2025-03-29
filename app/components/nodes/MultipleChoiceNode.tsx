'use client';

import { Handle, Position } from 'reactflow';
import { useFlowStore } from '../../hooks/useFlowStore';

interface Choice {
  id: string;
  text: string;
  next?: string;
}

interface MultipleChoiceNodeProps {
  id: string;
  data: {
    nodeType: 'multipleChoice';
    message: string;
    choices: Choice[];
  };
}

export default function MultipleChoiceNode({ id, data }: MultipleChoiceNodeProps) {
  const { updateNode } = useFlowStore();
  
  return (
    <div className="p-4 rounded-md border bg-white shadow-sm min-w-[250px]">
      <div className="font-semibold text-sm text-blue-600 mb-1">Multiple Choice</div>
      <div className="text-sm mb-2">{data.message}</div>
      
      <div className="space-y-1">
        {data.choices.map((choice, index) => (
          <div key={choice.id} className="text-xs py-1 px-2 bg-blue-50 rounded">
            {choice.text}
            
            <Handle
              type="source"
              position={Position.Bottom}
              id={choice.id}
              className="w-2 h-2 bg-blue-400"
              style={{ 
                left: `${((index + 1) / (data.choices.length + 1)) * 100}%`,
                bottom: 0
              }}
            />
          </div>
        ))}
      </div>
      
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-gray-400"
      />
    </div>
  );
} 