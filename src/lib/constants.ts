/**
 * Animation timing constants (in milliseconds)
 */
export const ANIMATION_DELAYS = {
  /** Delay between boot sequence lines */
  BOOT_LINE: 300,
  /** Delay after boot sequence completes before showing commands */
  BOOT_COMPLETE: 500,
  /** Delay between each character when typing */
  TYPING_CHAR: 50,
  /** Pause after typing completes before showing output */
  TYPING_PAUSE: 200,
  /** Delay after showing command output before next command */
  COMMAND_OUTPUT: 500,
  /** Delay between form submission steps */
  FORM_STEP: 300,
  /** Duration to display success message */
  SUCCESS_DISPLAY: 5000,
  /** Duration to display error message */
  ERROR_DISPLAY: 5000,
  /** Stagger delay for skill bars */
  SKILL_BAR_STAGGER: 50,
  /** Base delay for skill bar animation */
  SKILL_BAR_BASE: 100,
} as const;

/**
 * UI constants
 */
export const UI_CONSTANTS = {
  /** Length of htop-style skill bar in characters */
  HTOP_BAR_LENGTH: 25,
  /** Length of category bar in characters */
  CATEGORY_BAR_LENGTH: 20,
  /** Maximum number of skills before virtualization is recommended */
  MAX_SKILLS_BEFORE_VIRTUALIZE: 50,
} as const;

/**
 * API constants
 */
export const REQUEST_TIMEOUT = 30000; // 30 seconds

/**
 * Accessibility constants
 */
export const A11Y_IDS = {
  MAIN_CONTENT: 'main-content',
  NAME_ERROR: 'name-error',
  EMAIL_ERROR: 'email-error',
  MESSAGE_ERROR: 'message-error',
  FORM_ERROR: 'form-error',
} as const;
