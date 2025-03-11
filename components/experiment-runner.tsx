"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useFlowStore } from "@/store/use-flow-store"
import { Play, Pause, SkipForward, StopCircle, ArrowLeft, Settings } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { NodeContentRenderer } from "@/components/node-content-renderer"

export function ExperimentRunner({ onStop }) {
  const { getNodeGroups, currentRunningNodeIndex, handleNextNode, runnerBackgroundColor, setRunnerBackgroundColor } =
    useFlowStore()

  const [isPaused, setIsPaused] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null)
  const [bgColor, setBgColor] = useState(runnerBackgroundColor)
  
  // Initialize node groups only once with useMemo to prevent recalculation
  const nodeGroups = React.useMemo(() => getNodeGroups(), []);
  
  // Make sure we have a valid current group, even if it's empty
  const currentGroup = nodeGroups[currentRunningNodeIndex] || [];

  // Update background color when it changes in the store
  useEffect(() => {
    setBgColor(runnerBackgroundColor)
  }, [runnerBackgroundColor])

  // Handle timing for the current group of nodes
  useEffect(() => {
    if (isPaused) return;
    if (currentGroup.length === 0) {
      // If the current group is empty, move to the next one
      setTimeout(() => handleNextNode(), 100);
      return;
    }

    // Clear any existing interval
    if (intervalId) {
      clearInterval(intervalId)
      setIntervalId(null)
    }

    // Find the maximum duration among all nodes in the current group
    const maxDuration = Math.max(
      ...currentGroup.map((node) => {
        if (!node) return 1000; // Default if node is undefined
        
        if (node.type === "stimulus" || node.type === "sound" || node.type === "group") {
          return node.data?.duration || 1000; // Default to 1000ms if not specified
        } else if (node.type === "response") {
          return node.data?.timeout || 5000; // Default to 5000ms if not specified
        } else if (node.type === "instruction" && !node.data?.showContinueButton) {
          return node.data?.duration || 3000; // Default to 3000ms for instructions
        }
        return 1000; // Default duration
      }),
      1000 // Ensure at least 1000ms minimum duration
    );

    setTimeRemaining(maxDuration);

    // Use a single timeout instead of interval + safety timeout
    const timeoutId = setTimeout(() => {
      handleNextNode();
    }, maxDuration);

    setIntervalId(timeoutId);

    // Update time remaining with a separate effect
    const displayId = setInterval(() => {
      setTimeRemaining((prev) => {
        const newTime = prev - 100;
        return newTime > 0 ? newTime : 0;
      });
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      clearInterval(displayId);
    };
  }, [currentRunningNodeIndex, isPaused]); // Reduced dependencies

  // Clean up intervals when component unmounts
  useEffect(() => {
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [intervalId]);

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
        {currentGroup.length === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center text-lg text-gray-500">
            No nodes to display in this group
          </div>
        ) : (
          currentGroup.map((node, index) => (
            node ? (
              <div key={node.id || index} className="absolute inset-0">
                <NodeContentRenderer 
                  node={node} 
                  isPaused={isPaused} 
                  handleSkip={handleSkip} 
                  getPositionStyle={getPositionStyle} 
                />
              </div>
            ) : null
          ))
        )}

        {timeRemaining > 0 && (
          <div className="absolute top-4 right-4 bg-white/80 px-3 py-1 rounded-full text-sm">
            {(timeRemaining / 1000).toFixed(1)}s
          </div>
        )}
      </div>
    </div>
  )
}

