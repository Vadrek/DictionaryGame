import { DefaultEventsMap } from "@socket.io/component-emitter";
import { useEffect, useState } from "react";
import { Socket, io } from "socket.io-client";

let socket: Socket<DefaultEventsMap, DefaultEventsMap> | null = null;

export const getSocket = () => {
  if (!socket) {
    const server_url =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:9000";
    socket = io(server_url);
  }

  return socket;
};

// export const useSocket = () => {
//   const [webSocket, setWebSocket] = useState(
//     null as Socket<DefaultEventsMap, DefaultEventsMap> | null
//   );
//   console.log("in useSocket");

//   useEffect(() => {
//     // Create a socket connection
//     const socket = io();
//     setWebSocket(socket);

//     // socket.on("set-session-acknowledgement", function (data) {
//     //   sessionStorage.setItem("sessionId", data.sessionId);
//     // });

//     // let session_id;
//     // // Get saved data from sessionStorage
//     // let data = sessionStorage.getItem("sessionId");
//     // console.log(data);
//     // if (data == null) {
//     //   session_id = null; //when we connect first time
//     //   socket.emit("start-session", { sessionId: session_id });
//     // } else {
//     //   session_id = data; //when we connect n times
//     //   socket.emit("start-session", { sessionId: session_id });
//     // }

//     // Clean up the socket connection on unmount
//     return () => {
//       if (webSocket) webSocket.disconnect();
//     };
//   }, []);
//   console.log("webSocket", webSocket);
//   return webSocket;
// };
