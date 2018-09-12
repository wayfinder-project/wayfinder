import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal, NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-annotate-marker-modal',
  templateUrl: './annotate-marker-modal.component.html',
  styleUrls: ['./annotate-marker-modal.component.css']
})
export class AnnotateMarkerModalComponent implements OnInit {

  comment: string;
  notes: string[];

  @ViewChild('content')
  content: NgbActiveModal;
  modal: NgbModalRef;

  @Output()
  close = new EventEmitter<{/* To be added */}>();

  constructor(private modalService: NgbModal) { }

  ngOnInit() {
    this.notes = [];
  }

  // addNote() {
  //   this.notes.push(this.comment);
  // }

  addNote() {
     this.notes.push(this.comment);
   }

  open(): void {
    this.modal = this.modalService.open(this.content, { centered: true });
  }

  closeModal(): void {
    this.modal.close();
    this.close.emit({ /* */ });
  }

  trackBy(index: number, a: string) {
    return index;
  }

}
