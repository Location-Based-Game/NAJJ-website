import { memo, useEffect } from "react";

const SidebarAd = memo(() => {
  useEffect(() => {
    ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({})
  }, [])
  return (
    <>
      <script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2331429269153570"
        crossOrigin="anonymous"
      ></script>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-2331429269153570"
        data-ad-slot="2488626648"
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>
    </>
  );
});

SidebarAd.displayName = "SidebarAd";
export default SidebarAd;
