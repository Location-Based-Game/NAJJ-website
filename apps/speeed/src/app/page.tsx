import Image from "next/image";
import Leaderboard from "./Leaderboard";
import Tutorial from "./Tutorial";
import Sidebar from "./Sidebar";
import TutorialCode from "./TutorialCode";
import styles from "./speeed.module.css"

export default function Home() {
  return (
    <>
      <div className={`${styles.splashBackground} w-screen h-screen fixed`}></div>
      <TutorialCode />
      <main className="flex w-full">
        <Sidebar />
        <div className="w-full">
          <section
            id="play"
            className="w-full h-screen flex flex-col xl:items-end xl:flex-row p-16 gap-10"
          >
            <div className="grow">
              <Image
                src={"/images/SPEEED Logo@4x.webp"}
                alt="SPEEED Logo"
                width={500}
                height={500}
              />
            </div>
            {/* <Image
              src={"/images/googleplay.png"}
              alt="SPEEED Logo"
              width={200}
              height={200}
            />
            <Image
              src={"/images/appstore.png"}
              alt="SPEEED Logo"
              width={200}
              height={200}
            /> */}
          </section>
          <Tutorial />
          <section
            id="leaderboard"
            className="w-full bg-black bg-opacity-30 h-screen backdrop-blur-lg"
          >
            <Leaderboard />
          </section>
        </div>
      </main>
    </>
  );
}