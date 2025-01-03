"use client";

import { BookMarked, CircleHelp, Gamepad2, Info, Play } from "lucide-react";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/sidebar/sidebar";
import Link from "next/link";
import { cn } from "@/lib/tailwindUtils";
import styles from "./sidebar.module.css";

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

export function SidebarNavMain() {
  return (
    <SidebarMenu className={cn(styles.sidebarItemsBackground, "py-2")}>
      {navItems.map((item, i) => {
        return (
          <SidebarMenuItem key={i}>
            <SidebarMenuButton
              asChild
              tooltip={item.title}
              className="h-12 gap-4 pl-6 text-sm group-data-[collapsible=icon]:!pl-4 text-sidebar-foreground"
            >
              <Link href={item.url} className="min-w-full drop-shadow-dark">
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
