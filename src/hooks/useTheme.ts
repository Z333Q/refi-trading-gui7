// Since we're only using dark mode, we can simplify this hook
export function useTheme() {
  // Always return dark theme
  return { 
    theme: 'dark' as const,
    toggleTheme: () => {} // No-op since we don't support theme switching
  }
}