import { getBezierPath, type EdgeProps } from "@xyflow/react"

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
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  })

  return <path id={id} style={style} className="react-flow__edge-path" d={edgePath} markerEnd={markerEnd} />
}

