"use client";
import React from "react";
import {
  ReactFlow,
  Controls,
  MiniMap,
  Background,
  ConnectionLineType,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useFlowStore } from "@/store/use-flow-store";
import CustomEdge from "./custom-edge";

import { StimulusNode } from "./nodes/stimulus-node";
import { SoundNode } from "./nodes/sound-node";
import { ResponseNode } from "./nodes/response-node";
import { InstructionNode } from "./nodes/instruction-node";
import { SequenceNode } from "./nodes/sequence-node";
import { LoopNode } from "./nodes/loop-node";

const nodeTypes = {
  stimulus: StimulusNode,
  response: ResponseNode,
  instruction: InstructionNode,
  sound: SoundNode,
  sequence: SequenceNode,
  loop: LoopNode,
};
const edgeTypes = {
  custom: CustomEdge,
};

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
    rightPanelOpen,
    setRightPanelOpen,
  } = useFlowStore();

  const handleNodeClick = (event: React.MouseEvent, node: any) => {
    node.type !== "sequence" && setSelectedNode(node);
    node.type == "sequence" && rightPanelOpen && setRightPanelOpen(false);
  };

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
      style={{ backgroundColor:"#f7f9fb", width: "100%", height: "100%" }}
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
}
