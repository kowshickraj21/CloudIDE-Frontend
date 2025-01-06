/* eslint-disable react/prop-types */
import { useEffect, useRef } from "react";
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import "xterm/css/xterm.css";

const TerminalComponent = ({
  sendCommand,
  terminalOutput,
  setTerminalOutput,
}) => {
  const terminalRef = useRef(null);
  const terminalInstance = useRef(null);
  const fitAddon = useRef(null);

  useEffect(() => {
    const term = new Terminal({
      cursorBlink: true,
      theme: {
        background: "#1d1f21",
        foreground: "#c5c8c6",
      },
      rows: 25,
    });

    const fit = new FitAddon();
    term.loadAddon(fit);

    terminalInstance.current = term;
    fitAddon.current = fit;

    if (terminalRef.current) {
      term.open(terminalRef.current);
      fit.fit();
    }

    term.write("> ");

    term.onData((data) => {
      if (data === "\r") {
        const command = term.buffer.active
          .getLine(term.buffer.active.cursorY)
          .translateToString()
          .split("> ")
          .pop()
          .trim();
        if (command.trim() === "clear") {
          term.reset()
          console.log("cleared")
          term.write("\r> ");
        } else {
          sendCommand(command);
          term.write("\r\n> ");
        }
      } else if (data === "\x7F") {
        if (term.buffer.active.cursorX > 2) {
          term.write("\b \b");
        }
      } else {
        term.write(data);
      }
    });

    return () => {
      term.dispose();
    };
  }, [sendCommand]);

  useEffect(() => {
    if (terminalOutput && terminalInstance.current) {
      terminalInstance.current.write(`${terminalOutput}\r\n`);
      setTerminalOutput("");
    }
  }, [terminalOutput, setTerminalOutput]);

  return (
    <div
      className="h-full w-full overflow-y-auto" 
      ref={terminalRef}
    ></div>
  );
};

export default TerminalComponent;
