import { assertSucceeds } from "@firebase/rules-unit-testing";
import MainMenuPanel from "@/app/_main-menu/MainMenuPanel";
import PlayerData from "@/components/GetPlayers";
import { renderWithProviders } from "@/lib/reduxTestUtils";
import MockUnityPlayer from "../mock/MockUnityPlayer";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Toaster } from "@/components/ui/toaster";
import createRoom from "@/server-actions/createRoom";
import { addPlayer } from "@/server-actions/addPlayer";
import Loader from "@/app/_gameplay-ui/Loader";
import deleteRoom from "@/server-actions/deleteRoom";

const testCode = "aaaa";
const testPlayer = "testPlayer";
let testPlayerId = "";

describe("Create Game", () => {
  afterAll(async () => {
    await deleteRoom({gameId: testCode});
  });

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
      testPlayerId = await addPlayer({
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
          logIn: {
            loading: false,
            gameId: testCode,
            playerId: testPlayerId,
            playerName: testPlayer,
          },
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

  it("creates starting dice data and shows loader when start is clicked", async () => {
    renderWithProviders(
      <MockUnityPlayer>
        <Loader splashScreenComplete={false}>
          <PlayerData>
            <MainMenuPanel />
          </PlayerData>
        </Loader>
      </MockUnityPlayer>,
      {
        preloadedState: {
          mainMenu: { state: "Create Game", slideFrom: "right" },
          logIn: {
            loading: false,
            gameId: testCode,
            playerId: testPlayerId,
            playerName: testPlayer,
          },
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
      const loadingElement = screen.getByText(/loading/i);
      expect(loadingElement).toBeInTheDocument();
    });
  });
});
