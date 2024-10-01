"use client";
import { RootState } from "@/state/store";
import { memo, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { QRCode as CreateQRCode } from "react-qrcode-logo";

const QRCode = memo(() => {
  const currentJoinCode = useSelector((state: RootState) => state.createCode);
  const [url, setURL] = useState<string>("")

  useEffect(() => {
    setURL(window.location.origin)
  }, [])

  return (
    <div>
      <div className="border-separate overflow-hidden rounded-lg border-2">
        <CreateQRCode
          ecLevel="M"
          qrStyle="fluid"
          fgColor="#1f1f1f"
          value={`${url}?code=${currentJoinCode.code}`}
        />
      </div>
      <div className="mt-4 text-gray-500">join code</div>
      <div className="text-4xl font-bold">{currentJoinCode.code}</div>
    </div>
  );
});

export default QRCode;
