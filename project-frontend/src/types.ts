// src/types.ts

export interface Player {
    _id: string;
    name: string;
    position: 'Skater' | 'Goalie';
    jerseyNumber: number;
    gamesPlayed: number;
    goals?: number;
    assists?: number;
    points?: number;
    wins?: number;
    goalsAgainstAverage?: number;
    shutouts?: number;
  }
  
  export interface Video {
    url: string;
    title?: string;
  }
  