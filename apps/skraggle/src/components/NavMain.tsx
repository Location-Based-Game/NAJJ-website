"use client";

import { BookMarked, CircleHelp, Gamepad2, Info, Play } from "lucide-react";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";

export const navItems = [
  {
    title: "Play Skraggle!",
    url: "/",
    icon: <Play />,
  },
  {
    title: "Blog",
    url: "/blog",
    icon: <BookMarked />,
  },
  {
    title: "About",
    url: "/about",
    icon: <Info />,
  },
  {
    title: "How to Play",
    url: "/how-to-play",
    icon: <CircleHelp />,
  },
  {
    title: "More Games",
    url: "#",
    icon: <Gamepad2 />,
  },
];

export function NavMain() {
  return (
    <SidebarMenu>
      {navItems.map((item, i) => {
        return (
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              tooltip={item.title}
              key={i}
              className="h-12 gap-4 pl-4 text-sm group-data-[collapsible=icon]:!pl-2"
            >
              <Link href={item.url}>
                {item.icon}
                <span>{item.title}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
}
