import { useEffect } from 'react';
// import { useThemeStore } from '../theme.store';

export const useApplyTheme = () => {
    // const theme = useThemeStore((s) => s.theme);
    const theme = 'purple';

    useEffect(() => {
      console.log("pu")
        document.documentElement.className = `theme-${theme}`;
    }, [theme]);
};