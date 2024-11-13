export type Voice = keyof typeof IS_VOICE

export function isVoice(inQuestion: string): inQuestion is Voice {
  return !!(IS_VOICE as Record<string, unknown>)[inQuestion]
}

const IS_VOICE = {
  alloy: true,
  ash: true,
  ballard: true,
  echo: true,
  sage: true,
  shimmer: true,
  verse: true,
}
