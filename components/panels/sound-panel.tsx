"use client"

import { useState, useEffect } from "react"
import { Upload } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { useFlowStore } from "@/store/use-flow-store"
import { ResponseCollection } from "@/components/response-collection"

export function SoundPanel({ node, isActive, onResponseCollected }:any) {
  const { updateNodeData, handleFileUpload } = useFlowStore()
  const [delay, setDelay] = useState(node.data.delay || 0)
  const [duration, setDuration] = useState(node.data.duration)
  const [volume, setVolume] = useState(node.data.volume)

  // Update local state when node data changes
  useEffect(() => {
    setDelay(node.data.delay || 0)
    setDuration(node.data.duration)
    setVolume(node.data.volume)
  }, [node.data.delay, node.data.duration, node.data.volume])

  const handleDelayChange = (value) => {
    setDelay(value[0])
    updateNodeData(node.id, { delay: value[0] })
  }

  const handleDurationChange = (value) => {
    setDuration(value[0])
    updateNodeData(node.id, { duration: value[0] })
  }

  const handleVolumeChange = (value) => {
    setVolume(value[0])
    updateNodeData(node.id, { volume: value[0] })
  }

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="audioUpload">Upload Audio</Label>
        <div className="flex items-center gap-2">
          <Input
            id="audioUpload"
            type="file"
            accept="audio/*"
            onChange={(e) => handleFileUpload(e, node.id, "audio")}
          />
          <Button size="sm" onClick={() => document.getElementById("audioUpload").click()}>
            <Upload className="h-4 w-4" />
          </Button>
        </div>
        {node.data.audioName && <p className="text-sm text-gray-500 mt-1">Uploaded: {node.data.audioName}</p>}
      </div>
      <div>
        <Label htmlFor="delay">Delay (ms): {delay}</Label>
        <Slider
          id="delay"
          value={[delay]}
          min={0}
          max={5000}
          step={100}
          onValueChange={handleDelayChange}
          className="mt-2"
        />
      </div>
      <div>
        <Label htmlFor="duration">Duration (ms): {duration}</Label>
        <Slider
          id="duration"
          value={[duration]}
          min={500}
          max={10000}
          step={500}
          onValueChange={handleDurationChange}
          className="mt-2"
        />
      </div>
      <div>
        <Label htmlFor="volume">Volume (%): {volume}</Label>
        <Slider
          id="volume"
          value={[volume]}
          min={0}
          max={100}
          step={5}
          onValueChange={handleVolumeChange}
          className="mt-2"
        />
      </div>
      <div className="flex items-center space-x-2">
        <Switch
          id="loop"
          checked={node.data.loop}
          onCheckedChange={(checked) => updateNodeData(node.id, { loop: checked })}
        />
        <Label htmlFor="loop">Loop audio</Label>
      </div>
      
      {/* Add Response Collection component with isActive and onResponseCollected props */}
      <ResponseCollection 
        nodeId={node.id} 
        nodeData={node.data} 
        updateNodeData={updateNodeData}
        isActive={isActive}
        onResponseCollected={onResponseCollected}
      />
    </div>
  )
}

