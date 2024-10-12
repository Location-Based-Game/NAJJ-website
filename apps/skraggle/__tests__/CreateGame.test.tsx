import { assertSucceeds } from "@firebase/rules-unit-testing";
import MainMenuPanel from "@/app/_main-menu/MainMenuPanel";
import PlayerData from "@/components/GetPlayers";
import { renderWithProviders } from "@/lib/testUtils";
import MockUnityPlayer from "../mock/MockUnityPlayer";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Toaster } from "@/components/ui/toaster";
import createRoom from "@/server-actions/createRoom";
import { addPlayer } from "@/server-actions/addPlayer";
import getStartingDice from "@/server-actions/getStartingDice";

const testCode = "aaaa";
const testPlayer = "testPlayer";
let testPlayerKey = "";

describe("Create Game", () => {
  it("goes back to main menu when code is unavailable and shows error", async () => {
    renderWithProviders(
      <MockUnityPlayer>
        <PlayerData>
          <MainMenuPanel />
        </PlayerData>
        <Toaster />
      </MockUnityPlayer>,
      {
        preloadedState: {
          mainMenu: { state: "Create Game", slideFrom: "right" },
        },
      },
    );

    await waitFor(() => {
      const codeLabelElement = screen.getByText(/join code/i);
      expect(codeLabelElement).toBeInTheDocument();
    });

    await waitFor(() => {
      const joinGameElement = screen.getByText(/join game/i);
      expect(joinGameElement).toBeInTheDocument();

      const errorMessage = screen.getByText(/error/i);
      expect(errorMessage).toBeInTheDocument();
    });
  });

  it("creates a room on firebase and adds a test player", async () => {
    await assertSucceeds(createRoom({ gameId: testCode }));

    const testAddPlayer = async () => {
      testPlayerKey = await addPlayer({
        gameId: testCode,
        playerName: testPlayer,
      });
      return new Promise<unknown>((res: any) => res());
    };

    await assertSucceeds(testAddPlayer());
  });

  it("renders the create game screen", async () => {
    renderWithProviders(
      <MockUnityPlayer>
        <PlayerData>
          <MainMenuPanel />
        </PlayerData>
      </MockUnityPlayer>,
      {
        preloadedState: {
          mainMenu: { state: "Create Game", slideFrom: "right" },
          createCode: { code: testCode },
        },
      },
    );

    await waitFor(() => {
      const codeLabelElement = screen.getByText(/join code/i);
      expect(codeLabelElement).toBeInTheDocument();

      const codeElement = screen.getByText(testCode);
      expect(codeElement).toBeInTheDocument();

      const playerElement = screen.getByText(testPlayer);
      expect(playerElement).toBeInTheDocument();
    });
  });

  it("creates starting dice data when start is clicked", async () => {
    renderWithProviders(
      <MockUnityPlayer>
        <PlayerData>
          <MainMenuPanel />
        </PlayerData>
      </MockUnityPlayer>,
      {
        preloadedState: {
          mainMenu: { state: "Create Game", slideFrom: "right" },
          createCode: { code: testCode },
          guestName: { name: testPlayer, key: testPlayerKey },
        },
      },
    );

    const startButton = screen.getByText(/start/i);
    await waitFor(() => {
      expect(startButton).toBeInTheDocument();

      const playerElement = screen.getByText(testPlayer);
      expect(playerElement).toBeInTheDocument();
    });

    fireEvent.click(startButton);

    await waitFor(() => {
      expect(startButton).toBeInTheDocument();
    });

    await waitFor(() => {
      assertSucceeds(
        getStartingDice({ gameId: testCode, playerKey: testPlayerKey }),
      );
    });
  });
});
