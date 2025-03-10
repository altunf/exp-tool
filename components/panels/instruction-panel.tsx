"use client"

import { useState, useEffect } from "react"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { useFlowStore } from "@/store/use-flow-store"

export function InstructionPanel({ node }) {
  const { updateNodeData } = useFlowStore()
  const [text, setText] = useState(node.data.text || "")
  const [textColor, setTextColor] = useState(node.data.textColor || "#000000")

  // Update local state when node data changes
  useEffect(() => {
    setText(node.data.text || "")
    setTextColor(node.data.textColor || "#000000")
  }, [node.data.text, node.data.textColor])

  const handleTextChange = (e) => {
    setText(e.target.value)
    updateNodeData(node.id, { text: e.target.value })
  }

  const handleColorChange = (e) => {
    setTextColor(e.target.value)
    updateNodeData(node.id, { textColor: e.target.value })
  }

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="instructionText">Instruction Text</Label>
        <Textarea
          id="instructionText"
          value={text}
          onChange={handleTextChange}
          placeholder="Enter instructions for participants"
          rows={6}
        />
      </div>

      <div>
        <Label htmlFor="textColor">Text Color</Label>
        <div className="flex items-center gap-2">
          <Input id="textColor" type="color" value={textColor} onChange={handleColorChange} className="w-12 h-8 p-1" />
          <Input type="text" value={textColor} onChange={handleColorChange} className="flex-1" />
        </div>
        <div className="mt-2 p-2 border rounded" style={{ color: textColor }}>
          <p className="text-sm">Preview: This is how your text will appear</p>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="continueButton"
          checked={node.data.showContinueButton}
          onCheckedChange={(checked) => updateNodeData(node.id, { showContinueButton: checked })}
        />
        <Label htmlFor="continueButton">Show continue button</Label>
      </div>
    </div>
  )
}

