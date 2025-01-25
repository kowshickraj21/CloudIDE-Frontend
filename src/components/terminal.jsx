/* eslint-disable react/prop-types */
import { useState, useRef, useEffect } from "react";

const TerminalComponent = ({ sendCommand, terminalOutput, setTerminalOutput }) => {
  const [history, setHistory] = useState([]);
  const [currentInput, setCurrentInput] = useState("");
  const terminalContainerRef = useRef(null);
  const terminalInputRef = useRef(null);

  const handleCommand = () => {
    if (currentInput.trim() === "") return;

    setHistory((prevHistory) => [...prevHistory, `> ${currentInput}`]);

    sendCommand(currentInput);
    setCurrentInput("");
  };

  useEffect(() => {
      console.log(terminalOutput)
      setHistory((prevHistory) => [...prevHistory, terminalOutput]);
      setTerminalOutput("")
  }, [setTerminalOutput, terminalOutput]);

  useEffect(() => {
    if (terminalContainerRef.current) {
      terminalContainerRef.current.scrollTop =
        terminalContainerRef.current.scrollHeight;
    }
  }, [history]);

  const focus = () => {
    terminalInputRef.current.focus()
  }

  return (
    <div
      className="w-full bg-black text-white font-mono p-4 h-full overflow-y-auto"
      ref={terminalContainerRef}
      onClick={ () => focus()}
    >
      <div>
        {history.map((line, index) => (
          <div key={index}>{line}</div>
        ))}
      </div>

      <div className="flex">
        <span>&gt;&nbsp;</span>
        <input
          ref={terminalInputRef}
          type="text"
          value={currentInput}
          onChange={(e) => setCurrentInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleCommand();
            }
          }}
          className="bg-black text-white resize-none w-full border-none outline-none flex-grow cursor-default"
        />
      </div>
    </div>
  );
};

export default TerminalComponent;
