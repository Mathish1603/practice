import { Component, ViewChild } from '@angular/core';
import { Students } from 'src/Models/students';
import { UserListComponent } from './Components/user-list/user-list.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Frontend';
  selectedUser!: Students;

  @ViewChild(UserListComponent) userList!: UserListComponent;

  onUserAdded() {
    this.userList.loadUsers(); // 🔥 refresh list
  }
}
