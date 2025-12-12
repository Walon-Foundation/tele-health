export const KRIO_TRANSLATIONS = {
  en: {
    // Navigation
    'back': 'Back',
    'continue': 'Continue',
    'get_started': 'Get Started Anonymously',
    'login': 'Login',
    'logout': 'Sign Out',
    
    // Signup
    'choose_avatar': 'Choose Your Avatar',
    'create_username': 'Create Your Username',
    'tell_us_about_you': 'Tell Us About You',
    'what_help_with': 'What Would You Like Help With?',
    'create_pin': 'Create Your PIN',
    'anonymous_identity': 'This will be your anonymous identity',
    'no_real_names': 'Choose an anonymous name (no real names!)',
    'select_all_apply': 'Select all that apply',
    'pin_protection': '4-6 digits to protect your privacy',
    'pin_stored_locally': 'Your PIN is stored locally – we never see it',
    
    // Chat
    'type_message': 'Type a message...',
    'counselor_typing': 'typing...',
    'online': 'Online',
    'offline': 'You\'re offline – messages will send when connected',
    
    // Crisis
    'crisis_detected': 'We\'re Concerned About You',
    'crisis_message': 'Your safety is our top priority. Please reach out for immediate help.',
    'emergency_contacts': 'Emergency Contacts',
    
    // Mood Tracking
    'how_feeling': 'How are you feeling?',
    'feeling_before': 'Before our chat',
    'feeling_after': 'After our chat',
    'very_bad': 'Very Bad',
    'bad': 'Bad',
    'okay': 'Okay',
    'good': 'Good',
    'very_good': 'Very Good',
    
    // Common
    'yes': 'Yes',
    'no': 'No',
    'cancel': 'Cancel',
    'save': 'Save',
    'delete': 'Delete',
    'send': 'Send',
  },
  
  krio: {
    // Navigation
    'back': 'Go Bak',
    'continue': 'Kontinyu',
    'get_started': 'Bigin Naw (No Nem)',
    'login': 'Log In',
    'logout': 'Komot',
    
    // Signup
    'choose_avatar': 'Pik Yu Pikchɔ',
    'create_username': 'Mek Yu Nem',
    'tell_us_about_you': 'Tɛl Wi Bɔt Yu',
    'what_help_with': 'Wetin Yu Nid Ɛp Wit?',
    'create_pin': 'Mek Yu PIN',
    'anonymous_identity': 'Dis go bi yu sikrit nem',
    'no_real_names': 'Pik wan nem we nɔ yu rial nem!',
    'select_all_apply': 'Pik ɔl we fayn fɔ yu',
    'pin_protection': '4-6 nɔmba fɔ protɛkt yu',
    'pin_stored_locally': 'Yu PIN se na yu fon nɔmɔ – wi nɔ go si am',
    
    // Chat
    'type_message': 'Rayt mɛsej...',
    'counselor_typing': 'de rayt...',
    'online': 'De Ya',
    'offline': 'Yu nɔ gɛt intanɛt – mɛsej go sɛn we yu gɛt am',
    
    // Crisis
    'crisis_detected': 'Wi Kɔnsayn Bɔt Yu',
    'crisis_message': 'Yu layf impɔtant. Duya, kɔl dis nɔmba naw naw fɔ gɛt ɛp.',
    'emergency_contacts': 'Emɛjɛnsi Nɔmba Dɛm',
    
    // Mood Tracking
    'how_feeling': 'Aw yu de fil?',
    'feeling_before': 'Bifo wi tɔk',
    'feeling_after': 'Afta wi tɔk',
    'very_bad': 'Bad Bad Wan',
    'bad': 'Bad',
    'okay': 'Okay',
    'good': 'Fayn',
    'very_good': 'Fayn Bad Wan',
    
    // Common
    'yes': 'Yes',
    'no': 'No',
    'cancel': 'Kɛnsɛl',
    'save': 'Sev',
    'delete': 'Dilit',
    'send': 'Sɛn',
  },
};

export type Language = 'en' | 'krio';

export function t(key: string, lang: Language = 'en'): string {
  return KRIO_TRANSLATIONS[lang][key as keyof typeof KRIO_TRANSLATIONS['en']] || key;
}

export function getCurrentLanguage(): Language {
  if (typeof window !== 'undefined') {
    return (localStorage.getItem('safespace_language') as Language) || 'en';
  }
  return 'en';
}

export function setLanguage(lang: Language) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('safespace_language', lang);
  }
}
