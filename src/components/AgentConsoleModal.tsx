import React, { useState, useRef, useEffect } from 'react';
import { X, Terminal, CornerDownLeft, ExternalLink, Play, Copy, Check, Sparkles, Sun, Moon, HelpCircle } from 'lucide-react';
import { PERSONAL_INFO, TRANSMISSIONS, CAREER_ARC, TECH_GROUPS } from '../data/portfolioData';
import { useTheme } from '../context/ThemeContext';
import { soundFx } from '../utils/audioHaptics';

interface AgentConsoleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CommandLog {
  id: string;
  command: string;
  output: React.ReactNode;
  timestamp: string;
}

const AVAILABLE_COMMANDS = [
  'help',
  'run claw-agent',
  'ask <question>',
  'projects',
  'skills',
  'arc',
  'toon',
  'stack',
  'contact',
  'theme',
  'whoami',
  'matrix',
  'quote',
  'clear'
];

export const AgentConsoleModal: React.FC<AgentConsoleModalProps> = ({ isOpen, onClose }) => {
  const [inputValue, setInputValue] = useState('');
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const { theme, toggleTheme, setTheme } = useTheme();

  const [logs, setLogs] = useState<CommandLog[]>([
    {
      id: 'init-1',
      command: 'init portfolio-cli --profile sahil-harsh',
      output: (
        <div className="space-y-2 dark:text-[#DCDEDD] text-[#1c1817]">
          <div className="p-2.5 rounded dark:bg-[#181110] bg-[#f7f5f2] border dark:border-white/[0.06] border-[#DCDEDD] flex flex-wrap items-center gap-2 text-[11px] font-mono-tech">
            <span className="dark:text-[#c68477] text-[#74483F] font-bold">Try typing:</span>
            <span className="px-1.5 py-0.5 rounded bg-[#74483F]/15 dark:text-[#c68477] text-[#74483F] font-semibold cursor-pointer" onClick={() => handleCommand('run claw-agent')}>run claw-agent</span>
            <span className="dark:text-[#DCDEDD]/40 text-[#4B4643]/50">|</span>
            <span className="px-1.5 py-0.5 rounded bg-[#74483F]/15 dark:text-[#c68477] text-[#74483F] font-semibold cursor-pointer" onClick={() => handleCommand('arc')}>arc</span>
            <span className="dark:text-[#DCDEDD]/40 text-[#4B4643]/50">|</span>
            <span className="px-1.5 py-0.5 rounded bg-[#74483F]/15 dark:text-[#c68477] text-[#74483F] font-semibold cursor-pointer" onClick={() => handleCommand('help')}>help</span>
          </div>
        </div>
      ),
      timestamp: '00:00:01'
    }
  ]);

  const terminalEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
        terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 50);
    }
  }, [logs, isOpen]);

  if (!isOpen) return null;

  const copyEmail = () => {
    navigator.clipboard.writeText(PERSONAL_INFO.email);
    setCopiedEmail(true);
    soundFx.playChirp();
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleCommand = (cmd: string) => {
    const enteredCommand = cmd.trim();
    if (!enteredCommand) return;

    soundFx.playClick();
    const normalizedCommand = enteredCommand.toLowerCase();
    const timestamp = new Date().toLocaleTimeString();

    setCommandHistory((prev) => [...prev, enteredCommand]);
    setHistoryIndex(-1);

    let outputContent: React.ReactNode = null;

    if (normalizedCommand === 'clear' || normalizedCommand === 'cls') {
      setLogs([]);
      setInputValue('');
      return;
    }

    if (normalizedCommand === 'help') {
      outputContent = (
        <div className="space-y-2.5 dark:text-[#DCDEDD] text-[#1c1817]">
          <p className="dark:text-[#c68477] text-[#74483F] font-bold text-xs">AVAILABLE TERMINAL COMMANDS:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono-tech">
            <div className="p-2 rounded bg-black/20 dark:border-white/[0.04] border-[#DCDEDD] border">
              <span className="dark:text-[#c68477] text-[#74483F] font-bold block cursor-pointer hover:underline" onClick={() => handleCommand('run claw-agent')}>
                run claw-agent
              </span>
              <span className="dark:text-[#DCDEDD]/70 text-[#4B4643] text-[11px]">Simulate live multi-agent pipeline with LangGraph &amp; SSE</span>
            </div>
            <div className="p-2 rounded bg-black/20 dark:border-white/[0.04] border-[#DCDEDD] border">
              <span className="dark:text-[#c68477] text-[#74483F] font-bold block cursor-pointer hover:underline" onClick={() => handleCommand('ask who is sahil')}>
                ask &lt;question&gt;
              </span>
              <span className="dark:text-[#DCDEDD]/70 text-[#4B4643] text-[11px]">Ask anything about Sahil&apos;s background, skills or work</span>
            </div>
            <div className="p-2 rounded bg-black/20 dark:border-white/[0.04] border-[#DCDEDD] border">
              <span className="dark:text-[#c68477] text-[#74483F] font-bold block cursor-pointer hover:underline" onClick={() => handleCommand('projects')}>
                projects
              </span>
              <span className="dark:text-[#DCDEDD]/70 text-[#4B4643] text-[11px]">List featured AI &amp; deep learning projects</span>
            </div>
            <div className="p-2 rounded bg-black/20 dark:border-white/[0.04] border-[#DCDEDD] border">
              <span className="dark:text-[#c68477] text-[#74483F] font-bold block cursor-pointer hover:underline" onClick={() => handleCommand('skills')}>
                skills
              </span>
              <span className="dark:text-[#DCDEDD]/70 text-[#4B4643] text-[11px]">Inspect tech stack &amp; framework competencies</span>
            </div>
            <div className="p-2 rounded bg-black/20 dark:border-white/[0.04] border-[#DCDEDD] border">
              <span className="dark:text-[#c68477] text-[#74483F] font-bold block cursor-pointer hover:underline" onClick={() => handleCommand('arc')}>
                arc
              </span>
              <span className="dark:text-[#DCDEDD]/70 text-[#4B4643] text-[11px]">View career progression (Motion -&gt; Web -&gt; AI)</span>
            </div>
            <div className="p-2 rounded bg-black/20 dark:border-white/[0.04] border-[#DCDEDD] border">
              <span className="dark:text-[#c68477] text-[#74483F] font-bold block cursor-pointer hover:underline" onClick={() => handleCommand('toon')}>
                toon
              </span>
              <span className="dark:text-[#DCDEDD]/70 text-[#4B4643] text-[11px]">Task-Oriented Output Normalization spec</span>
            </div>
            <div className="p-2 rounded bg-black/20 dark:border-white/[0.04] border-[#DCDEDD] border">
              <span className="dark:text-[#c68477] text-[#74483F] font-bold block cursor-pointer hover:underline" onClick={() => handleCommand('theme')}>
                theme [dark|light]
              </span>
              <span className="dark:text-[#DCDEDD]/70 text-[#4B4643] text-[11px]">Toggle website visual theme</span>
            </div>
            <div className="p-2 rounded bg-black/20 dark:border-white/[0.04] border-[#DCDEDD] border">
              <span className="dark:text-[#c68477] text-[#74483F] font-bold block cursor-pointer hover:underline" onClick={() => handleCommand('matrix')}>
                matrix / hack
              </span>
              <span className="dark:text-[#DCDEDD]/70 text-[#4B4643] text-[11px]">Run cyberpunk visual terminal stream</span>
            </div>
            <div className="p-2 rounded bg-black/20 dark:border-white/[0.04] border-[#DCDEDD] border">
              <span className="dark:text-[#c68477] text-[#74483F] font-bold block cursor-pointer hover:underline" onClick={() => handleCommand('contact')}>
                contact
              </span>
              <span className="dark:text-[#DCDEDD]/70 text-[#4B4643] text-[11px]">Direct recruiter email &amp; GitHub links</span>
            </div>
            <div className="p-2 rounded bg-black/20 dark:border-white/[0.04] border-[#DCDEDD] border">
              <span className="dark:text-[#c68477] text-[#74483F] font-bold block cursor-pointer hover:underline" onClick={() => handleCommand('clear')}>
                clear
              </span>
              <span className="dark:text-[#DCDEDD]/70 text-[#4B4643] text-[11px]">Clear the terminal window</span>
            </div>
          </div>
        </div>
      );
    } else if (normalizedCommand.startsWith('run claw') || normalizedCommand === 'run' || normalizedCommand.startsWith('simulate') || normalizedCommand.startsWith('run eval')) {
      outputContent = (
        <div className="space-y-2 dark:text-[#DCDEDD] text-[#1c1817]">
          <div className="flex items-center justify-between pb-1 border-b dark:border-white/[0.08] border-[#DCDEDD]">
            <span className="dark:text-[#c68477] text-[#74483F] font-bold text-xs flex items-center gap-1.5">
              <Play className="w-3 h-3 fill-current" />
              EXECUTING CLAW_AGENT MULTI-AGENT GRAPH (SSE SIMULATION)...
            </span>
            <span className="text-[10px] font-mono-tech px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-semibold">
              RUNNING
            </span>
          </div>
          <div className="space-y-1 text-xs font-mono-tech">
            <p className="dark:text-white text-[#1c1817]">
              <span className="text-emerald-500 font-bold">&#10003; [1/5]</span> <span className="dark:text-[#c68477] text-[#74483F]">Supervisor Node</span> initialized. Topic: &quot;Transformer Attention Topology&quot;
            </p>
            <p className="dark:text-white text-[#1c1817]">
              <span className="text-emerald-500 font-bold">&#10003; [2/5]</span> <span className="dark:text-[#c68477] text-[#74483F]">Tavily API</span> research completed (14 citations retrieved). Outline compiled.
            </p>
            <p className="dark:text-white text-[#1c1817]">
              <span className="text-emerald-500 font-bold">&#10003; [3/5]</span> <span className="dark:text-[#c68477] text-[#74483F]">Parallel Writers (Fan-Out)</span>: 4 sections drafted simultaneously via TOON JSON.
            </p>
            <p className="dark:text-white text-[#1c1817]">
              <span className="text-emerald-500 font-bold">&#10003; [4/5]</span> <span className="dark:text-[#c68477] text-[#74483F]">Reviewer Retry Loop</span>: Evaluated quality score <span className="text-emerald-400 font-bold">8.7/10</span>. Rewrote Section 3 once.
            </p>
            <p className="dark:text-white text-[#1c1817]">
              <span className="text-emerald-500 font-bold">&#10003; [5/5]</span> <span className="dark:text-[#c68477] text-[#74483F]">Gemini Diagram &amp; Compilation</span>: Rendered Markdown + PDF output.
            </p>
          </div>
          <div className="p-2.5 rounded dark:bg-[#181110] bg-[#f7f5f2] border dark:border-[#74483F]/30 border-[#74483F]/20 text-[11px] font-mono-tech flex items-center justify-between">
            <span className="dark:text-[#c68477] text-[#74483F] font-bold">Pipeline Finished: 0 Errors | ~40% Tokens Saved | SSE Stream Closed</span>
            <span className="text-emerald-500 font-bold">SUCCESS 200 OK</span>
          </div>
        </div>
      );
    } else if (normalizedCommand.startsWith('ask ') || normalizedCommand.startsWith('ai ') || normalizedCommand.startsWith('query ')) {
      const question = enteredCommand.replace(/^(ask|ai|query)\s+/i, '').toLowerCase();

      let answer = '';
      if (question.includes('who') || question.includes('sahil') || question.includes('about')) {
        answer = 'Sahil Harsh is an AI/ML Engineer working with multimodal AI through model fine-tuning, RAG, agents, inference, and evaluation, combining ML research with practical deployment and MLOps.';
      } else if (question.includes('experience') || question.includes('background') || question.includes('career')) {
        answer = 'Sahil started with 6,000+ hours in motion graphic design and video editing, transitioned to frontend engineering (TypeScript, React), and now specializes in deep learning, multimodal AI, agent workflows, and MLOps.';
      } else if (question.includes('toon')) {
        answer = 'TOON (Task-Oriented Output Normalization) is a structured prompt technique that enforces strict JSON schemas rather than verbose natural language, cutting token usage by ~40% and eliminating filler conversation.';
      } else if (question.includes('hire') || question.includes('role') || question.includes('available') || question.includes('job')) {
        answer = 'Sahil is actively available for AI/ML Engineering roles, contracts, and full-time positions worldwide (Remote).';
      } else if (question.includes('stack') || question.includes('skills') || question.includes('tools')) {
        answer = 'Core stack: Python, PyTorch, LangGraph, LangChain, FastAPI, Docker, Streamlit, OpenCV, NumPy, TypeScript, Next.js, React, and TailwindCSS.';
      } else {
        answer = `Regarding "${question}": Sahil specializes in multimodal AI, model fine-tuning, RAG, agents, inference, evaluation, and MLOps. Feel free to reach out directly at sahilharsh.dev@gmail.com.`;
      }

      outputContent = (
        <div className="space-y-2 dark:text-[#DCDEDD] text-[#1c1817]">
          <div className="flex items-center gap-1.5 text-xs font-semibold dark:text-[#c68477] text-[#74483F]">
            <Sparkles className="w-3.5 h-3.5" />
            AI AGENT RESPONSE:
          </div>
          <p className="text-xs leading-relaxed dark:text-[#DCDEDD]/90 text-[#1c1817]">
            {answer}
          </p>
        </div>
      );
    } else if (normalizedCommand === 'projects' || normalizedCommand === 'transmissions') {
      outputContent = (
        <div className="space-y-2.5 dark:text-[#DCDEDD] text-[#1c1817]">
          <p className="dark:text-[#c68477] text-[#74483F] font-bold text-xs">FEATURED ENGINEERING PROJECTS:</p>
          {TRANSMISSIONS.map((transmission) => (
            <div key={transmission.id} className="p-3 rounded dark:bg-[#181110] bg-[#f7f5f2] border dark:border-white/[0.06] border-[#DCDEDD] space-y-1">
              <div className="flex items-center justify-between">
                <span className="dark:text-white text-[#1c1817] font-bold text-xs">
                  {transmission.title}
                </span>
                {transmission.githubUrl && (
                  <a
                    href={transmission.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-[11px] dark:text-[#c68477] text-[#74483F] hover:underline"
                  >
                    GitHub <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
              <p className="text-xs dark:text-[#DCDEDD]/80 text-[#4B4643]">{transmission.summary}</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {transmission.techStack.map((technology) => (
                  <span key={technology} className="px-1.5 py-0.5 rounded text-[10px] font-mono-tech dark:bg-white/[0.04] bg-[#4B4643]/10 dark:text-[#DCDEDD]/70 text-[#4B4643]">
                    {technology}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      );
    } else if (normalizedCommand === 'skills' || normalizedCommand === 'stack' || normalizedCommand.startsWith('skill ')) {
      const specific = normalizedCommand.replace('skill ', '').trim();

      if (specific && specific !== 'skills' && specific !== 'stack') {
        const found = TECH_GROUPS.flatMap((g) => g.skills).find((s) => s.name.toLowerCase().includes(specific));
        if (found) {
          outputContent = (
            <div className="p-3 rounded dark:bg-[#181110] bg-[#f7f5f2] border dark:border-[#74483F]/40 border-[#74483F]/30 space-y-1">
              <p className="dark:text-[#c68477] text-[#74483F] font-bold text-xs">SKILL MATCH: {found.name.toUpperCase()}</p>
              <p className="text-xs dark:text-white text-[#1c1817]">Proficiency: <span className="font-bold text-emerald-500">{found.proficiency}</span> ({found.tag})</p>
              <p className="text-xs dark:text-[#DCDEDD]/80 text-[#4B4643]">Application: {found.context}</p>
            </div>
          );
        } else {
          outputContent = (
            <p className="text-xs dark:text-[#DCDEDD]/70 text-[#4B4643]">
              No exact match found for &quot;{specific}&quot;. Type <span className="dark:text-[#c68477] text-[#74483F] font-bold cursor-pointer" onClick={() => handleCommand('skills')}>skills</span> to see all technologies.
            </p>
          );
        }
      } else {
        outputContent = (
          <div className="space-y-2.5 dark:text-[#DCDEDD] text-[#1c1817]">
            <p className="dark:text-[#c68477] text-[#74483F] font-bold text-xs">TECHNICAL SKILLS &amp; CAPABILITIES:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono-tech">
              {TECH_GROUPS.map((group) => (
                <div key={group.id} className="p-2.5 rounded dark:bg-[#181110] bg-[#f7f5f2] border dark:border-white/[0.06] border-[#DCDEDD] space-y-1">
                  <span className="dark:text-white text-[#1c1817] font-bold block">{group.title}</span>
                  <p className="dark:text-[#DCDEDD]/60 text-[#4B4643] text-[11px]">{group.skills.map((s) => s.name).join(', ')}</p>
                </div>
              ))}
            </div>
          </div>
        );
      }
    } else if (normalizedCommand === 'arc' || normalizedCommand === 'career' || normalizedCommand === 'about') {
      outputContent = (
        <div className="space-y-2 dark:text-[#DCDEDD] text-[#1c1817]">
          <p className="dark:text-[#c68477] text-[#74483F] font-bold text-xs">CAREER PROGRESSION ARC:</p>
          {CAREER_ARC.map((c) => (
            <div key={c.era} className="p-2 rounded dark:bg-[#181110] bg-[#f7f5f2] border dark:border-white/[0.06] border-[#DCDEDD] text-xs">
              <span className="dark:text-[#c68477] text-[#74483F] font-bold">{c.era} - {c.role}</span>
              <p className="dark:text-[#DCDEDD]/80 text-[#1c1817] text-[11px] mt-0.5">{c.summary}</p>
            </div>
          ))}
        </div>
      );
    } else if (normalizedCommand === 'toon') {
      outputContent = (
        <div className="space-y-2 dark:text-[#DCDEDD] text-[#1c1817]">
          <p className="dark:text-[#c68477] text-[#74483F] font-bold text-xs">TOON PROMPT FRAMEWORK SPEC:</p>
          <p className="text-xs dark:text-[#DCDEDD]/80 text-[#4B4643]">
            Task-Oriented Output Normalization enforces strict typed JSON schemas over verbose prose, yielding ~40% token cost savings.
          </p>
          <pre className="p-2.5 rounded bg-black/40 text-emerald-400 font-mono text-[11px] overflow-x-auto border dark:border-white/[0.08] border-[#DCDEDD]">
            {`{
  "prompt_strategy": "TOON_TASK_ORIENTED",
  "token_saving": "~40%",
  "mode": "ZERO_META_FILLER",
  "enforced_format": "STRICT_JSON_SCHEMA"
}`}
          </pre>
        </div>
      );
    } else if (normalizedCommand === 'theme' || normalizedCommand === 'theme toggle') {
      toggleTheme();
      outputContent = (
        <p className="text-xs font-mono-tech dark:text-[#c68477] text-[#74483F]">
          Theme switched! Current mode: <span className="font-bold uppercase">{theme === 'dark' ? 'Light' : 'Dark'}</span>
        </p>
      );
    } else if (normalizedCommand === 'theme dark') {
      setTheme('dark');
      outputContent = <p className="text-xs font-mono-tech dark:text-[#c68477] text-[#74483F]">Theme set to DARK mode.</p>;
    } else if (normalizedCommand === 'theme light') {
      setTheme('light');
      outputContent = <p className="text-xs font-mono-tech dark:text-[#c68477] text-[#74483F]">Theme set to LIGHT mode.</p>;
    } else if (normalizedCommand === 'matrix' || normalizedCommand === 'hack') {
      outputContent = (
        <div className="space-y-1 font-mono text-emerald-500 text-[11px] animate-pulse">
          <p>01000001 01001001 00100000 01000101 01001110 01000111 01001001 01001110 01000101 01000101 01010010</p>
          <p>&gt; BYPASSING NEURAL LATENCY... [100% OK]</p>
          <p>&gt; DEPLOYING AUTONOMOUS AGENT TOPOLOGY... [ESTABLISHED]</p>
          <p>&gt; SECURITY: ROOT ACCESS GRANTED TO GUEST DEVELOPER.</p>
        </div>
      );
    } else if (normalizedCommand === 'whoami') {
      outputContent = (
        <div className="space-y-1 text-xs font-mono-tech dark:text-[#DCDEDD] text-[#1c1817]">
          <p><span className="dark:text-[#c68477] text-[#74483F] font-bold">User:</span> guest_visitor_terminal</p>
          <p><span className="dark:text-[#c68477] text-[#74483F] font-bold">Host:</span> portfolio.sahilharsh.dev</p>
          <p><span className="dark:text-[#c68477] text-[#74483F] font-bold">Session:</span> Active WebSocket / SSE Simulated</p>
          <p><span className="dark:text-[#c68477] text-[#74483F] font-bold">Permissions:</span> Read, Execute, Simulate</p>
        </div>
      );
    } else if (normalizedCommand === 'quote') {
      const quotes = [
        '"AI assists, but human taste and architectural clarity define great systems." - Sahil Harsh',
        '"First make it work, then make it right, then make it fast." - Kent Beck',
        '"6,000 hours of video editing gave me an obsessive eye for interface timing and user friction."'
      ];
      const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
      outputContent = <p className="italic text-xs dark:text-[#c68477] text-[#74483F] font-serif-accent">{randomQuote}</p>;
    } else if (normalizedCommand === 'contact') {
      outputContent = (
        <div className="space-y-2.5 dark:text-[#DCDEDD] text-[#1c1817]">
          <p className="dark:text-[#c68477] text-[#74483F] font-bold text-xs">DIRECT COMMUNICATION CHANNELS:</p>
          <div className="p-3 rounded dark:bg-[#181110] bg-[#f7f5f2] border dark:border-white/[0.06] border-[#DCDEDD] space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span>Email: <strong className="dark:text-white text-[#1c1817]">{PERSONAL_INFO.email}</strong></span>
              <button
                onClick={copyEmail}
                className="flex items-center gap-1 px-2 py-0.5 rounded bg-[#74483F]/15 dark:text-[#c68477] text-[#74483F] hover:bg-[#74483F]/25 transition-colors cursor-pointer"
              >
                {copiedEmail ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                {copiedEmail ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <div>
              GitHub: <a href={PERSONAL_INFO.githubUrl} target="_blank" rel="noopener noreferrer" className="dark:text-[#c68477] text-[#74483F] hover:underline font-semibold">{PERSONAL_INFO.githubUrl}</a>
            </div>
            <div>
              LinkedIn: <a href={PERSONAL_INFO.linkedinUrl} target="_blank" rel="noopener noreferrer" className="dark:text-[#c68477] text-[#74483F] hover:underline font-semibold">{PERSONAL_INFO.linkedinUrl}</a>
            </div>
          </div>
        </div>
      );
    } else {
      outputContent = (
        <div className="space-y-1 text-xs">
          <p className="text-rose-500 font-mono-tech">
            Command not recognized: &quot;{enteredCommand}&quot;
          </p>
          <p className="dark:text-[#DCDEDD]/70 text-[#4B4643] text-[11px]">
            Type <span className="dark:text-[#c68477] text-[#74483F] font-bold cursor-pointer underline" onClick={() => handleCommand('help')}>help</span> to view available operations, or try <span className="dark:text-[#c68477] text-[#74483F] font-bold cursor-pointer underline" onClick={() => handleCommand('run claw-agent')}>run claw-agent</span>.
          </p>
        </div>
      );
    }

    setLogs((prev) => [
      ...prev,
      {
        id: `cmd-${Date.now()}-${Math.random()}`,
        command: enteredCommand,
        output: outputContent,
        timestamp
      }
    ]);
    setInputValue('');
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && inputValue.trim()) {
      handleCommand(inputValue);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (commandHistory.length > 0) {
        const nextIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(nextIndex);
        setInputValue(commandHistory[nextIndex]);
      }
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (historyIndex !== -1) {
        const nextIndex = historyIndex + 1;
        if (nextIndex >= commandHistory.length) {
          setHistoryIndex(-1);
          setInputValue('');
        } else {
          setHistoryIndex(nextIndex);
          setInputValue(commandHistory[nextIndex]);
        }
      }
    } else if (event.key === 'Tab') {
      event.preventDefault();
      const partialCommand = inputValue.trim().toLowerCase();
      if (!partialCommand) return;
      const match = AVAILABLE_COMMANDS.find((command) => command.toLowerCase().startsWith(partialCommand));
      if (match) {
        setInputValue(match.includes('<') ? match.split(' ')[0] + ' ' : match);
      }
    }
  };

  return (
    <div
      id="agent-console-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 dark:bg-black/85 bg-black/60 backdrop-blur-sm sm:backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        id="agent-console-dialog"
        className="relative w-full max-w-3xl dark:bg-[#120e0d] bg-white border dark:border-[#74483F]/35 border-[#DCDEDD] rounded-[10px] shadow-2xl overflow-hidden my-4 sm:my-8 flex flex-col max-h-[85vh]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4 py-3 dark:bg-[#181110] bg-[#f7f5f2] border-b dark:border-white/[0.08] border-[#DCDEDD] shrink-0">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 dark:text-[#c68477] text-[#74483F]" />
            <span className="font-mono-tech text-xs dark:text-[#DCDEDD] text-[#1c1817] font-medium">
              sahil-harsh@agent-console:~ (bash)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleCommand('theme')}
              className="p-1 rounded text-xs dark:text-[#DCDEDD]/70 text-[#4B4643] dark:hover:text-white hover:text-[#1c1817] flex items-center gap-1 font-mono-tech"
              title="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-[#74483F]" />}
            </button>
            <span className="font-mono-tech text-[10px] dark:text-[#c68477] text-[#74483F] dark:bg-[#74483F]/15 bg-[#74483F]/10 px-2 py-0.5 rounded border dark:border-[#74483F]/30 border-[#74483F]/20 font-semibold">
              CLI READY
            </span>
            <button
              onClick={onClose}
              className="p-1 rounded dark:text-[#DCDEDD]/70 text-[#4B4643] dark:hover:text-white hover:text-[#1c1817] transition-colors cursor-pointer"
              aria-label="Close terminal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-4 py-2 dark:bg-[#080505] bg-[#faf8f6] border-b dark:border-white/[0.05] border-[#DCDEDD] overflow-x-auto font-mono-tech text-[11px] shrink-0 no-scrollbar">
          <span className="dark:text-[#DCDEDD]/60 text-[#4B4643] shrink-0 font-medium">ACTIONS:</span>
          {[
            { label: 'run claw-agent', cmd: 'run claw-agent' },
            { label: 'arc', cmd: 'arc' },
            { label: 'toon spec', cmd: 'toon' },
            { label: 'theme', cmd: 'theme' },
            { label: 'contact', cmd: 'contact' },
            { label: 'clear', cmd: 'clear' }
          ].map((quickCommand) => (
            <button
              key={quickCommand.label}
              onClick={() => handleCommand(quickCommand.cmd)}
              className="px-2 py-0.5 rounded glass hover:border-[#74483F]/50 dark:hover:border-[#c68477]/50 dark:hover:text-[#c68477] hover:text-[#74483F] dark:text-[#DCDEDD] text-[#4B4643] dark:border-white/[0.06] border-[#DCDEDD] transition-colors cursor-pointer shrink-0 whitespace-nowrap active:scale-95"
            >
              {quickCommand.label}
            </button>
          ))}
        </div>

        <div className="p-4 flex-1 overflow-y-auto font-mono-tech text-xs space-y-4 dark:bg-[#0c0808] bg-[#ffffff] min-h-[280px]">
          {logs.map((log) => (
            <div key={log.id} className="space-y-1.5">
              <div className="flex items-center gap-2 dark:text-[#DCDEDD]/70 text-[#4B4643]">
                <span className="dark:text-[#c68477] text-[#74483F] font-bold">&gt;</span>
                <span className="dark:text-white text-[#1c1817] font-bold">{log.command}</span>
                <span className="text-[10px] dark:text-[#DCDEDD]/50 text-[#4B4643]/60 ml-auto">{log.timestamp}</span>
              </div>
              <div className="pl-3 border-l dark:border-white/[0.08] border-[#DCDEDD]">
                {log.output}
              </div>
            </div>
          ))}
          <div ref={terminalEndRef} />
        </div>

        <div className="flex items-center gap-2 p-3 dark:bg-[#181110] bg-[#f7f5f2] border-t dark:border-white/[0.08] border-[#DCDEDD] shrink-0">
          <Terminal className="w-4 h-4 dark:text-[#c68477] text-[#74483F]" />
          <span className="font-mono-tech text-xs dark:text-[#c68477] text-[#74483F] font-bold">$</span>
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type 'help', 'run claw-agent', 'arc', 'contact' (or press Tab)..."
            className="flex-1 bg-transparent text-xs font-mono-tech dark:text-white text-[#1c1817] placeholder-slate-400 focus:outline-none"
            autoFocus
          />
          <button
            onClick={() => inputValue.trim() && handleCommand(inputValue)}
            className="p-1.5 rounded-md dark:bg-[#74483F]/25 bg-[#74483F]/15 dark:hover:bg-[#74483F]/40 hover:bg-[#74483F]/30 dark:text-[#c68477] text-[#74483F] transition-colors cursor-pointer active:scale-95"
            aria-label="Send command"
            title="Execute (Enter)"
          >
            <CornerDownLeft className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
