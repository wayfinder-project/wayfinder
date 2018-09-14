import {
  Component,
  OnInit,
  ViewChild,
  Output,
  EventEmitter
} from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Marker } from '../../models/marker.model';
import { Waypoint } from '../../models/waypoint.model';


@Component({
  selector: 'app-markeroptions-modal',
  templateUrl: './markeroptions-modal.component.html',
  styleUrls: ['./markeroptions-modal.component.css']
})
export class MarkeroptionsModalComponent implements OnInit {

  @ViewChild('content')
  content: any;
  modal: NgbActiveModal;


  private markerInformation: Marker;

  @Output()
  deleteMarker = new EventEmitter<Marker>();

  constructor(private modalService: NgbModal) {}

  ngOnInit() {
  }

  open(marker: Marker): void {
    this.markerInformation = marker;
    this.modal = this.modalService.open(this.content);
  }

  handleDeleteMarker() {
    this.deleteMarker.emit(this.markerInformation);
    this.modal.close();
  }

}
