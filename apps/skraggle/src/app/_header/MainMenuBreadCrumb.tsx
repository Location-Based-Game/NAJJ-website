import { useSelector } from "react-redux";
import { MainMenuStates, RootState } from "@/store/store";
import { memo, Fragment } from "react";
import {
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import BreadCrumbDropdown from "./BreadCrumbDropdown";
import NavPreviousBreadCrumb from "./NavPreviousBreadCrumb";
import { BreadcrumbEllipsis } from "@/components/ui/breadcrumb";

type MainMenuStateRelation = Record<MainMenuStates, MainMenuStates | null>;
const mainMenuStateRelations: MainMenuStateRelation = {
  Home: null,
  "Set Game Settings": "Home",
  "Sign In to Create" : "Set Game Settings",
  "Sign In to Join": "Enter Join Code",
  "Create Game": "Sign In to Create",
  "Enter Join Code": "Home",
  "Join Game": "Sign In to Join",
  Rejoining: null,
  "Rejoin Failed": null,
} as const;

const MainMenuBreadCrumb = memo(() => {
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
    if (
      mainMenu.state === "Home" ||
      mainMenu.state === "Rejoining" ||
      mainMenu.state === "Rejoin Failed"
    ) {
      return;
    }
    
    return (
      <>
        <BreadCrumbDropdown menuItems={previousItems.reverse()}>
          <BreadcrumbEllipsis className="h-4 w-4" />
        </BreadCrumbDropdown>
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

MainMenuBreadCrumb.displayName = "MainMenuBreadCrumb";

export default MainMenuBreadCrumb;
