import React from 'react';
import { Player } from '../types';
interface PlayerTableProps {
    title: 'Skaters' | 'Goalies';
    players: Player[];
}
declare const PlayerTable: React.FC<PlayerTableProps>;
export default PlayerTable;
