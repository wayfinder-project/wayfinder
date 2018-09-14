import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal, NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NewUser } from '../../models/user.model';

@Component({
  selector: 'app-user-registration',
  templateUrl: './user-registration.component.html',
  styleUrls: ['./user-registration.component.css']
})
export class UserRegistrationComponent implements OnInit {

  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;

  @ViewChild('content')
  content: NgbActiveModal;
  modal: NgbModalRef;

  @Output()
  close = new EventEmitter<{ user: NewUser, password: string }>();

  constructor(private modalService: NgbModal) { }

  ngOnInit() {
  }

  open(): void {
    this.modal = this.modalService.open(this.content, { centered: true });
  }

  closeModal(): void {
    const user: NewUser = {
      username: this.username,
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email
    };
    const password = this.password;

    this.username = "";
    this.firstName = "";
    this.lastName = "";
    this.email = "";
    this.password = "";

    this.modal.close();
    this.close.emit({ user, password });
  }

}
