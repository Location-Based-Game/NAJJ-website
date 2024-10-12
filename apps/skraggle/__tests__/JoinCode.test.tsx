import { renderWithProviders } from "@/lib/testUtils";
import "@testing-library/jest-dom";
import MainMenuPanel from "@/app/_main-menu/MainMenuPanel";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import createRoom from "@/server-actions/createRoom";
import { assertSucceeds } from "@firebase/rules-unit-testing";
import { rtdb } from "@/app/firebaseConfig";
import { ref, remove, child } from "firebase/database";

describe("Enter Join Code", () => {
  afterAll(async () => {
    const gameRef = ref(rtdb, "activeGames");
    await remove(child(gameRef, "bbbb"));
  })

  it('renders "Enter Join Code" and checks if the "continue" button is disabled', async () => {
    renderWithProviders(<MainMenuPanel />, {
      preloadedState: {
        mainMenu: { state: "Enter Join Code", slideFrom: "right" },
      },
    });

    const enterJoinCodeLabel = await screen.findByLabelText(/enter join code/i);
    expect(enterJoinCodeLabel).toBeInTheDocument();

    const continueButton = screen.getByRole("button", { name: /continue/i });
    expect(continueButton).toBeDisabled();
  });

  it("goes back to main menu when the back button is clicked", async () => {
    renderWithProviders(<MainMenuPanel />, {
      preloadedState: {
        mainMenu: { state: "Enter Join Code", slideFrom: "right" },
      },
    });

    const backButton = screen.getByRole("button", { name: /back/i });
    expect(backButton).toBeInTheDocument();

    fireEvent.click(backButton);

    await waitFor(() => {
      const createGameButton = screen.getByRole("button", {
        name: /join game/i,
      });
      expect(createGameButton).toBeInTheDocument;
    });
  });

  it('enables the "continue" button only if 4 characters are typed', async () => {
    renderWithProviders(<MainMenuPanel />, {
      preloadedState: {
        mainMenu: { state: "Enter Join Code", slideFrom: "right" },
      },
    });

    const codeInput = screen.getByLabelText(/enter join code/i);
    expect(codeInput).toBeInTheDocument();

    fireEvent.change(codeInput, { target: { value: "aaa" } });

    const continueButton = screen.getByRole("button", {
      name: /continue/i,
    });

    await waitFor(() => {
      expect(continueButton).toBeDisabled();
    });

    fireEvent.change(codeInput, { target: { value: "aaaa" } });

    await waitFor(() => {
      expect(continueButton).toBeEnabled();
    });
  });

  it('navigates to "sign in" if the code is valid and shows an error if it is invalid', async () => {
    renderWithProviders(<MainMenuPanel />, {
      preloadedState: {
        mainMenu: { state: "Enter Join Code", slideFrom: "right" },
      },
    });

    const codeInput = screen.getByLabelText(/enter join code/i);
    expect(codeInput).toBeInTheDocument();

    fireEvent.change(codeInput, { target: { value: "bbbb" } });

    const continueButton = screen.getByRole("button", {
      name: /continue/i,
    });
    
    await waitFor(() => {
      expect(continueButton).toBeEnabled();
    });

    fireEvent.click(continueButton)

    await waitFor(() => {
      expect(continueButton).toBeDisabled();
    });

    //first test that the code is invalid
    await waitFor(() => {
      const errorMessage = screen.getByText(/invalid code/i)
      expect(errorMessage).toBeInTheDocument()
      expect(continueButton).toBeEnabled();
    });

    //then create the room, so the code is valid
    await assertSucceeds(createRoom({ gameId: "bbbb" }));
    fireEvent.click(continueButton)

    const enterGuestNameLabel = await screen.findByLabelText(/enter as guest/i);
    expect(enterGuestNameLabel).toBeInTheDocument()

  })
});
