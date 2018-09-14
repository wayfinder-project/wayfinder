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
  comments: string[]=[];

  @ViewChild('content')
  content: NgbActiveModal;
  modal: NgbModalRef;

  @Output()
  close = new EventEmitter<{noteHolder:string[]}>();

  constructor(private modalService: NgbModal) { }

  ngOnInit() {
    // this.comments = this.editMarker.comments;
  }

  // addNote() {
  //   this.notes.push(this.comment);
  // }

  addNote() {
     this.comments.push("");
     console.log("Actually help");
  }
  deleteNote(index: number) {
    this.comments.splice(index, 1);
  }

  open(editMarker: Marker): void {
    this.modal = this.modalService.open(this.content, { centered: true });
    this.editMarker = editMarker;
    this.comments = editMarker.comments || [];
  }

  closeModal(): void {
    this.editMarker.comments = this.comments;
    this.comments = [];
    this.modal.close();
    // this.close.emit({ noteH);
  }

  trackBy(index: number, a: string) {
    return index;
  }

}
