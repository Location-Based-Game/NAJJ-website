import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import type { MainMenuStates } from "@/hooks/usePanelUI";
import { memo, Fragment } from "react";
import {
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import NavCollapsedDropdown from "./NavCollapsedDropdown";
import NavPreviousBreadCrumb from "./NavPreviousBreadCrumb";

type MainMenuStateRelation = Record<MainMenuStates, MainMenuStates | null>;
const mainMenuStateRelations: MainMenuStateRelation = {
  Home: null,
  "Sign In to Create": "Home",
  "Sign In to Join": "Enter Join Code",
  "Create Game": "Sign In to Create",
  "Enter Join Code": "Home",
  "Join Game": "Sign In to Join",
  Rejoining: null,
} as const;

const NavHistory = memo(() => {
  const mainMenu = useSelector((state: RootState) => state.mainMenu);
  const previousItems: MainMenuStates[] = [];
  const isSmallScreen = useMediaQuery(1024);

  const createBreadCrumb = (previousState: MainMenuStates | null) => {
    if (!previousState) return;
    if (!previousItems.includes(previousState)) {
      previousItems.push(previousState);
    }
    createBreadCrumb(mainMenuStateRelations[previousState]);
  };
  createBreadCrumb(mainMenuStateRelations[mainMenu.state]);

  const handleCollapsedBreadcrumb = () => {
    if (mainMenu.state === "Home" || mainMenu.state === "Rejoining") return;
    return (
      <>
        <NavCollapsedDropdown previousItems={previousItems} />
        <BreadcrumbSeparator />
      </>
    );
  };

  const handleExpandedBreadcrumb = () => {
    return previousItems.reverse().map((menuItem, i) => {
      return (
        <Fragment key={i}>
          <NavPreviousBreadCrumb menuItem={menuItem} />
          <BreadcrumbSeparator />
        </Fragment>
      );
    });
  };

  return (
    <BreadcrumbList>
      {isSmallScreen ? handleCollapsedBreadcrumb() : handleExpandedBreadcrumb()}
      <BreadcrumbItem>
        <BreadcrumbPage className="px-2 py-2">{mainMenu.state}</BreadcrumbPage>
      </BreadcrumbItem>
    </BreadcrumbList>
  );
});

NavHistory.displayName = "NavHistory";

export default NavHistory;
