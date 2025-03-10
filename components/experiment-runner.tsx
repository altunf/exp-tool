"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useFlowStore } from "@/store/use-flow-store"
import { Play, Pause, SkipForward, StopCircle, ArrowLeft, Settings } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import type { ExperimentNode } from "@/types/node-types"

export function ExperimentRunner({ onStop }) {
  const { getNodeGroups, currentRunningNodeIndex, handleNextNode, runnerBackgroundColor, setRunnerBackgroundColor } =
    useFlowStore()

  const [isPaused, setIsPaused] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null)
  const [bgColor, setBgColor] = useState(runnerBackgroundColor)

  const nodeGroups = getNodeGroups()
  const currentGroup = nodeGroups[currentRunningNodeIndex] || []

  useEffect(() => {
    setBgColor(runnerBackgroundColor)
  }, [runnerBackgroundColor])

  useEffect(() => {
    if (isPaused || currentGroup.length === 0) return

    if (intervalId) {
      clearInterval(intervalId)
    }

    const maxDuration = Math.max(
      ...currentGroup.map((node) => {
        if (node.type === "stimulus" || node.type === "sound" || node.type === "group") {
          return node.data.duration
        } else if (node.type === "response") {
          return node.data.timeout
        } else if (node.type === "instruction" && !node.data.showContinueButton) {
          return 5000 // Default 5 seconds for instructions without continue button
        }
        return 0
      }),
    )

    setTimeRemaining(maxDuration)

    if (maxDuration > 0) {
      const id = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 100) {
            clearInterval(id)
            setTimeout(() => {
              handleNextNode()
            }, 0)
            return 0
          }
          return prev - 100
        })
      }, 100)

      setIntervalId(id)

      return () => clearInterval(id)
    }
  }, [currentGroup, isPaused, handleNextNode])

  useEffect(() => {
    return () => {
      if (intervalId) {
        clearInterval(intervalId)
      }
    }
  }, [intervalId])

  const handlePauseResume = () => {
    setIsPaused((prev) => !prev)
  }

  const handleSkip = () => {
    if (intervalId) {
      clearInterval(intervalId)
      setIntervalId(null)
    }
    handleNextNode()
  }

  const handleBgColorChange = (e) => {
    const newColor = e.target.value
    setBgColor(newColor)
    setRunnerBackgroundColor(newColor)
  }

  const getPositionStyle = (position) => {
    switch (position) {
      case "top-left":
        return { top: "10%", left: "10%" }
      case "top":
        return { top: "10%", left: "50%", transform: "translateX(-50%)" }
      case "top-right":
        return { top: "10%", right: "10%" }
      case "left":
        return { top: "50%", left: "10%", transform: "translateY(-50%)" }
      case "right":
        return { top: "50%", right: "10%", transform: "translateY(-50%)" }
      case "bottom-left":
        return { bottom: "10%", left: "10%" }
      case "bottom":
        return { bottom: "10%", left: "50%", transform: "translateX(-50%)" }
      case "bottom-right":
        return { bottom: "10%", right: "10%" }
      case "center":
      default:
        return { top: "50%", left: "50%", transform: "translate(-50%, -50%)" }
    }
  }

  const renderNodeContent = (node: ExperimentNode) => {
    if (!node) return null

    switch (node.type) {
      case "stimulus":
        return (
          <div className={`absolute`} style={getPositionStyle(node.data.position || "center")}>
            {node.data.imageUrl ? (
              <div className="relative">
                <img
                  src={node.data.imageUrl || "/placeholder.svg"}
                  alt="Visual Stimulus"
                  className="max-h-64 max-w-full object-contain"
                />
                {node.data.showFixationPoint && (
                  <div
                    className="absolute w-3 h-3 bg-red-500 rounded-full"
                    style={{
                      left: "50%",
                      top: "50%",
                      transform: "translate(-50%, -50%)",
                    }}
                  />
                )}
              </div>
            ) : (
              <div className="text-gray-400">No image available</div>
            )}
          </div>
        )

      case "sound":
        return (
          <div className={`flex flex-col items-center justify-center h-64`}>
            <div className="text-xl mb-4">🔊 Sound Stimulus</div>
            {node.data.audioUrl ? (
              <audio
                src={node.data.audioUrl}
                autoPlay={!isPaused}
                loop={node.data.loop}
                controls
                style={{ width: "80%" }}
              />
            ) : (
              <div className="text-gray-400">No audio available</div>
            )}
          </div>
        )

      case "instruction":
        return (
          <div className={`flex flex-col items-center justify-center h-64`}>
            <div className="text-lg mb-4 max-w-lg text-center" style={{ color: node.data.textColor || "inherit" }}>
              {node.data.text || "No instructions provided"}
            </div>
            {node.data.showContinueButton && (
              <Button onClick={handleSkip} className="mt-4">
                Continue
              </Button>
            )}
          </div>
        )

      case "response":
        return (
          <div className="flex flex-col items-center justify-center h-64">
            <div className="text-xl mb-4">Waiting for response...</div>
            <div className="text-lg mb-8">Response type: {node.data.responseType}</div>
            <div className="flex gap-4">
              {node.data.responseType === "button" && (
                <>
                  <Button onClick={handleSkip}>Yes</Button>
                  <Button variant="outline" onClick={handleSkip}>
                    No
                  </Button>
                </>
              )}
              {node.data.responseType !== "button" && (
                <div className="text-gray-500">
                  {node.data.responseType === "keyboard" ? "Press any key to continue" : "Click anywhere to continue"}
                </div>
              )}
            </div>
          </div>
        )

      case "group":
        return (
          <div className="flex flex-col items-center justify-center h-64">
            <div className="text-xl mb-4">Group: {node.data.label}</div>
            <div className="text-gray-500">Contains {node.data.childNodes.length} nodes</div>
          </div>
        )

      default:
        return <div>Unknown node type</div>
    }
  }

  return (
    <div className="flex flex-col h-screen" style={{ backgroundColor: bgColor }}>
      <div className="p-4 border-b bg-white flex justify-between items-center">
        <Button variant="outline" onClick={onStop}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Builder
        </Button>
        <div className="text-lg font-medium">
          Running Experiment: Group {currentRunningNodeIndex + 1} of {nodeGroups.length}
        </div>
        <div className="flex gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-1" /> Settings
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-4">
                <h4 className="font-medium">Runner Settings</h4>
                <div className="space-y-2">
                  <Label htmlFor="bgColor">Background Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="bgColor"
                      type="color"
                      value={bgColor}
                      onChange={handleBgColorChange}
                      className="w-12 h-8 p-1"
                    />
                    <Input type="text" value={bgColor} onChange={handleBgColorChange} className="flex-1" />
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
          <Button variant="outline" size="sm" onClick={handlePauseResume}>
            {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
          </Button>
          <Button variant="outline" size="sm" onClick={handleSkip}>
            <SkipForward className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={onStop}>
            <StopCircle className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 relative">
        {currentGroup.map((node, index) => (
          <div key={node.id} className="absolute inset-0">
            {renderNodeContent(node)}
          </div>
        ))}

        {timeRemaining > 0 && (
          <div className="absolute top-4 right-4 bg-white/80 px-3 py-1 rounded-full text-sm">
            {(timeRemaining / 1000).toFixed(1)}s
          </div>
        )}
      </div>
    </div>
  )
}

