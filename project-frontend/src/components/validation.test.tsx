// src/utils/__tests__/validateForms.test.ts
import { describe, it, expect } from 'vitest';
import { validatePlayerForm, validateHighlightForm } from '../utils/validateForm';

describe('validatePlayerForm', () => {
  it('validates a skater with correct data', () => {
    const form = {
      name: 'John Doe',
      position: 'Skater',
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
      position: 'Skater',
      gamesPlayed: -1,
      goals: 'abc',
      assists: 3.2
    };
    const errors = validatePlayerForm(form, 'Skater');
    expect(errors.name).toBe('Name is required');
    expect(errors.gamesPlayed).toBe('Games Played must be a non-negative whole number');
    expect(errors.goals).toBe('Goals must be a non-negative whole number');
    expect(errors.assists).toBe('Assists must be a non-negative whole number');
  });

  it('validates a goalie with correct data', () => {
    const form = {
      name: 'Jane Smith',
      position: 'Goalie',
      gamesPlayed: 8,
      wins: 4,
      goalsAgainstAverage: 2.5
    };
    const errors = validatePlayerForm(form, 'Goalie');
    expect(errors).toEqual({});
  });

  it('returns errors for invalid goalie data', () => {
    const form = {
      name: '   ',
      position: 'Goalie',
      gamesPlayed: 5.5,
      wins: -2,
      goalsAgainstAverage: 'bad'
    };
    const errors = validatePlayerForm(form, 'Goalie');
    expect(errors.name).toBe('Name is required');
    expect(errors.gamesPlayed).toBe('Games Played must be a non-negative whole number');
    expect(errors.wins).toBe('Wins must be a non-negative whole number');
    expect(errors.goalsAgainstAverage).toBe('GAA must be a non-negative number');
  });
});

describe('validateHighlightForm', () => {
  it('validates correct highlight data', () => {
    const today = new Date();
    
    const form = {
      selectedPlayer: '123',
      file: new File(['video'], 'highlight.mp4'),
      description: 'Great play',
      gameDate: today.toISOString()
    };
    const errors = validateHighlightForm(form);
    expect(errors).toEqual({});
  });

  it('returns errors for missing or invalid highlight data', () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const form = {
      selectedPlayer: '',
      file: null,
      description: '  ',
      gameDate: tomorrow
    };
    const errors = validateHighlightForm(form);
    expect(errors.selectedPlayer).toBe('Please select a player');
    expect(errors.file).toBe('A video file is required');
    expect(errors.description).toBe('Description is required');
    expect(errors.gameDate).toBe('Game date must not be after today');
  });
});
