"use client";

import { useState, useEffect } from "react";
import { Upload } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { useFlowStore } from "@/store/use-flow-store";
import { PositionSelector } from "@/components/position-selector";
import { ResponseCollection } from "@/components/response-collection";

const POSITION_VALUES = [
  { value: 'top', label: 'Top' },
  { value: 'left', label: 'Left' },
  { value: 'center', label: 'Center' },
  { value: 'right', label: 'Right' },
  { value: 'bottom', label: 'Bottom' },
];

export function StimulusPanel({ node, isActive, onResponseCollected }:any) {
  const { updateNodeData, handleFileUpload } = useFlowStore();
  const [duration, setDuration] = useState(node.data.duration);
  const [position, setPosition] = useState(node.data.position || "center");

  useEffect(() => {
    setDuration(node.data.duration);
    setPosition(node.data.position || "center");
  }, [node.data.duration, node.data.position]);

  const handleDurationChange = (value:number[]) => {
    setDuration(value[0]);
    updateNodeData(node.id, { duration: value[0] });
  };

  const handlePositionChange = (value:string) => {
    setPosition(value);
    updateNodeData(node.id, { position: value });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="imageUpload">Upload Image</Label>
        <div className="flex items-center gap-2">
          <Input
            id="imageUpload"
            type="file"
            accept="image/*"
            onChange={(e) => handleFileUpload(e, node.id, "image")}
          />
          <Button
            size="sm"
            onClick={() => {
              const uploadElement = document.getElementById("imageUpload");
              if (uploadElement) uploadElement.click();
            }}
          >
            <Upload className="h-4 w-4" />
          </Button>
        </div>
        {node.data.imageName && (
          <p className="text-sm text-gray-500 mt-1">
            Uploaded: {node.data.imageName}
          </p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="imageUrl">Image URL (optional)</Label>
        <Input
          id="imageUrl"
          value={node.data.imageUrl || ""}
          onChange={(e) =>
            updateNodeData(node.id, { imageUrl: e.target.value })
          }
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

      {/* Position selector component */}
      <PositionSelector
        position={position}
        onPositionChange={handlePositionChange}
        positionOptions={POSITION_VALUES}
        label="Image Position"
      />
      
      {/* Add Response Collection component */}
      <ResponseCollection 
        nodeId={node.id} 
        nodeData={node.data} 
        updateNodeData={updateNodeData}
        isActive={isActive}
        onResponseCollected={onResponseCollected}
      />
    </div>
  );
}
