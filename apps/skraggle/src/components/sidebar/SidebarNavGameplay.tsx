"use client";

import { BookA, List } from "lucide-react";
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
import { navItems } from "./SidebarNavMain";
import styles from "./sidebar.module.css";
import { cn } from "@/lib/tailwindUtils";

const AnimatedDropdown = motion.create(SidebarMenuSub);

export function SidebarNavGameplay() {
  return (
    <SidebarMenu className={cn(styles.sidebarItemsBackground, "py-2 overflow-hidden")}>
      <SidebarCollapsible title="Main Menu" icon={<List />}>
        {navItems.slice(1).map((item, i) => (
          <SidebarMenuSubItem key={i} className="p-0 m-0">
            <SidebarMenuSubButton className="before:hover:bg-black/15 before:hover:transition-colors before:active:bg-black/30 before:absolute before:w-full before:h-full before:left-0" asChild>
              <Link href={item.url} className="pl-[3rem]">
                {item.icon}
                <span>{item.title}</span>
              </Link>
            </SidebarMenuSubButton>
          </SidebarMenuSubItem>
        ))}
      </SidebarCollapsible>
      <SidebarCollapsible title="Words" icon={<BookA />} defaultOpen>
        
      </SidebarCollapsible>
    </SidebarMenu>
  );
}

interface SidebarCollapsible {
  title: string;
  children?: React.ReactNode;
  icon: React.ReactNode;
  defaultOpen?: boolean;
}

function SidebarCollapsible({
  title,
  children = <></>,
  icon,
  defaultOpen = false,
}: SidebarCollapsible) {
  const [open, setOpen] = useState(defaultOpen);
  const { setOpen: setSidebarOpen, open: isSidebarOpen } = useSidebar();

  return (
    <Collapsible
      asChild
      className="group/collapsible m-0 p-0"
      open={open}
      defaultOpen={defaultOpen}
    >
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton
            tooltip={title}
            onClick={() => {
              setOpen(isSidebarOpen ? !open : true);
              setSidebarOpen(true);
            }}
            className="h-12 gap-4 pl-6 text-sm text-sidebar-foreground group-data-[collapsible=icon]:!pl-4"
          >
            {icon}
            <span className="truncate">{title}</span>
            <ChevronRightIcon className="ml-auto mr-[2rem] transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent className="bg-black/20" forceMount>
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
