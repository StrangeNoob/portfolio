import { useEffect, useReducer } from 'react';
import { ANIMATION_DELAYS } from '@/lib/constants';

interface BootState {
  bootComplete: boolean;
  visibleLines: number;
  showCommands: boolean;
  currentCommand: number;
  typingCommand: string;
  showOutput: boolean[];
}

type BootAction =
  | { type: 'INCREMENT_LINES' }
  | { type: 'COMPLETE_BOOT' }
  | { type: 'SET_TYPING_COMMAND'; payload: string }
  | { type: 'SHOW_OUTPUT'; payload: number }
  | { type: 'NEXT_COMMAND' }
  | { type: 'RESET' };

const initialState: BootState = {
  bootComplete: false,
  visibleLines: 0,
  showCommands: false,
  currentCommand: 0,
  typingCommand: '',
  showOutput: [false, false, false],
};

function bootReducer(state: BootState, action: BootAction): BootState {
  switch (action.type) {
    case 'INCREMENT_LINES':
      return { ...state, visibleLines: state.visibleLines + 1 };
    case 'COMPLETE_BOOT':
      return { ...state, bootComplete: true, showCommands: true };
    case 'SET_TYPING_COMMAND':
      return { ...state, typingCommand: action.payload };
    case 'SHOW_OUTPUT': {
      const newOutput = [...state.showOutput];
      newOutput[action.payload] = true;
      return { ...state, showOutput: newOutput };
    }
    case 'NEXT_COMMAND':
      return {
        ...state,
        currentCommand: state.currentCommand + 1,
        typingCommand: '',
      };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

interface UseBootSequenceOptions {
  bootSequenceLength: number;
  commands: Array<{ cmd: string; output: string }>;
}

interface UseBootSequenceReturn extends BootState {
  dispatch: React.Dispatch<BootAction>;
}

export function useBootSequence({
  bootSequenceLength,
  commands,
}: UseBootSequenceOptions): UseBootSequenceReturn {
  const [state, dispatch] = useReducer(bootReducer, initialState);

  // Boot sequence effect
  useEffect(() => {
    const bootTimer = setInterval(() => {
      if (state.visibleLines >= bootSequenceLength) {
        clearInterval(bootTimer);
        setTimeout(() => {
          dispatch({ type: 'COMPLETE_BOOT' });
        }, ANIMATION_DELAYS.BOOT_COMPLETE);
        return;
      }
      dispatch({ type: 'INCREMENT_LINES' });
    }, ANIMATION_DELAYS.BOOT_LINE);

    return () => clearInterval(bootTimer);
  }, [bootSequenceLength, state.visibleLines]);

  // Command typing effect
  useEffect(() => {
    if (!state.showCommands || state.currentCommand >= commands.length) return;

    const cmd = commands[state.currentCommand].cmd;
    let charIndex = 0;

    const typeTimer = setInterval(() => {
      if (charIndex <= cmd.length) {
        dispatch({ type: 'SET_TYPING_COMMAND', payload: cmd.slice(0, charIndex) });
        charIndex++;
      } else {
        clearInterval(typeTimer);
        setTimeout(() => {
          dispatch({ type: 'SHOW_OUTPUT', payload: state.currentCommand });
          setTimeout(() => {
            dispatch({ type: 'NEXT_COMMAND' });
          }, ANIMATION_DELAYS.COMMAND_OUTPUT);
        }, ANIMATION_DELAYS.TYPING_PAUSE);
      }
    }, ANIMATION_DELAYS.TYPING_CHAR);

    return () => clearInterval(typeTimer);
  }, [state.showCommands, state.currentCommand, commands]);

  return { ...state, dispatch };
}

export default useBootSequence;
