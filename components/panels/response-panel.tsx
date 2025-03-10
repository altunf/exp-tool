"use client"

import { useState, useEffect } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useFlowStore } from "@/store/use-flow-store"

export function ResponsePanel({ node }) {
  const { updateNodeData } = useFlowStore()
  const [timeout, setTimeout] = useState(node.data.timeout)

  // Update local state when node data changes
  useEffect(() => {
    setTimeout(node.data.timeout)
  }, [node.data.timeout])

  const handleTimeoutChange = (value) => {
    setTimeout(value[0])
    updateNodeData(node.id, { timeout: value[0] })
  }

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="responseType">Response Type</Label>
        <Select
          value={node.data.responseType}
          onValueChange={(value) => updateNodeData(node.id, { responseType: value })}
        >
          <SelectTrigger id="responseType">
            <SelectValue placeholder="Select response type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="keyboard">Keyboard</SelectItem>
            <SelectItem value="mouse">Mouse</SelectItem>
            <SelectItem value="button">Button</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="timeout">Timeout (ms): {timeout}</Label>
        <Slider
          id="timeout"
          value={[timeout]}
          min={1000}
          max={30000}
          step={1000}
          onValueChange={handleTimeoutChange}
          className="mt-2"
        />
      </div>
      <div>
        <Label htmlFor="correctResponse">Correct Response (optional)</Label>
        <Input
          id="correctResponse"
          value={node.data.correctResponse || ""}
          onChange={(e) => updateNodeData(node.id, { correctResponse: e.target.value })}
          placeholder="e.g., 'space' or 'left'"
        />
      </div>
    </div>
  )
}

