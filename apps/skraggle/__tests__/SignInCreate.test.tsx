import MainMenuPanel from "@/app/_main-menu/MainMenuPanel";
import { renderWithProviders } from "@/lib/testUtils";
import {
  act,
  fireEvent,
  queryByAttribute,
  screen,
  waitFor,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import {
  assertSucceeds,
  initializeTestEnvironment,
} from "@firebase/rules-unit-testing";
import { firebaseConfig } from "@/app/firebaseConfig";
import fs from "fs";
import { child, get, ref } from "firebase/database";
import PlayerData from "@/components/GetPlayers";
import MockUnityPlayer from "./mock/MockUnityPlayer";

describe("Sign In to Create", () => {
  it('renders "Sign In to Create" and checks if "continue" button is disabled', async () => {
    renderWithProviders(<MainMenuPanel />, {
      preloadedState: {
        mainMenu: { state: "Sign In to Create", slideFrom: "right" },
      },
    });

    const enterGuestNameLabel = await screen.findByLabelText(/enter as guest/i);
    expect(enterGuestNameLabel).toBeInTheDocument();

    const continueButton = screen.getByRole("button", { name: /continue/i });
    expect(continueButton).toBeDisabled();
  });

  it('enables the "continue" button if at least one character is typed', async () => {
    renderWithProviders(<MainMenuPanel />, {
      preloadedState: {
        mainMenu: { state: "Sign In to Create", slideFrom: "right" },
      },
    });

    const enterGuestNameInput = await screen.getByLabelText(/enter as guest/i);
    expect(enterGuestNameInput).toBeInTheDocument();

    fireEvent.change(enterGuestNameInput, { target: { value: "123" } });

    const continueButton = screen.getByRole("button", { name: /continue/i });
    expect(continueButton).toBeEnabled();
  });

  it("creates a room when a name is submitted", async () => {
    const testEnv = await initializeTestEnvironment({
      projectId: "demo-skraggle",
      database: {
        rules: fs.readFileSync("database.rules.json", "utf8"),
        host: "127.0.0.1",
        port: 9000,
      },
    });

    renderWithProviders(
      <MockUnityPlayer>
        <PlayerData>
          <MainMenuPanel />
        </PlayerData>
      </MockUnityPlayer>,
      {
        preloadedState: {
          mainMenu: { state: "Sign In to Create", slideFrom: "right" },
        },
      },
    );

    const enterGuestNameInput = await screen.getByLabelText(/enter as guest/i);
    fireEvent.change(enterGuestNameInput, { target: { value: "123" } });
    const continueButton = screen.getByRole("button", { name: /continue/i });
    fireEvent.click(continueButton);
    await waitFor(() => {
      expect(continueButton).toBeDisabled();
    });

    //does not render if write to firebase fails
    await waitFor(() => {
      const codeElement = screen.getByText(/join code/i);
      expect(codeElement).toBeInTheDocument();
    });

    await testEnv!.clearDatabase();
  });
});
