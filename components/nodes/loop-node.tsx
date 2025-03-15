import { Handle, Position } from "@xyflow/react";
import React from "react";
import { CardContent, CardHeader, CardTitle } from "../ui/card";
import { Repeat2 } from "lucide-react";

export function LoopNode({ data, id }: any) {
  return (
    <div className="w-64 shadow-md p-0 overflow-hidden bg-white rounded-2xl">
      <Handle
        type="target"
        position={Position.Top}
        id="top"
        className="w-2 h-2 !bg-blue-500"
      />

      <CardHeader className="bg-cyan-100 p-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Repeat2 size={16} />
          Loop
          <span className="text-xs text-gray-500 ml-auto">{id}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3">
        <div className="space-y-2">
          <div className="text-xs text-gray-500">
            <p>Iterations: {data.iterations || 3}</p>
            <p>Order: {data.isRandom ? "Random" : "Sequential"}</p>
            <p>ISI: {data.interStimulusInterval || 500}ms</p>
          </div>
        </div>
      </CardContent>
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom"
        className="w-2 h-2 !bg-blue-500"
      />
    </div>
  );
}
