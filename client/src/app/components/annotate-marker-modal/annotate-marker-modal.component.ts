import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal, NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Marker } from '../../models/marker.model';

@Component({
  selector: 'app-annotate-marker-modal',
  templateUrl: './annotate-marker-modal.component.html',
  styleUrls: ['./annotate-marker-modal.component.css']
})
export class AnnotateMarkerModalComponent implements OnInit {

  editMarker: Marker;
  comment: string;
  notes: string[]=[];

  @ViewChild('content')
  content: NgbActiveModal;
  modal: NgbModalRef;

  @Output()
  close = new EventEmitter<{noteHolder:string[]}>();

  constructor(private modalService: NgbModal) { }

  ngOnInit() {
  }

  // addNote() {
  //   this.notes.push(this.comment);
  // }

  addNote() {
     this.notes.push(this.comment);
  }
  deleteNote(index: number) {
    this.notes.splice(index, 1);
  }

  open(editMarker: Marker): void {
    this.modal = this.modalService.open(this.content, { centered: true });
    this.editMarker = editMarker;
    this.notes = editMarker.notes || [];
  }

  closeModal(): void {
    this.editMarker.notes = this.notes;
    this.notes = [];
    this.modal.close();
    // this.close.emit({ noteH);
  }

  trackBy(index: number, a: string) {
    return index;
  }

}
