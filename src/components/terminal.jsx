/* eslint-disable react/prop-types */
import { useState, useRef, useEffect } from "react";

const TerminalComponent = ({ sendCommand, terminalOutput, setTerminalOutput }) => {
  const [history, setHistory] = useState([]);
  const [currentInput, setCurrentInput] = useState("");
  const terminalContainerRef = useRef(null);
  const terminalInputRef = useRef(null);
  const [cwd, setCwd] = useState("/>");

  const handleCommand = () => {
    if (currentInput.trim() === "") return;
    if(currentInput == "clear"){
      setHistory([]);
      setCurrentInput("");
      return;
    }

    setHistory((prevHistory) => [...prevHistory, `${cwd} ${currentInput}`]);
    sendCommand(currentInput);
    setCwd("")
    setCurrentInput("");
  };

  useEffect(() => {
    if (terminalOutput && /^\/.*#$/.test(terminalOutput.trim())) {
      console.log("Setting cwd from terminalOutput:", terminalOutput);
      const updatedCwd = terminalOutput.trim().replace(/\s*#$/, ">")
      if(updatedCwd.includes(">")) setCwd(updatedCwd);
    } else if (terminalOutput) {
      console.log("Adding to history:", terminalOutput);
      setHistory((prevHistory) => [...prevHistory, terminalOutput]);
    }
    setTerminalOutput("");
  }, [terminalOutput, setTerminalOutput]);
  

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
        <span className="mr-2">{cwd}</span>
        <input
          ref={terminalInputRef}
          type="text"
          value={currentInput}
          onChange={(e) => setCurrentInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.ctrlKey && e.key === "c"){
              e.preventDefault();
              sendCommand("\x03");
            }
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
