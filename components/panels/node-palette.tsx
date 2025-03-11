"use client";

import type React from "react";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar";
import { GripVertical } from "lucide-react";
export function NodePalette({ items }: any) {
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
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
            className={`cursor-grab hover:bg-${item.hover}-50`}
          >
            <div className="flex items-center gap-2">
              <item.icon />
              <span>{item.title}</span>
              
              <GripVertical className="ml-auto"/>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
