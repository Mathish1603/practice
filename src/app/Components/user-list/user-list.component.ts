import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Students } from 'src/Models/students';
import { UserService } from 'src/Service/user.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent {
  userForm!: FormGroup;
  users: any;
  editMode = false;
  editingUserId: string | null = null;
  @Output() userToEdit = new EventEmitter<Students>();

  constructor(private fb: FormBuilder, private userService: UserService) {
  }

  ngOnChanges(){
    this.loadUsers()
  }

  ngOnInit(): void {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      password: ['', Validators.required]
    });
    this.loadUsers();
  }
  
  loadUsers(): void {
    this.userService.getUsers().subscribe((data) => {
      this.users = data.map((user: any) => ({
        ...user,
        id: user._id
      }));
    });
  }

  editUser(user: Students): void {
  this.userToEdit.emit(user);
    console.log('Edit user received:', user);
    this.userForm.patchValue({
      name: user.name,
      phone: user.phone,
      email: user.email,
      password: user.password,
    });
    this.editingUserId = user.id!;
    this.editMode = true;
  }


  deleteUser(id: string): void {
    this.userService.deleteUser(id).subscribe(() => this.loadUsers());
  }
}

