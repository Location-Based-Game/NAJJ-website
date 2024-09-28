import { RootState } from "@/state/store";
import QRCodeStyling from "qr-code-styling-2";
import { memo, useEffect, useRef } from "react";
import { useSelector } from "react-redux";

const QRCode = memo(() => {
  const currentJoinCode = useSelector((state: RootState) => state.createCode);
  const divRef = useRef<HTMLDivElement>(null!);

  const url = `${window.location.origin}?code=${currentJoinCode}`;
  const qrCode = new QRCodeStyling({
    width: 200,
    height: 200,
    type: "svg",
    data: url,
    dotsOptions: {
      type: "rounded",
    },
    imageOptions: {
      crossOrigin: "anonymous",
      hideBackgroundDots: false,
    },
    qrOptions: {
      errorCorrectionLevel: "M",
    },
  });

  useEffect(() => {
    qrCode.append(divRef.current);
  }, []);

  return (
    <div>
      <div ref={divRef} className="rounded-lg overflow-hidden border-separate border-2"></div>
      <div className="mt-4 text-gray-500">join code</div>
      <div className="text-4xl font-bold">{currentJoinCode.code}</div>
    </div>
  );
});

export default QRCode;
