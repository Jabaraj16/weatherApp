import React, { useState, useRef, useEffect } from 'react';
import { TextField, IconButton, Paper, List, ListItem, ListItemText } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import MyLocationIcon from '@mui/icons-material/MyLocation';

// Popular cities for suggestions
const POPULAR_CITIES = [
    'London',
    'New York',
    'Tokyo',
    'Paris',
    'Dubai',
    'Singapore',
    'Mumbai',
    'Sydney',
    'Los Angeles',
    'Chicago',
    'Toronto',
    'Berlin',
    'Madrid',
    'Rome',
    'Amsterdam',
    'Bangkok',
    'Seoul',
    'Moscow',
    'Istanbul',
    'Hong Kong',
    'Barcelona',
    'Vienna',
    'Prague',
    'Athens',
    'Cairo',
    'Delhi',
    'Shanghai',
    'Beijing',
    'Melbourne',
    'Vancouver',
];

/**
 * Search Bar Component with city suggestions
 * @param {object} props - Component props
 * @param {function} props.onSearch - Search callback function
 * @param {function} props.onLocationRequest - Location request callback
 * @param {boolean} props.loading - Loading state
 */
const SearchBar = ({ onSearch, onLocationRequest, loading }) => {
    const [city, setCity] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const searchRef = useRef(null);

    // Filter suggestions based on input
    useEffect(() => {
        if (city.trim().length > 0) {
            const filtered = POPULAR_CITIES.filter((c) =>
                c.toLowerCase().startsWith(city.toLowerCase())
            ).slice(0, 5); // Show max 5 suggestions
            setSuggestions(filtered);
            setShowSuggestions(filtered.length > 0);
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }
    }, [city]);

    // Close suggestions when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (city.trim()) {
            onSearch(city.trim());
            setCity('');
            setShowSuggestions(false);
        }
    };

    const handleSuggestionClick = (selectedCity) => {
        setCity(selectedCity);
        onSearch(selectedCity);
        setCity('');
        setShowSuggestions(false);
    };

    return (
        <div ref={searchRef} className="w-full max-w-2xl mx-auto px-4 mb-8 relative">
            <form onSubmit={handleSubmit}>
                <div className="glass glass-border rounded-2xl p-2 flex items-center gap-2">
                    {/* Search Input */}
                    <TextField
                        fullWidth
                        variant="standard"
                        placeholder="Search for a city..."
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        onFocus={() => {
                            if (suggestions.length > 0) {
                                setShowSuggestions(true);
                            }
                        }}
                        disabled={loading}
                        InputProps={{
                            disableUnderline: true,
                            style: {
                                color: 'white',
                                fontSize: '1.125rem',
                                padding: '0.5rem 1rem',
                            },
                        }}
                        sx={{
                            '& input::placeholder': {
                                color: 'rgba(255, 255, 255, 0.5)',
                                opacity: 1,
                            },
                        }}
                    />

                    {/* Search Button */}
                    <IconButton
                        type="submit"
                        disabled={loading || !city.trim()}
                        className="glass-hover"
                        sx={{
                            color: 'white',
                            '&:hover': {
                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            },
                            '&:disabled': {
                                color: 'rgba(255, 255, 255, 0.3)',
                            },
                        }}
                    >
                        <SearchIcon />
                    </IconButton>

                    {/* Location Button */}
                    <IconButton
                        onClick={onLocationRequest}
                        disabled={loading}
                        className="glass-hover"
                        sx={{
                            color: 'white',
                            '&:hover': {
                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            },
                            '&:disabled': {
                                color: 'rgba(255, 255, 255, 0.3)',
                            },
                        }}
                    >
                        <MyLocationIcon />
                    </IconButton>
                </div>
            </form>

            {/* Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
                <Paper
                    className="glass glass-border mt-2 overflow-hidden"
                    sx={{
                        backgroundColor: 'rgba(0, 0, 0, 0.3)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                    }}
                >
                    <List sx={{ padding: 0 }}>
                        {suggestions.map((suggestion, index) => (
                            <ListItem
                                key={index}
                                button
                                onClick={() => handleSuggestionClick(suggestion)}
                                sx={{
                                    color: 'white',
                                    '&:hover': {
                                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                    },
                                    borderBottom:
                                        index < suggestions.length - 1
                                            ? '1px solid rgba(255, 255, 255, 0.1)'
                                            : 'none',
                                }}
                            >
                                <ListItemText
                                    primary={suggestion}
                                    primaryTypographyProps={{
                                        style: {
                                            color: 'white',
                                            fontSize: '1rem',
                                        },
                                    }}
                                />
                            </ListItem>
                        ))}
                    </List>
                </Paper>
            )}
        </div>
    );
};

export default SearchBar;
