import React from 'react';
import {
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  useReactFlow,
  type EdgeProps,
} from '@xyflow/react';
 
export default function CustomEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
}: EdgeProps) {
  const { setEdges } = useReactFlow();
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });
 
  const onEdgeClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    setEdges((edges) => edges.filter((edge) => edge.id !== id));
  };
 
  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />
      <EdgeLabelRenderer>
        <div
          className="nodrag nopan"
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: 'all',
          }}
        >
          <button 
            className="flex items-center justify-center w-5 h-5 rounded-full bg-red-500 text-white cursor-pointer hover:bg-red-600 shadow-md"
            onClick={onEdgeClick}
            title="Remove connection"
          >
            ×
          </button>
        </div>
      </EdgeLabelRenderer>
    </>
  );
}

