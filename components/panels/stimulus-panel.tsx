
"use client"

import { useState, useEffect } from "react"
import { Upload } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Button } from "@/components/ui/button"
import { useFlowStore } from "@/store/use-flow-store"


export function StimulusPanel({ node }) {
  const { updateNodeData, handleFileUpload } = useFlowStore()
  const [duration, setDuration] = useState(node.data.duration)
  const [position, setPosition] = useState(node.data.position || "center")

  // Update local state when node data changes
  useEffect(() => {
    setDuration(node.data.duration)
    setPosition(node.data.position || "center")
  }, [node.data.duration, node.data.position])

  // Helper function to render position preview
  const renderPositionPreview = (position) => {
    const getPositionStyle = () => {
      switch (position) {
        case "top-left":
          return { justifyContent: "flex-start", alignItems: "flex-start" }
        case "top":
          return { justifyContent: "center", alignItems: "flex-start" }
        case "top-right":
          return { justifyContent: "flex-end", alignItems: "flex-start" }
        case "left":
          return { justifyContent: "flex-start", alignItems: "center" }
        case "right":
          return { justifyContent: "flex-end", alignItems: "center" }
        case "bottom-left":
          return { justifyContent: "flex-start", alignItems: "flex-end" }
        case "bottom":
          return { justifyContent: "center", alignItems: "flex-end" }
        case "bottom-right":
          return { justifyContent: "flex-end", alignItems: "flex-end" }
        case "center":
        default:
          return { justifyContent: "center", alignItems: "center" }
      }
    }

    return (
      <div className="border rounded-md w-full h-16 flex" style={getPositionStyle()}>
        <div className="w-6 h-6 bg-blue-200 rounded"></div>
      </div>
    )
  }

  const handleDurationChange = (value) => {
    setDuration(value[0])
    updateNodeData(node.id, { duration: value[0] })
  }

  const handlePositionChange = (value) => {
    setPosition(value)
    updateNodeData(node.id, { position: value })
  }

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="imageUpload">Upload Image</Label>
        <div className="flex items-center gap-2">
          <Input
            id="imageUpload"
            type="file"
            accept="image/*"
            onChange={(e) => handleFileUpload(e, node.id, "image")}
          />
          <Button size="sm" onClick={() => document.getElementById("imageUpload").click()}>
            <Upload className="h-4 w-4" />
          </Button>
        </div>
        {node.data.imageName && <p className="text-sm text-gray-500 mt-1">Uploaded: {node.data.imageName}</p>}
      </div>
      <div>
        <Label htmlFor="imageUrl">Image URL (optional)</Label>
        <Input
          id="imageUrl"
          value={node.data.imageUrl || ""}
          onChange={(e) => updateNodeData(node.id, { imageUrl: e.target.value })}
          placeholder="Enter image URL"
        />
      </div>
      <div>
        <Label htmlFor="duration">Duration (ms): {duration}</Label>
        <Slider
          id="duration"
          value={[duration]}
          min={100}
          max={5000}
          step={100}
          onValueChange={handleDurationChange}
          className="mt-2"
        />
      </div>
      <div className="flex items-center space-x-2">
        <Switch
          id="fixationPoint"
          checked={node.data.showFixationPoint}
          onCheckedChange={(checked) => updateNodeData(node.id, { showFixationPoint: checked })}
        />
        <Label htmlFor="fixationPoint">Show fixation point</Label>
      </div>

      <div>
        <Label className="mb-2 block">Image Position</Label>
        <RadioGroup value={position} onValueChange={handlePositionChange} className="grid grid-cols-3 gap-2">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="top-left" id="top-left" />
            <Label htmlFor="top-left">Top Left</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="top" id="top" />
            <Label htmlFor="top">Top</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="top-right" id="top-right" />
            <Label htmlFor="top-right">Top Right</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="left" id="left" />
            <Label htmlFor="left">Left</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="center" id="center" />
            <Label htmlFor="center">Center</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="right" id="right" />
            <Label htmlFor="right">Right</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="bottom-left" id="bottom-left" />
            <Label htmlFor="bottom-left">Bottom Left</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="bottom" id="bottom" />
            <Label htmlFor="bottom">Bottom</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="bottom-right" id="bottom-right" />
            <Label htmlFor="bottom-right">Bottom Right</Label>
          </div>
        </RadioGroup>

        <div className="mt-3 border p-2 rounded-md">
          <Label className="text-xs mb-1 block">Preview:</Label>
          {renderPositionPreview(position)}
        </div>
      </div>
    </div>
  )
}

