import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../../services/user/user.service';
import { UserWithId } from '../../models/user.model';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';






@Component({
  selector: 'app-userpage',
  templateUrl: './userpage.component.html',
  styleUrls: ['./userpage.component.css'],
})
export class UserpageComponent implements OnInit {
  // User information
  user: UserWithId;

  // Password
  password: string;
  inputPassword1: string;
  inputPassword2: string;




  constructor(private userService: UserService, private modalService: NgbModal) {}

  ngOnInit() {
    this.userService.getCurrentUser().subscribe(user => {
      this.user = user;
    });
  }


  update() {
    this.userService.update(this.user).subscribe(_ => {
      alert('Update successful!');
    });
  }

  updatePassword() {
    const toConfirm = prompt(
      'Are you sure you want to change your password? \n Enter CONFIRM if so.'
    );
    if (toConfirm === 'CONFIRM') {
      if (this.inputPassword1 !== this.inputPassword2) {
        alert('New passwords do not match.');
      } else {
        this.userService
          .updatePassword(this.user.id, this.password, this.inputPassword1)
          .subscribe(
            () => {
              this.password = this.inputPassword1 = this.inputPassword2 = '';
              alert('Password updated!');
            },
            _ => {
              alert('Incorrect password.');
            }
          );
      }
    }
  }
}
