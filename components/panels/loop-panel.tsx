import React from "react";
import { useFlowStore } from "@/store/use-flow-store";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

export function LoopPanel() {
  const { selectedNode, updateNodeData, deleteNode } = useFlowStore();

  if (!selectedNode || selectedNode.type !== "loop") {
    return null;
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement> | number[],
    field: string
  ) => {
    let value;
    if (Array.isArray(e)) {
      value = e[0];
    } else if (e.target.type === "checkbox") {
      value = (e.target as HTMLInputElement).checked;
    } else {
      value = e.target.value;
    }

    if (field === "iterations" || field === "interStimulusInterval") {
      value = Number(value);
    }

    updateNodeData(selectedNode.id, { [field]: value });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Loop Settings</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => deleteNode(selectedNode.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </CardTitle>
        <CardDescription>Configure loop behavior</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="label">Label</Label>
          <Input
            id="label"
            value={
              typeof selectedNode.data.label === "string"
                ? selectedNode.data.label
                : ""
            }
            onChange={(e) => handleChange(e, "label")}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="iterations">Iterations</Label>
          <Input
            id="iterations"
            type="number"
            min={1}
            max={100}
            value={
              typeof selectedNode.data.iterations === "number"
                ? selectedNode.data.iterations
                : 3
            }
            onChange={(e) => handleChange(e, "iterations")}
          />
          <p className="text-xs text-muted-foreground">
            Number of times to repeat the loop
          </p>
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="isRandom">Randomize Order</Label>
          <Switch
            id="isRandom"
            checked={
              typeof selectedNode.data.isRandom === "boolean"
                ? selectedNode.data.isRandom
                : false
            }
            onCheckedChange={(checked) =>
              updateNodeData(selectedNode.id, { isRandom: checked })
            }
          />
        </div>
        <p className="text-xs text-muted-foreground">
          When enabled, child nodes will be presented in random order
        </p>

        <div className="space-y-2">
          <Label htmlFor="interStimulusInterval">
            Inter-Stimulus Interval (ms)
          </Label>
          <div className="flex items-center space-x-2">
            <Slider
              id="interStimulusInterval"
              min={0}
              max={5000}
              step={50}
              value={[
                typeof selectedNode.data.interStimulusInterval === "number"
                  ? selectedNode.data.interStimulusInterval
                  : 500,
              ]}
              onValueChange={(value) =>
                handleChange(value, "interStimulusInterval")
              }
              className="flex-1"
            />
            <Input
              type="number"
              min={0}
              max={5000}
              value={
                typeof selectedNode.data.interStimulusInterval === "number"
                  ? selectedNode.data.interStimulusInterval
                  : 500
              }
              onChange={(e) => handleChange(e, "interStimulusInterval")}
              className="w-20"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Time to wait between stimuli in milliseconds
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
