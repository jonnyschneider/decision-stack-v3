import { StrategyStatements } from '@/lib/types';
import ReactFlow, { 
  Node, 
  Edge,
  Background,
  Controls,
  MarkerType 
} from 'reactflow';
import 'reactflow/dist/style.css';

interface StrategyFlowProps {
  strategy: StrategyStatements;
}

export default function StrategyFlow({ strategy }: StrategyFlowProps) {
  const nodes: Node[] = [
    {
      id: 'vision',
      type: 'input',
      data: { label: `Vision:\n${strategy.vision}` },
      position: { x: 250, y: 0 },
      className: 'bg-blue-100 p-4 rounded-lg shadow',
    },
    {
      id: 'mission',
      data: { label: `Mission:\n${strategy.mission}` },
      position: { x: 250, y: 100 },
      className: 'bg-green-100 p-4 rounded-lg shadow',
    },
    ...strategy.objectives.map((obj, index) => ({
      id: `objective-${index}`,
      data: { label: obj },
      position: { x: index * 200, y: 200 },
      className: 'bg-yellow-100 p-4 rounded-lg shadow',
    })),
  ];

  const edges: Edge[] = [
    {
      id: 'vision-mission',
      source: 'vision',
      target: 'mission',
      markerEnd: { type: MarkerType.ArrowClosed },
      className: 'stroke-gray-400',
    },
    ...strategy.objectives.map((_, index) => ({
      id: `mission-objective-${index}`,
      source: 'mission',
      target: `objective-${index}`,
      markerEnd: { type: MarkerType.ArrowClosed },
      className: 'stroke-gray-400',
    })),
  ];

  return (
    <div className="w-full h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}
