import MainMenuPanel from "@/app/_main-menu/MainMenuPanel";
import { renderWithProviders } from "@/lib/reduxTestUtils";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";

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
});
