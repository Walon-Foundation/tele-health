// Crisis detection keywords and patterns
export const CRISIS_KEYWORDS = {
  suicide: [
    'kill myself',
    'end my life',
    'want to die',
    'suicide',
    'suicidal',
    'end it all',
    'no reason to live',
    'better off dead',
    'can\'t go on',
  ],
  selfHarm: [
    'hurt myself',
    'cut myself',
    'self harm',
    'self-harm',
    'harm myself',
  ],
  violence: [
    'hurt someone',
    'kill them',
    'hurt him',
    'hurt her',
    'violent thoughts',
  ],
  immediateRisk: [
    'pills',
    'overdose',
    'gun',
    'knife',
    'bridge',
    'rope',
    'tonight',
    'right now',
    'today',
  ],
};

export const SEVERITY_LEVELS = {
  NORMAL: 'normal',
  CONCERNING: 'concerning',
  URGENT: 'urgent',
  CRITICAL: 'critical',
} as const;

export function detectCrisisLevel(message: string): {
  level: keyof typeof SEVERITY_LEVELS;
  keywords: string[];
  recommendedAction: string;
} {
  const lowerMessage = message.toLowerCase();
  const foundKeywords: string[] = [];
  
  // Check for suicide keywords
  const suicideMatches = CRISIS_KEYWORDS.suicide.filter(keyword => 
    lowerMessage.includes(keyword.toLowerCase())
  );
  
  // Check for self-harm keywords
  const selfHarmMatches = CRISIS_KEYWORDS.selfHarm.filter(keyword =>
    lowerMessage.includes(keyword.toLowerCase())
  );
  
  // Check for violence keywords
  const violenceMatches = CRISIS_KEYWORDS.violence.filter(keyword =>
    lowerMessage.includes(keyword.toLowerCase())
  );
  
  // Check for immediate risk keywords
  const immediateRiskMatches = CRISIS_KEYWORDS.immediateRisk.filter(keyword =>
    lowerMessage.includes(keyword.toLowerCase())
  );

  foundKeywords.push(...suicideMatches, ...selfHarmMatches, ...violenceMatches, ...immediateRiskMatches);

  // Determine severity level
  if (suicideMatches.length > 0 && immediateRiskMatches.length > 0) {
    return {
      level: 'CRITICAL',
      keywords: foundKeywords,
      recommendedAction: 'IMMEDIATE_INTERVENTION',
    };
  }

  if (suicideMatches.length > 0 || violenceMatches.length > 0) {
    return {
      level: 'URGENT',
      keywords: foundKeywords,
      recommendedAction: 'ESCALATE_TO_CRISIS_COUNSELOR',
    };
  }

  if (selfHarmMatches.length > 0) {
    return {
      level: 'CONCERNING',
      keywords: foundKeywords,
      recommendedAction: 'FLAG_FOR_COUNSELOR_REVIEW',
    };
  }

  return {
    level: 'NORMAL',
    keywords: [],
    recommendedAction: 'CONTINUE_SESSION',
  };
}

export const CRISIS_RESOURCES = {
  sierraLeone: {
    name: 'Mental Health Hotline (Sierra Leone)',
    number: '079-XXX-XXX',
    available: '24/7',
  },
  police: {
    name: 'Police Emergency',
    number: '019',
    available: '24/7',
  },
  hospital: {
    name: 'Kissy Psychiatric Hospital',
    number: '076-XXX-XXX',
    available: '24/7',
  },
  international: {
    name: 'International Suicide Hotline',
    number: '+1-800-273-8255',
    available: '24/7',
  },
};

export const CRISIS_RESPONSE_TEMPLATE = `I'm really concerned about what you just shared. Your safety is my top priority.

Please know:
- You are not alone in this
- These feelings are temporary, even though they feel overwhelming right now
- There are people who want to help you

If you're in immediate danger, please:
1. Call {emergency_number}
2. Go to the nearest emergency room
3. Reach out to someone you trust

I'm here with you. Can we talk about what's making you feel this way?`;
