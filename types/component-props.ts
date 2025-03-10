import type React from "react"
import type { ExperimentNode } from "./node-types.ts"

export interface NodePaletteProps {
  onDragStart: (event: React.DragEvent, nodeType: string) => void
}

export interface PropertyPanelProps {
  selectedNode: ExperimentNode
  deleteNode: () => void
  nodes: ExperimentNode[]
  addNodeToGroup: (groupId: string, nodeToAdd: ExperimentNode) => void
  removeNodeFromGroup: (groupId: string, nodeIdToRemove: string) => void
  onClose: () => void
}

export interface NodePanelRendererProps {
  node: ExperimentNode
  nodes: ExperimentNode[]
  addNodeToGroup: (groupId: string, nodeToAdd: ExperimentNode) => void
  removeNodeFromGroup: (groupId: string, nodeIdToRemove: string) => void
}

export interface ExperimentRunnerProps {
  onStop: () => void
}

export type FlowCanvasProps = {}

export interface StimulusPanelProps {
  node: ExperimentNode
}

export interface ResponsePanelProps {
  node: ExperimentNode
}

export interface InstructionPanelProps {
  node: ExperimentNode
}

export interface SoundPanelProps {
  node: ExperimentNode
}

export interface GroupPanelProps {
  node: ExperimentNode
  nodes: ExperimentNode[]
  addNodeToGroup: (groupId: string, nodeToAdd: ExperimentNode) => void
  removeNodeFromGroup: (groupId: string, nodeIdToRemove: string) => void
}

