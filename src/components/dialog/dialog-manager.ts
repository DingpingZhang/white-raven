import { ReactNode } from 'react';

export type DialogEntity = { id: string; dialog: ReactNode };

export default class DialogManager {
  private dialogEntities: Array<DialogEntity>;

  private currentDialogEntity?: DialogEntity;

  private setCurrentDialig: (dialog: ReactNode | undefined) => void;

  constructor(setCurrentDialog: (dialog: ReactNode | undefined) => void) {
    this.dialogEntities = new Array<DialogEntity>();
    this.setCurrentDialig = setCurrentDialog;
  }

  show(id: string, dialog: ReactNode): void {
    if (!dialog) return;

    if (this.currentDialogEntity) {
      this.dialogEntities.push(this.currentDialogEntity);
    }

    this.setCurrentDialogEntity({ id, dialog });
  }

  close(id: string): void {
    if (this.currentDialogEntity?.id === id) {
      // 1. Close current dialog:
      this.setCurrentDialogEntity(this.dialogEntities.pop());
    } else {
      // 2. Close the dialog in the stack:
      const index = this.dialogEntities.findIndex(entity => entity.id === id);
      if (index !== -1) {
        this.dialogEntities.splice(index, 1);
      }
    }
  }

  private setCurrentDialogEntity(entity: DialogEntity | undefined): void {
    this.currentDialogEntity = entity;
    this.setCurrentDialig(entity ? entity.dialog : undefined);
  }
}
