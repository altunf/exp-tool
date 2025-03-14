"use client";

import type React from "react";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar";
import { GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";

export function NodePalette({ items }: any) {
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  const getHoverClass = (hover: string) => {
    switch (hover) {
      case "blue": return "hover:bg-blue-100";
      case "green": return "hover:bg-green-100";
      case "amber": return "hover:bg-amber-100";
      case "purple": return "hover:bg-purple-100";
      case "orange": return "hover:bg-orange-100";
      default: return "hover:bg-gray-100";
    }
  };

  return (
    <SidebarMenu className="mt-4 space-y-1">
      {items.map((item: any) => (
        <SidebarMenuItem key={item.title}>
          <SidebarMenuButton
            draggable
            asChild
            isActive={item.isActive}
            onDragStart={(event) =>
              onDragStart(event, item.type)
            }
            className={cn("cursor-grab", getHoverClass(item.hover))}
          >
            <div className="flex items-center gap-2">
              <item.icon />
              <span>{item.title}</span>
              <GripVertical className="ml-auto" />
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
