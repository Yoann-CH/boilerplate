// Clé utilisée pour stocker la préférence de thème dans le localStorage
const THEME_PREFERENCE_KEY = 'theme-preference';

/**
 * Enregistre la préférence de thème dans le localStorage
 */
export const saveThemePreference = (theme: string) => {
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem(THEME_PREFERENCE_KEY, theme);
    }
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement de la préférence de thème:', error);
  }
};

/**
 * Récupère la préférence de thème depuis le localStorage
 * @returns La préférence de thème stockée ou null si aucune préférence n'est définie
 */
export const getThemePreference = (): string | null => {
  try {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(THEME_PREFERENCE_KEY);
    }
    return null;
  } catch (error) {
    console.error('Erreur lors de la récupération de la préférence de thème:', error);
    return null;
  }
};

/**
 * Utilise la préférence système pour déterminer le thème par défaut
 * @returns 'dark' si la préférence système est le mode sombre, sinon 'light'
 */
export const getSystemTheme = (): 'dark' | 'light' => {
  if (typeof window !== 'undefined') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return 'light'; // Par défaut en mode clair
}; 