"use client";
import React, {  useMemo } from "react";
import {
  ReactFlow,
  Controls,
  MiniMap,
  Background,
  ConnectionLineType,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { nodeTypes } from "./node-types";
import { useFlowStore } from "@/store/use-flow-store";
import CustomEdge from "./custom-edge";

export function FlowCanvas() {
  const {
    nodes,
    edges,
    setReactFlowInstance,
    onNodesChange,
    onEdgesChange,
    onConnect,
    onDrop,
    onDragOver,
    setSelectedNode,
  } = useFlowStore();

  const edgeTypes = useMemo(() => ({
    custom: CustomEdge,
  }), []);

  const handleNodeClick = (event: React.MouseEvent, node: any) => {
    setSelectedNode(node);
  }

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onInit={setReactFlowInstance}
      onDrop={onDrop}
      onDragOver={onDragOver}
      onNodeClick={handleNodeClick}
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      defaultEdgeOptions={{ type: "custom" }}
      connectionLineType={ConnectionLineType.SmoothStep}
      fitView
      snapToGrid
      snapGrid={[15, 15]}
      style={{ width: "100%", height: "100%" }}
      defaultViewport={{ x: 0, y: 0, zoom: 1 }}
      minZoom={0.1}
      maxZoom={2}
      proOptions={{ hideAttribution: true }}
      connectOnClick={false}
    >
      <Controls />
      <MiniMap />
      <Background />
    </ReactFlow>
  );
};
