import { useCallback, useEffect, useRef, useState } from "react";
import type { ChatPhase } from "../components/ai";
import type { ThinkingStep } from "../components/ai";

interface UseChatSimulationOptions {
  thinkingSteps: ThinkingStep[];
  /** Delay between each thinking step in ms. @default 700 */
  stepCycleMs?: number;
  /** Delay between each response section reveal in ms. @default 680 */
  sectionDelayMs?: number;
  /** Total number of response sections to reveal. @default 6 */
  sectionCount?: number;
}

export interface ChatSimulation {
  phase: ChatPhase;
  input: string;
  setInput: (value: string) => void;
  canSend: boolean;
  handleSend: () => void;
  /** Re-run the same conversation flow (e.g. after the thread has finished). */
  handleRerun: () => void;
  activeThinkingStep: number;
  thinkingOpen: boolean;
  setThinkingOpen: React.Dispatch<React.SetStateAction<boolean>>;
  visibleSections: number;
  scrollRef: React.RefObject<HTMLDivElement | null>;
}

export default function useChatSimulation({
  thinkingSteps,
  stepCycleMs = 700,
  sectionDelayMs = 680,
  sectionCount = 6,
}: UseChatSimulationOptions): ChatSimulation {
  const [input, setInput] = useState("");
  const [phase, setPhase] = useState<ChatPhase>("idle");
  const [activeThinkingStep, setActiveThinkingStep] = useState(0);
  const [thinkingOpen, setThinkingOpen] = useState(false);
  const [visibleSections, setVisibleSections] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const canSend = input.trim().length > 0 && phase === "idle";

  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }
  }, []);

  const handleSend = useCallback(() => {
    if (!canSend) return;
    setInput("");
    setPhase("thinking");
    setActiveThinkingStep(0);
    setThinkingOpen(false);
    setVisibleSections(0);
    setTimeout(scrollToBottom, 60);
  }, [canSend, scrollToBottom]);

  const handleRerun = useCallback(() => {
    if (phase === "idle" || phase === "thinking") return;
    setPhase("thinking");
    setActiveThinkingStep(0);
    setThinkingOpen(false);
    setVisibleSections(0);
    setTimeout(scrollToBottom, 60);
  }, [phase, scrollToBottom]);

  useEffect(() => {
    if (phase !== "thinking") return;

    let step = 0;
    const advance = () => {
      step += 1;
      if (step >= thinkingSteps.length) {
        setPhase("responding");
      } else {
        setActiveThinkingStep(step);
        timer = setTimeout(advance, stepCycleMs);
      }
    };

    let timer = setTimeout(advance, stepCycleMs);
    return () => clearTimeout(timer);
  }, [phase, thinkingSteps.length, stepCycleMs]);

  useEffect(() => {
    if (phase !== "responding") return;

    let section = 0;
    const reveal = () => {
      section += 1;
      setVisibleSections(section);
      scrollToBottom();
      if (section >= sectionCount) {
        setPhase("done");
      } else {
        timer = setTimeout(reveal, sectionDelayMs);
      }
    };

    let timer = setTimeout(reveal, sectionDelayMs);
    return () => clearTimeout(timer);
  }, [phase, scrollToBottom, sectionCount, sectionDelayMs]);

  useEffect(() => {
    scrollToBottom();
  }, [visibleSections, scrollToBottom]);

  return {
    phase,
    input,
    setInput,
    canSend,
    handleSend,
    handleRerun,
    activeThinkingStep,
    thinkingOpen,
    setThinkingOpen,
    visibleSections,
    scrollRef,
  };
}
