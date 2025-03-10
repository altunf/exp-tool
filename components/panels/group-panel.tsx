"use client"

import { useState, useEffect } from "react"
import { Minus } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useFlowStore } from "@/store/use-flow-store"

export function GroupPanel({ node, nodes, addNodeToGroup, removeNodeFromGroup }) {
  const { updateNodeData } = useFlowStore()
  const [duration, setDuration] = useState(node.data.duration)
  const [width, setWidth] = useState(node.data.width || 300)
  const [height, setHeight] = useState(node.data.height || 200)

  // Update local state when node data changes
  useEffect(() => {
    setDuration(node.data.duration)
    setWidth(node.data.width || 300)
    setHeight(node.data.height || 200)
  }, [node.data.duration, node.data.width, node.data.height])

  const handleDurationChange = (value) => {
    setDuration(value[0])
    updateNodeData(node.id, { duration: value[0] })
  }

  const handleWidthChange = (value) => {
    setWidth(value[0])
    updateNodeData(node.id, { width: value[0] })
  }

  const handleHeightChange = (value) => {
    setHeight(value[0])
    updateNodeData(node.id, { height: value[0] })
  }

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="groupLabel">Group Label</Label>
        <Input
          id="groupLabel"
          value={node.data.label}
          onChange={(e) => updateNodeData(node.id, { label: e.target.value })}
        />
      </div>
      <div>
        <Label htmlFor="groupDuration">Duration (ms): {duration}</Label>
        <Slider
          id="groupDuration"
          value={[duration]}
          min={100}
          max={10000}
          step={100}
          onValueChange={handleDurationChange}
          className="mt-2"
        />
      </div>
      <div>
        <Label htmlFor="groupWidth">Width (px): {width}</Label>
        <Slider
          id="groupWidth"
          value={[width]}
          min={200}
          max={800}
          step={10}
          onValueChange={handleWidthChange}
          className="mt-2"
        />
      </div>
      <div>
        <Label htmlFor="groupHeight">Height (px): {height}</Label>
        <Slider
          id="groupHeight"
          value={[height]}
          min={100}
          max={600}
          step={10}
          onValueChange={handleHeightChange}
          className="mt-2"
        />
      </div>
      <div>
        <Label className="mb-2 block">Child Nodes</Label>
        {node.data.childNodes && node.data.childNodes.length > 0 ? (
          <div className="space-y-1 max-h-40 overflow-y-auto border rounded-md p-2">
            {node.data.childNodes.map((childNode) => (
              <div key={childNode.id} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                <span className="text-sm truncate">
                  {childNode.type.charAt(0).toUpperCase() + childNode.type.slice(1)}: {childNode.id}
                </span>
                <Button variant="ghost" size="sm" onClick={() => removeNodeFromGroup(node.id, childNode.id)}>
                  <Minus className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">No child nodes added yet</p>
        )}

        <div className="mt-3">
          <Select
            onValueChange={(value) => {
              const nodeToAdd = nodes.find((n) => n.id === value)
              if (nodeToAdd) {
                addNodeToGroup(node.id, nodeToAdd)
              }
            }}
          >
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Add node to group" />
            </SelectTrigger>
            <SelectContent>
              {nodes
                .filter((n) => n.id !== node.id && !node.data.childNodes.some((childNode) => childNode.id === n.id))
                .map((n) => (
                  <SelectItem key={n.id} value={n.id}>
                    {n.type.charAt(0).toUpperCase() + n.type.slice(1)}: {n.id}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}

