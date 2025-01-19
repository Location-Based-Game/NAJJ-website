import styles from "@styles/loadingBackground.module.css";

export default function LoadingBackgroundFixture() {
  return (
    <div className="h-dvh w-full overflow-hidden">
      <div className={styles.loadingBackground}></div>
    </div>
  );
};
