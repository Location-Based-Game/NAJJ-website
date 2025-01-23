import { mainMenuState } from "@/store/store";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useHandleRejoin } from "./useHandleRejoin";

export default function useSessionRejoin() {
  const dispatch = useDispatch();
  const { handleRejoin } = useHandleRejoin();

  useEffect(() => {
    const sessionCookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("session_data="))
      ?.split("=")[1];

    if (!sessionCookie) return;

    dispatch(
      mainMenuState.updateState({
        state: "Rejoining",
        slideFrom: "right",
      }),
    );

    handleRejoin().then((success) => {
      if (success) return;
      dispatch(
        mainMenuState.updateState({
          state: "Rejoin Failed",
          slideFrom: "right",
        }),
      );
    });
  }, []);
}