import {SnackbarType} from "./snackbarType";

export interface SnackbarState {
    isOpen: boolean;
    type: SnackbarType;
    text: string;
}