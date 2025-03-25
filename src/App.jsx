import { useEffect, useRef, useState } from "react";

function App() {
  const socketRef = useRef(null);
  const [msg, setMsg] = useState("");
  const [allMessages, setAllMessages] = useState([]);
  const scrollToBottom = useRef(null);


  useEffect(() => {
    socketRef.current = new WebSocket("ws://localhost:3000");

    socketRef.current.onopen = () => {
      console.log("Подключено к серверу");
    };

    socketRef.current.onmessage = (e) => {
      let received = JSON.parse(e.data);

      if (received.type === "history") {
        setAllMessages(received.data);
      } else if (received.type === "message") {
        setAllMessages(prev => [...prev, { data: received.data }]);
      }
    };

    return () => {
      socketRef.current.close();
    };
  }, []);

  useEffect(() => {
    if (scrollToBottom.current) {
      scrollToBottom.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [allMessages]);

  const submitMessage = () => {
    if (msg.trim() !== "") {
      let outgoing = {
        type: "message",
        data: msg,
      };
      socketRef.current.send(JSON.stringify(outgoing));
      setMsg("");
    }
  };

  const checkKey = (event) => {
    if (event.key === "Enter") {
      submitMessage();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
  <div className="bg-white w-full max-w-md p-5 rounded-md shadow border">
    <h2 className="text-xl font-semibold mb-4">WebSocket Chat</h2>

    <div className="h-80 overflow-y-auto border rounded p-3 bg-gray-100 mb-4">
      {allMessages.map((item, i) => (
        <div
          key={i}
          className="bg-blue-500 text-white px-3 py-1 rounded mb-2 w-fit max-w-full break-words"
        >
          {item.data}
        </div>
      ))}
      <div ref={scrollToBottom}></div>
    </div>

    <div className="flex">
      <input
        className="flex-1 border px-3 py-2 rounded-l text-sm focus:outline-none"
        type="text"
        value={msg}
        onChange={(e) => setMsg(e.target.value)}
        onKeyDown={checkKey}
        placeholder="Введите сообщение"
      />
      <button
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-r text-sm"
        onClick={submitMessage}
      >
        Отправить
      </button>
    </div>
  </div>
</div>


  );
}

export default App;
