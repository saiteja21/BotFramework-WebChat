// UNDO
// import { Activity } from 'botframework-directlinejs';
import { Activity } from './directLine';

export interface FormatOptions {
    showHeader?: boolean; // DEPRECATED: Use "title" instead
}

export interface ActivityOrID {
    activity?: Activity;
    id?: string;
}
