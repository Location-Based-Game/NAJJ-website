"use client"
import { Provider } from "react-redux";
import { setupStore } from "@/state/store";

export default function ReduxProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Provider store={setupStore()}>{children}</Provider>;
}
