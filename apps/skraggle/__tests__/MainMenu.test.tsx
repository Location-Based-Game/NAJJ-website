import MainMenuPanel from "@/app/_main-menu/MainMenuPanel";
import { renderWithProviders } from "@/lib/testUtils";
import { fireEvent, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

describe("Main Menu", () => {
  it('renders "join game" button and navigates to join code', async () => {
    renderWithProviders(<MainMenuPanel />, {
      preloadedState: {
        mainMenu: { state: "Home", slideFrom: "right" },
      },
    });

    const buttonElement = screen.getByRole("button", { name: /join game/i });

    expect(buttonElement).toBeInTheDocument();

    fireEvent.click(buttonElement);

    const enterJoinCodeLabel = await screen.findByLabelText(/enter join code/i);
    expect(enterJoinCodeLabel).toBeInTheDocument();
  });

  it('renders "create game" button and navigates to sign in', async () => {
    renderWithProviders(<MainMenuPanel />, {
      preloadedState: {
        mainMenu: { state: "Home", slideFrom: "right" },
      },
    });

    const buttonElement = screen.getByRole("button", { name: /create game/i });

    expect(buttonElement).toBeInTheDocument();

    fireEvent.click(buttonElement);

    const enterGuestNameLabel = await screen.findByLabelText(/enter as guest/i);
    expect(enterGuestNameLabel).toBeInTheDocument();
  });
});
