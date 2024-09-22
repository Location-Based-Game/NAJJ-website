import QRCodeStyling from "qr-code-styling-2";
import { memo, useEffect, useRef } from "react";

function makeid(length: number): string {
  let result = "";
  const characters = "abcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

const QRCode = memo(() => {
  const ref = useRef<HTMLDivElement>(null!);

  const code = makeid(4);
  const url = `${window.location.origin}?code=${code}`;
  const qrCode = new QRCodeStyling({
    width: 200,
    height: 200,
    type: "svg",
    data: url,
    dotsOptions: {
      type: "extra-rounded",
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
    qrCode.append(ref.current);
  }, []);

  return (
    <div>
      <div ref={ref} className="rounded-lg overflow-hidden"></div>
      <div className="mt-4 text-gray-500">join code</div>
      <div className="text-4xl font-bold">{code}</div>
    </div>
  );
});

export default QRCode;
