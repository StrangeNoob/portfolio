import { useState, useCallback } from 'react';
import { ANIMATION_DELAYS, REQUEST_TIMEOUT } from '@/lib/constants';

interface FormState {
  name: string;
  email: string;
  message: string;
}

interface UseFormSubmissionOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

interface UseFormSubmissionReturn {
  formState: FormState;
  setFormState: React.Dispatch<React.SetStateAction<FormState>>;
  isSubmitting: boolean;
  isSubmitted: boolean;
  currentStep: number;
  error: string | null;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  clearError: () => void;
  resetForm: () => void;
}

const initialFormState: FormState = {
  name: '',
  email: '',
  message: '',
};

export function useFormSubmission(
  options: UseFormSubmissionOptions = {}
): UseFormSubmissionReturn {
  const [formState, setFormState] = useState<FormState>(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const resetForm = useCallback(() => {
    setFormState(initialFormState);
    setIsSubmitted(false);
    setCurrentStep(0);
    setError(null);
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent): Promise<void> => {
      e.preventDefault();
      if (!formState.name || !formState.email || !formState.message) return;

      setIsSubmitting(true);
      setError(null);
      setCurrentStep(1);

      // Create AbortController for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

      try {
        // Step 1: Validating
        await new Promise((resolve) => setTimeout(resolve, ANIMATION_DELAYS.FORM_STEP));
        setCurrentStep(2);

        // Step 2: Connecting & Sending
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formState),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to send message');
        }

        setCurrentStep(3);
        await new Promise((resolve) => setTimeout(resolve, ANIMATION_DELAYS.FORM_STEP));

        setIsSubmitting(false);
        setIsSubmitted(true);
        setFormState(initialFormState);
        options.onSuccess?.();

        setTimeout(() => {
          setIsSubmitted(false);
          setCurrentStep(0);
        }, ANIMATION_DELAYS.SUCCESS_DISPLAY);
      } catch (err) {
        clearTimeout(timeoutId);
        setIsSubmitting(false);
        setCurrentStep(0);

        const errorMessage =
          err instanceof Error
            ? err.name === 'AbortError'
              ? 'Request timed out. Please try again.'
              : err.message
            : 'Something went wrong';

        setError(errorMessage);
        options.onError?.(err instanceof Error ? err : new Error(errorMessage));

        setTimeout(() => setError(null), ANIMATION_DELAYS.ERROR_DISPLAY);
      }
    },
    [formState, options]
  );

  return {
    formState,
    setFormState,
    isSubmitting,
    isSubmitted,
    currentStep,
    error,
    handleSubmit,
    clearError,
    resetForm,
  };
}

export default useFormSubmission;
