import { ref, watch } from 'vue'
import { darkTheme, lightTheme } from 'naive-ui'

export const useTheme = () => {
  const isDark = ref(false)
  const theme = ref(lightTheme)
  const toggleTheme = () => {
    isDark.value = !isDark.value
    theme.value = isDark.value ? darkTheme : lightTheme
    if (isDark.value) {
      document.body.classList.add('dark')
    } else {
      document.body.classList.remove('dark')
    }
  }
  if (typeof window !== 'undefined') {
    isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
    theme.value = isDark.value ? darkTheme : lightTheme
  }
  return {
    isDark,
    theme,
    toggleTheme
  }
}