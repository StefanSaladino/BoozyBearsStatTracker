// src/utils/__tests__/validateForms.test.ts

import { describe, it, expect } from 'vitest';
import { validatePlayerForm, validateHighlightForm } from '../utils/validateForm';

describe('validatePlayerForm', () => {
  it('validates a skater with correct data', () => {
    const form = {
      name: 'John Doe',
      jerseyNumber: 10,
      gamesPlayed: 10,
      goals: 5,
      assists: 7
    };
    const errors = validatePlayerForm(form, 'Skater');
    expect(errors).toEqual({});
  });

  it('returns errors for invalid skater data', () => {
    const form = {
      name: '',
      jerseyNumber: -1,
      gamesPlayed: -1,
      goals: 'abc' as any,
      assists: 3.2 as any
    };
    const errors = validatePlayerForm(form, 'Skater');
    expect(errors.name).toBe('Name is required');
    expect(errors.jerseyNumber).toBe('Jersey Number must be a whole number between 0 and 99');
    expect(errors.gamesPlayed).toBe('Games Played must be a non-negative whole number');
    expect(errors.goals).toBe('Goals must be a non-negative whole number');
    expect(errors.assists).toBe('Assists must be a non-negative whole number');
  });

  it('validates a goalie with correct data', () => {
    const form = {
      name: 'Jane Smith',
      jerseyNumber: 30,
      gamesPlayed: 8,
      wins: 4,
      goalsAgainstAverage: 2.5,
      shutouts: 1
    };
    const errors = validatePlayerForm(form, 'Goalie');
    expect(errors).toEqual({});
  });

  it('returns errors for invalid goalie data', () => {
    const form = {
      name: '   ',
      jerseyNumber: 5.5 as any,
      gamesPlayed: 5.5 as any,
      wins: -2,
      goalsAgainstAverage: 'bad' as any,
      shutouts: -1
    };
    const errors = validatePlayerForm(form, 'Goalie');
    expect(errors.name).toBe('Name is required');
    expect(errors.jerseyNumber).toBe('Jersey Number must be a whole number between 0 and 99');
    expect(errors.gamesPlayed).toBe('Games Played must be a non-negative whole number');
    expect(errors.wins).toBe('Wins must be a non-negative whole number');
    expect(errors.goalsAgainstAverage).toBe('GAA must be a non-negative number');
    expect(errors.shutouts).toBe('Shutouts must be a non-negative whole number');
  });
});

describe('validateHighlightForm', () => {
  it('validates correct highlight data with YouTube URL', () => {
    const today = new Date().toISOString().slice(0, 10);
    const form = {
      selectedPlayer: '123',
      youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      description: 'Great play',
      gameDate: today
    };
    const errors = validateHighlightForm(form);
    expect(errors).toEqual({});
  });

  it('returns errors for missing or invalid highlight data', () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const form = {
      selectedPlayer: '',
      youtubeUrl: 'not-a-valid-url',
      description: '   ',
      gameDate: tomorrow.toISOString().slice(0, 10)
    };
    const errors = validateHighlightForm(form);
    expect(errors.selectedPlayer).toBe('Player is required.');
    expect(errors.youtubeUrl).toBe('Valid YouTube URL is required.');
    expect(errors.description).toBe('Description is required.');
    expect(errors.gameDate).toBe('Valid game date is required (not in the future).');
  });
});
