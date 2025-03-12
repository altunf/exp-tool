import type React from "react"
import type { Edge, OnConnect, OnEdgesChange, OnNodesChange } from "@xyflow/react"
import type { ExperimentNode, ExperimentNodeData } from "./node-types"

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
  onDragOver: (event: React.DragEvent) => void
  onDrop: (event: React.DragEvent) => void
  updateNodeData: (id: string, newData: Partial<ExperimentNodeData>) => void
  deleteNode: (nodeId: string) => void
  handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>, nodeId: string, fileType: "image" | "audio") => void
  saveExperiment: () => void
  getSequenceChildNodes: (sequenceId: string) => ExperimentNode[]
  getNodeGroups: () => ExperimentNode[][]
  handleStartExperiment: () => void
  handleStopExperiment: () => void
  handleNextNode: () => void
  removeEdge: (edgeId: string) => void
}

export type FlowStore = FlowState & FlowActions

