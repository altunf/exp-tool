import { StimulusNode } from "./nodes/stimulus-node"
import { SoundNode } from "./nodes/sound-node"
import { ResponseNode } from "./nodes/response-node"
import { InstructionNode } from "./nodes/instruction-node"
import { GroupNode } from "./nodes/group-node"

export const nodeTypes = {
  stimulus: StimulusNode,
  response: ResponseNode,
  instruction: InstructionNode,
  sound: SoundNode,
  group: GroupNode,
}

