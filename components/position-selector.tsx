import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PositionOption {
  value: string;
  label: string;
}

interface PositionSelectorProps {
  position: string;
  onPositionChange: (value: string) => void;
  positionOptions: PositionOption[];
  label?: string;
}

export function PositionSelector({ 
  position, 
  onPositionChange, 
  positionOptions,
  label = "Position on Screen" 
}: PositionSelectorProps) {
  return (
    <div>
      <Label htmlFor="position" className="mb-2 block">{label}</Label>
      <Select value={position} onValueChange={onPositionChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select position" />
        </SelectTrigger>
        <SelectContent>
          {positionOptions.map((pos) => (
            <SelectItem key={pos.value} value={pos.value}>
              {pos.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}