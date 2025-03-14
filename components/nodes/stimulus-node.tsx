import { CardHeader, CardTitle } from "@/components/ui/card";
import { ImageIcon } from "lucide-react";
import { Handle, Position } from "@xyflow/react";

export function StimulusNode({ data, id }: any) {
  const getPositionClass = () => {
    switch (data.position) {
      case "top":
        return "justify-center items-start";
      case "left":
        return "justify-start items-center";
      case "right":
        return "justify-end items-center";
      case "bottom":
        return "justify-center items-end";
      case "center":
      default:
        return "justify-center items-center";
    }
  };

  return (
    <div className="w-64 shadow-md p-0 overflow-hidden bg-white rounded-2xl">
      <Handle
        type="target"
        position={Position.Top}
        id="top"
        className="w-2 h-2 !bg-blue-500"
      />

      <CardHeader className="bg-blue-100 p-3 ">
        <CardTitle className="text-sm flex items-center gap-2">
          <ImageIcon size={16} />
          Visual Stimulus
          <span className="text-xs text-gray-500 ml-auto">{id}</span>
        </CardTitle>
      </CardHeader>
      <div className="p-3">
        <div className="space-y-2">
          <div className="flex items-center justify-center p-2 bg-gray-100 rounded-md h-28">
            {data.imageUrl ? (
              <div className="relative w-full h-16 flex">
                <div className={`flex ${getPositionClass()} w-full h-full`}>
                  <img
                    src={data.imageUrl || "/placeholder.svg"}
                    alt="Stimulus"
                    className="max-h-16 max-w-full object-contain"
                  />
                </div>
              </div>
            ) : (
              <div className="w-full h-24 flex items-center justify-center text-gray-400 border border-dashed rounded-md">
                Image Placeholder
              </div>
            )}
          </div>
          <div className="text-xs text-gray-500">
            <p>Duration: {data.duration}ms</p>
            <p>Position: {data.position || "center"}</p>
       {/*      {data.imageName && <p>Image: {data.imageName}</p>} */}
          </div>
        </div>
      </div>
    </div>
  );
};
