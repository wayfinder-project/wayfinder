/**
 * The status of a checklist item.
 */
export enum ChecklistItemStatus {
  /**
   * The item has been created but not completed.
   */
  Created = 'CREATED',
  /**
   * The item has been completed.
   */
  Done = 'DONE',
}

/**
 * A single item in a checklist.
 */
export interface ChecklistItem {
  id?: number;
  /**
   * The title (contents) of the item (e.g. "pack phone charger").
   */
  title: string;
  status: ChecklistItemStatus;
}

export interface Checklist {
  id?: number;
  /**
   * The items contained in the checklist.
   */
  items: ChecklistItem[];
}
