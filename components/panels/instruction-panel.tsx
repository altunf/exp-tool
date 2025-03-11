"use client";

import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { useFlowStore } from "@/store/use-flow-store";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { RichTextEditor } from "@/components/ui/rich-text-editor"; // Updated import path
import { PositionSelector } from "@/components/position-selector";

export function InstructionPanel({ node }:any) {
  const { updateNodeData } = useFlowStore();
  const [text, setText] = useState(node.data.text || "");
  const [textColor, setTextColor] = useState(node.data.textColor || "#ffffff");
  const [position, setPosition] = useState(node.data.position || "center");

  // Position options
  const positionOptions = [
    { value: "center", label: "Center" },
    { value: "top", label: "Top" },
    { value: "top-left", label: "Top Left" },
    { value: "top-right", label: "Top Right" },
    { value: "bottom", label: "Bottom" },
    { value: "bottom-left", label: "Bottom Left" },
    { value: "bottom-right", label: "Bottom Right" },
    { value: "left", label: "Left" },
    { value: "right", label: "Right" },
  ];

  // Rest of your color options
  const colorOptions = [
    { value: "#ffffff", label: "White", className: "bg-black text-white" },
    { value: "#000000", label: "Black", className: "bg-white text-black" },
    { value: "#ff0000", label: "Red",  className: "bg-white text-[#ff0000]" },
    { value: "#ffff00", label: "Yellow", className: "bg-black text-[#ffff00]" },
    { value: "#00ff00", label: "Green", className: "bg-black text-[#00ff00]" },
    { value: "#0000ff", label: "Blue", className: "bg-black text-[#0000ff]" },
    { value: "#800080", label: "Purple", className: "bg-black text-[#800080]" },
  ];

  useEffect(() => {
    setText(node.data.text || "");
    setTextColor(node.data.textColor || "#ffffff");
    setPosition(node.data.position || "center");
  }, [node.data.text, node.data.textColor, node.data.position]);

  const handleTextChange = (newText) => {
    setText(newText);
    updateNodeData(node.id, { text: newText });
  };

  const handlePositionChange = (value) => {
    setPosition(value);
    updateNodeData(node.id, { position: value });
  };

  const handleColorChange = (value) => {
    setTextColor(value);
    updateNodeData(node.id, { textColor: value });
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="instructionText">Instruction Text</Label>
        <div className="mt-1">
          <RichTextEditor 
            initialContent={text} 
            onChange={handleTextChange} 
          />
        </div>
      </div>

      {/* Position selector component */}
      <PositionSelector
        position={position}
        onPositionChange={handlePositionChange}
        positionOptions={positionOptions}
      />

      <div>
        <Label className="mb-2 block">Text Color</Label>
        <RadioGroup
          value={textColor}
          onValueChange={handleColorChange}
          className="grid grid-cols-3 gap-2"
        >
          {colorOptions.map((color) => (
            <div key={color.value} className="flex items-center space-x-2">
              <RadioGroupItem value={color.value} id={color.value} />
              <Label 
                htmlFor={color.value} 
                className={`px-2 py-1 rounded ${color.className}`}
              >
                {color.label}
              </Label>
            </div>
          ))}
        </RadioGroup>
        
        <div className="mt-4">
          <Label htmlFor="customColor">Custom Color (Hex format)</Label>
          <div className="flex items-center gap-2 mt-1">
            <Input
              type="text"
              value={textColor}
              onChange={(e) => handleColorChange(e.target.value)}
              className="flex-1"
              placeholder="#RRGGBB"
            />
            <div 
              className="w-8 h-8 border rounded" 
              style={{ backgroundColor: textColor }}
              aria-label="Color preview"
            />
          </div>
        </div>
        
        <div className="mt-2 p-2 border rounded" style={{ color: textColor }}>
          <div 
            className="text-sm"
            dangerouslySetInnerHTML={{ __html: text }}
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="continueButton"
          checked={node.data.showContinueButton}
          onCheckedChange={(checked) =>
            updateNodeData(node.id, { showContinueButton: checked })
          }
        />
        <Label htmlFor="continueButton">Show continue button</Label>
      </div>
    </div>
  );
}
