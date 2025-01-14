import styles from "@styles/loadingBackground.module.css";

export default () => {
  return (
    <div className="h-dvh w-full overflow-hidden">
      <div className={styles.loadingBackground}></div>
    </div>
  );
};
