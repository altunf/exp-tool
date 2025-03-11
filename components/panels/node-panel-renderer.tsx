import { type ReactElement } from 'react'
import { type ExperimentNode } from "@/types/node-types"
import { StimulusPanel } from "./stimulus-panel"
import { ResponsePanel } from "./response-panel"
import { InstructionPanel } from "./instruction-panel"
import { SoundPanel } from "./sound-panel"

interface BasePanelProps {
  node: ExperimentNode;
}

interface GroupPanelProps extends BasePanelProps {
  nodes: ExperimentNode[];
}

const NODE_PANELS = {
  "stimulus": StimulusPanel,
  "response": ResponsePanel,
  "instruction": InstructionPanel,
  "sound": SoundPanel,
} as const

export function NodePanelRenderer({ 
  node, 
  nodes,
}: GroupPanelProps): ReactElement {
  const PanelComponent = NODE_PANELS[node.type as keyof typeof NODE_PANELS]

  if (!PanelComponent) {
    return <p>No properties available for this node type.</p>
  }
  return <PanelComponent 
    node={node}
    nodes={nodes}
  />
}

