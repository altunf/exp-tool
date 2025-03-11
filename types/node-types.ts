import type { Node }  from "@xyflow/react"

export interface BaseNodeData {
  order: number
}

export interface StimulusNodeData extends BaseNodeData {
  imageUrl: string
  duration: number
  position: "top-left" | "top" | "top-right" | "left" | "center" | "right" | "bottom-left" | "bottom" | "bottom-right"
  imageName?: string
}

export interface ResponseNodeData extends BaseNodeData {
  responseType: "keyboard" | "mouse" | "button"
  timeout: number
  correctResponse: string
}

export interface InstructionNodeData extends BaseNodeData {
  text: string
  showContinueButton: boolean
  textColor: string
}

export interface SoundNodeData extends BaseNodeData {
  audioUrl: string
  duration: number
  delay: number
  volume: number
  loop: boolean
  audioName?: string
  audioType?: string
}

export interface GroupNodeData extends BaseNodeData {
  label: string
  childNodes: Node[]
  duration: number
  width: number
  height: number
}

export type ExperimentNodeData = {
  [key: string]: unknown
} & (
  | StimulusNodeData
  | ResponseNodeData
  | InstructionNodeData
  | SoundNodeData
  | GroupNodeData
)

export interface ExperimentNode extends Node<ExperimentNodeData> {
  type: "stimulus" | "response" | "instruction" | "sound" | "group"
}

