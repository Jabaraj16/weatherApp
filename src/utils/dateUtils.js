/**
 * Utility functions for date and time formatting
 */

/**
 * Format Unix timestamp to readable time (12-hour format)
 * @param {number} timestamp - Unix timestamp in seconds
 * @param {number} timezone - Timezone offset in seconds
 * @returns {string} - Formatted time (e.g., "6:30 AM")
 */
export const formatTime = (timestamp, timezone = 0) => {
    const date = new Date((timestamp + timezone) * 1000);
    const hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();

    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    const displayMinutes = minutes.toString().padStart(2, '0');

    return `${displayHours}:${displayMinutes} ${period}`;
};

/**
 * Format Unix timestamp to readable date
 * @param {number} timestamp - Unix timestamp in seconds
 * @param {number} timezone - Timezone offset in seconds
 * @returns {string} - Formatted date (e.g., "Monday, Dec 29, 2025")
 */
export const formatDate = (timestamp, timezone = 0) => {
    const date = new Date((timestamp + timezone) * 1000);

    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        timeZone: 'UTC'
    };

    return date.toLocaleDateString('en-US', options);
};

/**
 * Format Unix timestamp to local date and time
 * @param {number} timestamp - Unix timestamp in seconds
 * @param {number} timezone - Timezone offset in seconds
 * @returns {string} - Formatted date and time
 */
export const formatDateTime = (timestamp, timezone = 0) => {
    const date = formatDate(timestamp, timezone);
    const time = formatTime(timestamp, timezone);

    return `${date} • ${time}`;
};

/**
 * Get current local time for a timezone
 * @param {number} timezone - Timezone offset in seconds
 * @returns {string} - Current local time
 */
export const getCurrentLocalTime = (timezone = 0) => {
    const now = Math.floor(Date.now() / 1000);
    return formatTime(now, timezone);
};
