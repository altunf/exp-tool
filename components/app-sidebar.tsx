"use client"

import * as React from "react"
import {
  Command,
  FileText,
  ImageIcon,
  Layers,
  MessageSquare,
  Music,
  Route,
  Send,
  Squirrel,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { NodePalette } from "./panels/node-palette"
import { NavSecondary } from "./nav-secondary"

const data = {
  navMain: [
    {
      title: "Visual Stimulus",
      hover: "blue",
      icon: ImageIcon,
      type: "stimulus"
    },
    {
      title: "Response Collection",
      hover: "green",
      icon: MessageSquare,
      type: "response"
    },
    {
      title: "Instructions",
      hover: "purple",
      icon: FileText,
      type: "instruction"
    },
    {
      title: "Sound Stimulus",
      hover: "amber",
      icon: Music,
      type: "sound"
    },
    {
      title: "Sequence",
      hover: "gray",
      icon: Layers,
      type: "sequence"
    },
  ],
  navSecondary: [
/*     {
      title: "Support",
      url: "#",
      icon: LifeBuoy,
    }, */
    {
      title: "Feedback",
      url: "mailto:altunnfirat@gmail.com",
      icon: Send,
    },
  ]
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Route className="size-6" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Psy Exp</span>
                  <span className="truncate text-xs">Psychological Experiment Tool</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NodePalette items={data.navMain} />
     <NavSecondary items={data.navSecondary} className="mt-auto" /> 
      </SidebarContent>
      <SidebarFooter>
      </SidebarFooter>
    </Sidebar>
  )
}
