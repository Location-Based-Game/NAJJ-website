"use client";

import { BookA, List, Users } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/sidebar/sidebar";
import { ChevronRightIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import { navItems } from "./SidebarNavMain";

const AnimatedDropdown = motion.create(SidebarMenuSub);

export function SidebarNavGameplay() {
  const players = useSelector((state: RootState) => state.players);

  return (
    <SidebarMenu>
      <SidebarCollapsible title="Main Menu" icon={<List />}>
        {navItems.slice(1).map((item, i) => (
          <SidebarMenuSubItem key={i}>
            <SidebarMenuSubButton asChild>
              <Link href={item.url}>
                {item.icon}
                <span>{item.title}</span>
              </Link>
            </SidebarMenuSubButton>
          </SidebarMenuSubItem>
        ))}
      </SidebarCollapsible>
      <SidebarCollapsible title="Players" icon={<Users />} defaultOpen>
        {Object.values(players).map((player, i) => (
          <SidebarMenuSubItem key={i}>{player.name}</SidebarMenuSubItem>
        ))}
      </SidebarCollapsible>
      <SidebarCollapsible title="Words" icon={<BookA />} defaultOpen>
        hi
      </SidebarCollapsible>
    </SidebarMenu>
  );
}

interface SidebarCollapsible {
  title: string;
  children: React.ReactNode;
  icon: React.ReactNode;
  defaultOpen?: boolean;
}

function SidebarCollapsible({
  title,
  children,
  icon,
  defaultOpen = false,
}: SidebarCollapsible) {
  const [open, setOpen] = useState(defaultOpen);
  const { setOpen: setSidebarOpen, open: isSidebarOpen } = useSidebar();

  return (
    <Collapsible
      asChild
      className="group/collapsible"
      open={open}
      defaultOpen={defaultOpen}
    >
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton
            tooltip={title}
            onClick={() => {
              setOpen(isSidebarOpen ? !open : true)
              setSidebarOpen(true);
            }}
            className="h-12 gap-4 pl-6 text-sm group-data-[collapsible=icon]:!pl-4 text-sidebar-foreground"
          >
            {icon}
            <span className="truncate">{title}</span>
            <ChevronRightIcon className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent forceMount>
          <AnimatePresence>
            {open && (
              <AnimatedDropdown
                className="overflow-hidden"
                initial={{ height: 0 }}
                animate={{ height: "auto" }}
                exit={{ height: 0 }}
                transition={{ duration: 0.2 }}
              >
                {children}
              </AnimatedDropdown>
            )}
          </AnimatePresence>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
}
