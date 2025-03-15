import type React from "react"
import type { Edge, OnConnect, OnEdgesChange, OnNodesChange } from "@xyflow/react"
import type { ExperimentNode, ExperimentNodeData } from "./node-types"

// Core flow state
export interface FlowState {
  nodes: ExperimentNode[]
  edges: Edge[]
  nodeCounter: number
  reactFlowInstance: any | null
  selectedNode: ExperimentNode | null
  rightPanelOpen: boolean
  isRunning: boolean
  currentRunningNodeIndex: number
  runnerBackgroundColor: string
}

// Core flow actions
export interface FlowActions {
  setSelectedNode: (node: ExperimentNode | null) => void
  setRightPanelOpen: (open: boolean) => void
  setReactFlowInstance: (instance: any) => void
  setIsRunning: (isRunning: boolean) => void
  setCurrentRunningNodeIndex: (index: number) => void
  setRunnerBackgroundColor: (color: string) => void
  onNodesChange: OnNodesChange
  onEdgesChange: OnEdgesChange
  onConnect: OnConnect
}

// Node manipulation actions
export interface NodeActions {
  onDragOver: (event: React.DragEvent) => void
  onDrop: (event: React.DragEvent) => void
  updateNodeData: (id: string, newData: Partial<ExperimentNodeData>) => void
  deleteNode: (nodeId: string) => void
  handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>, nodeId: string, fileType: "image" | "audio") => void
  saveExperiment: () => void
  removeEdge: (edgeId: string) => void
}

// Experiment execution actions
export interface ExperimentActions {
  getSequenceChildNodes: (sequenceId: string) => ExperimentNode[]
  getLoopChildNodes: (loopId: string) => ExperimentNode[]
  getNodeGroups: () => ExperimentNode[][]
  handleStartExperiment: () => void
  handleStopExperiment: () => void
  handleNextNode: () => void
}

export type FlowStore = FlowState & FlowActions & NodeActions & ExperimentActions

