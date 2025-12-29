import React from 'react';
import { IconButton } from '@mui/material';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import { useTheme } from '../context/ThemeContext';

/**
 * Theme Toggle Button Component
 */
const ThemeToggle = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <div className="fixed top-6 right-6 z-50">
            <IconButton
                onClick={toggleTheme}
                className="glass glass-border glass-hover"
                sx={{
                    color: 'white',
                    width: 56,
                    height: 56,
                    '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    },
                }}
            >
                {theme === 'dark' ? (
                    <LightModeIcon sx={{ fontSize: 28 }} />
                ) : (
                    <DarkModeIcon sx={{ fontSize: 28 }} />
                )}
            </IconButton>
        </div>
    );
};

export default ThemeToggle;
