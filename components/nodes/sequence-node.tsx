import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Layers } from "lucide-react";
import { Handle, Position } from "@xyflow/react";
import { useFlowStore } from "@/store/use-flow-store";

export function SequenceNode({ data, id }: any) {
  const { getSequenceChildNodes } = useFlowStore();
  const childNodes = getSequenceChildNodes(id);

  return (
    <div className="w-64 shadow-md p-0 overflow-hidden bg-white rounded-2xl">
      <Handle
        type="target"
        position={Position.Top}
        id="top"
        className="w-2 h-2 !bg-blue-500"
      />
      <Handle
        type="target"
        position={Position.Left}
        id="left"
        className="w-2 h-2 !bg-green-500"
      />
      <CardHeader className="bg-orange-100 p-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Layers size={16} />
          Sequence
          <span className="text-xs text-gray-500 ml-auto">{id}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3">
        <div className="text-xs text-gray-500">
          <p>Child nodes: {childNodes.length}</p>
          {childNodes.length > 0 && (
            <div className="mt-1 text-xs">
              {childNodes
                .map((node) => (
                  <div key={node.id} className="truncate">
                    {node.id}
                  </div>
                ))
                .slice(0, 3)}
              {childNodes.length > 3 && (
                <div>+ {childNodes.length - 3} more</div>
              )}
            </div>
          )}
        </div>
      </CardContent>
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        className="w-2 h-2 !bg-green-500"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom"
        className="w-2 h-2 !bg-blue-500"
      />
    </div>
  );
};
