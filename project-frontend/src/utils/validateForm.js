// src/utils/validateForm.ts
export function validatePlayerForm(form, position) {
    const errors = {};
    if (!form.name || form.name.trim() === '') {
        errors.name = 'Name is required';
    }
    if (!Number.isInteger(form.jerseyNumber) || form.jerseyNumber < 0 || form.jerseyNumber > 99) {
        errors.jerseyNumber = 'Jersey Number must be a whole number between 0 and 99';
    }
    if (!Number.isInteger(form.gamesPlayed) || form.gamesPlayed < 0) {
        errors.gamesPlayed = 'Games Played must be a non-negative whole number';
    }
    if (position === 'Skater') {
        if (!Number.isInteger(form.goals) || form.goals < 0) {
            errors.goals = 'Goals must be a non-negative whole number';
        }
        if (!Number.isInteger(form.assists) || form.assists < 0) {
            errors.assists = 'Assists must be a non-negative whole number';
        }
    }
    else {
        if (!Number.isInteger(form.wins) || form.wins < 0) {
            errors.wins = 'Wins must be a non-negative whole number';
        }
        if (typeof form.goalsAgainstAverage !== 'number' || form.goalsAgainstAverage < 0) {
            errors.goalsAgainstAverage = 'GAA must be a non-negative number';
        }
        if (!Number.isInteger(form.shutouts) || form.shutouts < 0) {
            errors.shutouts = 'Shutouts must be a non-negative whole number';
        }
    }
    return errors;
}
export function validateHighlightForm(data) {
    const errors = {};
    if (!data.selectedPlayer) {
        errors.selectedPlayer = "Player is required.";
    }
    if (!data.youtubeUrl ||
        !/^https:\/\/(www\.)?youtube\.com\/watch\?v=/.test(data.youtubeUrl)) {
        errors.youtubeUrl = "Valid YouTube URL is required.";
    }
    if (!data.description.trim()) {
        errors.description = "Description is required.";
    }
    if (!data.gameDate || new Date(data.gameDate) > new Date()) {
        errors.gameDate = "Valid game date is required (not in the future).";
    }
    return errors;
}
//Validation specifically for editing existing highlight (no file/player needed)
export function validateHighlightEditForm(form) {
    const errors = {};
    if (!form.gameDate) {
        errors.gameDate = "Game date is required.";
    }
    else if (new Date(form.gameDate) > new Date()) {
        errors.gameDate = "Game date cannot be in the future.";
    }
    if (!form.description.trim()) {
        errors.description = "Description is required.";
    }
    return errors;
}
