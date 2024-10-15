import MainMenuPanel from "@/app/_main-menu/MainMenuPanel";
import { renderWithProviders } from "@/lib/reduxTestUtils";
import {
  fireEvent,
  queryByAttribute,
  screen,
  waitFor,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import PlayerData from "@/components/GetPlayers";
import MockUnityPlayer from "../mock/MockUnityPlayer";

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

  it('goes back to the main menu when "back" is clicked', async () => {
    renderWithProviders(<MainMenuPanel />, {
      preloadedState: {
        mainMenu: { state: "Sign In to Create", slideFrom: "right" },
      },
    });

    const backButton = screen.getByRole("button", { name: /back/i });
    expect(backButton).toBeInTheDocument();

    fireEvent.click(backButton);

    await waitFor(() => {
      const createGameButton = screen.getByRole("button", {
        name: /create game/i,
      });
      expect(createGameButton).toBeInTheDocument;
    });
  });

  it("creates a room when a name is submitted", async () => {
    jest.spyOn(localStorage, "setItem");
    localStorage.setItem = jest.fn();

    const dom = renderWithProviders(
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
    expect(enterGuestNameInput).toBeInTheDocument();

    const playerName = "123"

    fireEvent.change(enterGuestNameInput, { target: { value: playerName } });
    const continueButton = screen.getByRole("button", { name: /continue/i });
    expect(continueButton).toBeEnabled();

    fireEvent.click(continueButton);

    await waitFor(() => {
      expect(continueButton).toBeDisabled();
    });

    await waitFor(() => {
      const codeLabelElement = screen.getByText(/join code/i);
      expect(codeLabelElement).toBeInTheDocument();

      const getById = queryByAttribute.bind(null, "id");
      const codeElement = getById(dom.container, "join-code");
      expect(codeElement).toBeInTheDocument();

      const codeText = codeElement!.textContent;
      expect(codeText).toMatch(/^[a-z0-9]{4}$/);

      const playerText = screen.getByText(playerName);
      expect(playerText).toBeInTheDocument();
    });
  });
});
