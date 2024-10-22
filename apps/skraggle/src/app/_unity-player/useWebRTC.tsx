import { child, DatabaseReference, onValue, push, ref, set, update, get } from "firebase/database";
import { useEffect, useRef, useState } from "react";
import { rtdb } from "../firebaseConfig";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import Peer from "simple-peer";

const configuration: RTCConfiguration = {
  iceServers: [
    {
      urls: ["stun:stun1.l.google.com:19302", "stun:stun2.l.google.com:19302"],
    },
  ],
  iceCandidatePoolSize: 10,
};

export default function useWebRTC() {
      const { gameId, playerId, playerName } = useSelector((state: RootState) => state.logIn);

    const hostPeer = useRef<Peer.Instance>()
    const signalSet = useRef(false)

    useEffect(() => {
        if (!gameId) return;

        const signalingRef = ref(rtdb, `activeGames/${gameId}/webrtc-signaling`);
        hostPeer.current = createPeer(signalingRef, playerName === "hsef")

        onValue(signalingRef, (snapshot) => {
          if (!snapshot.exists()) return;
          const data = snapshot.val();
          Object.keys(data).forEach((key) => {
            if (key === playerId) return;

            const peerData = data[key]
            console.log(peerData.signal)
            hostPeer.current?.signal(peerData.signal)
          })
        })
    }, [gameId])
    
    function createPeer(signalingRef:DatabaseReference, initiator:boolean) {
        const peer = new Peer({
          initiator,
            trickle: false,
        });

        peer.on("signal", signal => {
            if (signalSet.current) return;
            signalSet.current = true;
            set(child(signalingRef, playerId), {signal})
        })

        peer.on("connect", () => {
          peer.send(`connected to ${playerName}`)
        })

        peer.on("data", data => {
          if (data instanceof Uint8Array) {
            const decodedData = new TextDecoder().decode(data);
            console.log(decodedData);
          } else {
            console.log(data);
          }
        })

        return peer;
    }

//   const { gameId, playerId } = useSelector((state: RootState) => state.logIn);
//   const [localConnection, setLocalConnection] = useState<RTCPeerConnection>();
//   const [remoteConnection, setRemoteConnection] = useState<RTCPeerConnection>();
//   const dataChannelRef = useRef<RTCDataChannel>();
//   const localChannelRef = useRef<RTCDataChannel>();

//   useEffect(() => {
//     if (!gameId) return;
//     const signalingRef = ref(rtdb, `activeGames/${gameId}/webrtc-signaling`);
//     const peerConnection = new RTCPeerConnection(configuration);

//     const dataChannel = peerConnection.createDataChannel("test");
//     dataChannel.onopen = () => console.log("Data channel is open");
//     dataChannel.onmessage = (e) => console.log("Message from peer:", e.data);
//     localChannelRef.current = dataChannel;

//     peerConnection.onicecandidate = (event) => {
//       if (event.candidate) {
//         update(child(signalingRef, playerId), { candidate: event.candidate });
//       }
//     };

//     peerConnection.ondatachannel = (event) => {
//       const receiveChannel = event.channel;
//       receiveChannel.onmessage = (e) =>
//         console.log("Received Message:", e.data);
//       dataChannelRef.current = receiveChannel;
//     };

//     setLocalConnection(peerConnection);
//   }, [gameId]);

//   const offerSent = useRef(false);
//   useEffect(() => {
//     if (!splashScreenComplete || !localConnection) return;
//     if (!gameId || !playerId) return;
//     if (offerSent.current) return;
//     offerSent.current = true;
//     const signalingRef = ref(rtdb, `activeGames/${gameId}/webrtc-signaling`);

//     (async () => {
//       const offer = await localConnection.createOffer();
//       await localConnection.setLocalDescription(offer);
//       const offerObj:any = {}
//       offerObj[playerId] = {offer}
//       update(child(signalingRef, "offers"), offerObj);

//       // Listen for answer
//       onValue(signalingRef, (snapshot) => {
//         const data = snapshot.val();
//         if (!data) return;
//         if (data[playerId].answer) {
//           localConnection.setRemoteDescription(
//             new RTCSessionDescription(data[playerId].answer),
//           );
//         }
//       });
//     })();
//   }, [splashScreenComplete, localConnection, gameId, playerId]);

//   useEffect(() => {
//     if (!localConnection) return;
//     if (!gameId) return;
//     const signalingRef = ref(rtdb, `activeGames/${gameId}/webrtc-signaling`);

//     onValue(signalingRef, (snapshot) => {
//       const data = snapshot.val();
//       if (!data) return;
//       const keys = Object.keys(data);
//       if (data[keys[0]]?.offer) {
//         console.log("made it here")
//         const peerConnection = new RTCPeerConnection(configuration);
//         setRemoteConnection(peerConnection);
//         peerConnection.setRemoteDescription(
//           new RTCSessionDescription(data[keys[0]]?.offer),
//         );

//         // Create answer
//         peerConnection.createAnswer().then(async (answer) => {
//           await peerConnection.setLocalDescription(answer);
//           update(child(signalingRef, keys[0]), { answer });
//         });

//         peerConnection.onicecandidate = (event) => {
//           if (event.candidate) {
//             update(child(signalingRef, keys[0]), { candidate: event.candidate });
//           }
//         };
//       }

//       // Handle ICE candidates
//       if (data?.candidate) {
//         localConnection.addIceCandidate(new RTCIceCandidate(data.candidate));
//       }
//     });
//   }, [localConnection, gameId]);
}
