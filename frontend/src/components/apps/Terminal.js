import { useState, useRef, useEffect } from "react";

const COMMANDS = {
  help: "Available commands: help, whoami, date, clear, echo, ls, uname, uptime, neofetch, pwd, cat",
  whoami: "aura@auraos",
  uname: "AuraOS 1.0.0 Obsidian Glass x86_64",
  pwd: "/home/aura",
  uptime: () => `up ${Math.floor(Math.random() * 24)} hours, ${Math.floor(Math.random() * 60)} minutes`,
  date: () => new Date().toString(),
  ls: "Documents  Pictures  Music  Videos  Downloads  .config  .local",
  neofetch: `
       ___
      /   \\      aura@auraos
     / A O \\     OS: AuraOS 1.0.0
    / U R S \\    Shell: Obsidian Glass
   /  ___    \\   Theme: Cosmic Dark
  /  /   \\    \\  WM: Aura Compositor
 /  /     \\    \\ Terminal: AuraTerm
/  /       \\    \\Resolution: 1920x1080
\\_/         \\_/  CPU: Aura Core (8) @ 3.6GHz
                  Memory: 2048MB / 16384MB`,
};

export default function TerminalApp() {
  const [lines, setLines] = useState([
    { type: "output", text: "AuraOS Terminal v1.0.0 — Type 'help' for commands" },
    { type: "output", text: "" },
  ]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [lines]);

  const executeCommand = (cmd) => {
    const trimmed = cmd.trim();
    if (!trimmed) return;

    const newLines = [...lines, { type: "command", text: `aura@auraos:~$ ${trimmed}` }];
    setHistory(prev => [...prev, trimmed]);
    setHistoryIdx(-1);

    const parts = trimmed.split(" ");
    const command = parts[0].toLowerCase();
    const args = parts.slice(1).join(" ");

    if (command === "clear") {
      setLines([]);
      return;
    }

    if (command === "echo") {
      newLines.push({ type: "output", text: args });
    } else if (command === "cat") {
      newLines.push({ type: "output", text: `cat: ${args || 'missing operand'}: simulated filesystem` });
    } else if (COMMANDS[command]) {
      const result = typeof COMMANDS[command] === "function" ? COMMANDS[command]() : COMMANDS[command];
      result.split("\n").forEach(line => newLines.push({ type: "output", text: line }));
    } else {
      newLines.push({ type: "error", text: `bash: ${command}: command not found` });
    }

    setLines(newLines);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      executeCommand(input);
      setInput("");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (history.length > 0) {
        const idx = historyIdx === -1 ? history.length - 1 : Math.max(0, historyIdx - 1);
        setHistoryIdx(idx);
        setInput(history[idx]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIdx >= 0) {
        const idx = historyIdx + 1;
        if (idx >= history.length) { setHistoryIdx(-1); setInput(""); }
        else { setHistoryIdx(idx); setInput(history[idx]); }
      }
    }
  };

  return (
    <div
      className="terminal-app"
      onClick={() => inputRef.current?.focus()}
      data-testid="terminal-app"
    >
      <div className="terminal-output" ref={scrollRef} data-testid="terminal-output">
        {lines.map((line, i) => (
          <div key={i} className={`terminal-line ${line.type}`}>{line.text}</div>
        ))}
      </div>
      <div className="terminal-input-row">
        <span className="terminal-prompt">aura@auraos:~$</span>
        <input
          ref={inputRef}
          className="terminal-input"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus
          spellCheck={false}
          data-testid="terminal-input"
        />
      </div>
    </div>
  );
}
