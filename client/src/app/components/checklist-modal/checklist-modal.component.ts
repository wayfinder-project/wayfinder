import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewChild,
} from '@angular/core';
import {
  Checklist,
  ChecklistItem,
  ChecklistItemStatus,
} from '../../models/checklist.model';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-checklist-modal',
  templateUrl: './checklist-modal.component.html',
  styleUrls: ['./checklist-modal.component.css'],
})
export class ChecklistModalComponent implements OnInit {
  @Input()
  checklist: Checklist = { items: [] };
  completedItems: ChecklistItem[] = [];
  uncompletedItems: ChecklistItem[] = [];
  @Output()
  close = new EventEmitter<Checklist>();

  @ViewChild('content')
  content: any;
  modal: NgbActiveModal;

  constructor(private modalService: NgbModal) {}

  ngOnInit() {
    this.refreshItems();
  }

  addItem(): void {
    this.checklist.items.push({
      title: '',
      status: ChecklistItemStatus.Created,
    });
    this.refreshItems();
  }

  check(item: ChecklistItem): void {
    item.status = ChecklistItemStatus.Done;
    this.refreshItems();
  }

  uncheck(item: ChecklistItem): void {
    item.status = ChecklistItemStatus.Created;
    this.refreshItems();
  }

  handleClose(): void {
    this.close.emit(this.checklist);
    this.modal.close();
  }

  open(): void {
    this.modalService.open(this.content, { ariaLabelledBy: 'modal-title' });
  }

  private getCompleted(): ChecklistItem[] {
    return this.checklist.items.filter(
      item => item.status === ChecklistItemStatus.Done
    );
  }

  private getUncompleted(): ChecklistItem[] {
    return this.checklist.items.filter(
      item => item.status === ChecklistItemStatus.Created
    );
  }

  private refreshItems(): void {
    this.completedItems = this.getCompleted();
    this.uncompletedItems = this.getUncompleted();
  }
}
