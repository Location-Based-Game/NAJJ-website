import { setJoinCode } from "@/state/JoinCodeSlice";
import { RootState } from "@/state/store";
import QRCodeStyling from "qr-code-styling-2";
import { memo, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { rtdb } from "../../firebaseConfig";
import { set, ref } from "firebase/database";

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
  const currentJoinCode = useSelector((state: RootState) => state.joinCode);
  const guestName = useSelector((state: RootState) => state.guestName);

  const dispatch = useDispatch();
  const divRef = useRef<HTMLDivElement>(null!);

  const code = currentJoinCode.code ?? makeid(4);

  const url = `${window.location.origin}?code=${code}`;
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

    (async () => {
      if (!!currentJoinCode.code) return;
      dispatch(setJoinCode("jr2p"))

      await set(ref(rtdb, "activeGames/" + "jr2p"), {
        name: code,
        players: ["blah", "Andy", "asdfasdkfjalsdkfjw", "Dr samuel hayden"]
      })

    })();

  }, []);

  return (
    <div>
      <div ref={divRef} className="rounded-lg overflow-hidden"></div>
      <div className="mt-4 text-gray-500">join code</div>
      <div className="text-4xl font-bold">{currentJoinCode.code}</div>
    </div>
  );
});

export default QRCode;
