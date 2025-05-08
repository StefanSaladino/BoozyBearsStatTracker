export declare function validatePlayerForm(form: any, position: 'Skater' | 'Goalie'): Record<string, string>;
export declare function validateHighlightForm(data: {
    selectedPlayer: string;
    youtubeUrl: string;
    description: string;
    gameDate: string;
}): Record<string, string>;
export declare function validateHighlightEditForm(form: {
    gameDate: string;
    description: string;
}): Record<string, string>;
