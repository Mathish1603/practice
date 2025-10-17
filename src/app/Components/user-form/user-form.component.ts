import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/Service/user.service';
import { Students } from 'src/Models/students';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent {

  userForm!: FormGroup;
  users: Students[] = [];
  editMode = false;
  editingUserId: string | null = null;
  message: string | undefined;
  hidePassword = true;
  @Input() editUser!: Students;

ngOnChanges() {
  if (this.editUser) {
    this.userForm.patchValue(this.editUser);
    this.editingUserId = this.editUser.id ?? null;
    this.editMode = true;
  }
}


  constructor(private fb: FormBuilder, private userService: UserService) { }


  ngOnInit(): void {
    this.userForm = this.fb.group({
      name: ['', [
        Validators.required,
        Validators.pattern(/^[A-Za-z ]+$/)
      ]],
       phone: ['', [
        Validators.required,
        Validators.pattern(/^[0-9]{10}$/),
        Validators.maxLength(10),
      ]],
      email: ['', [
        Validators.required,
        Validators.email
      ]],
      password:['',[
        Validators.required,
        Validators.pattern(/^(?=.*[!@#$%^&*(),.?":{}|<>])/)
      ]]
    });
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe((data) => (this.users = data));
  }

  
  // onSubmit(): void {
  //   if (this.userForm.invalid) return;

  //   const formValue = this.userForm.value;

  //   if (this.editMode && this.editingUserId) {
  //     this.userService.updateUser(this.editingUserId, formValue).subscribe(() => {
  //       this.editMode = false;
  //       this.editingUserId = null;
  //       this.userForm.reset();
  //       this.loadUsers();
  //     });
  //   } else {
  //     this.userService.createUser(formValue).subscribe(() => {
  //       this.loadUsers();
  //       this.userForm.reset();
  //     });
  //   }
  // }

  @Output() userAdded = new EventEmitter<void>();

onSubmit(): void {
  if (this.userForm.invalid) return;

  const formValue = this.userForm.value;

  if (this.editMode && this.editingUserId) {
    this.userService.updateUser(this.editingUserId, formValue).subscribe(() => {
      this.editMode = false;
      this.editingUserId = null;
      this.userForm.reset();
      this.userAdded.emit(); // 🔥 notify parent
    });
  } else {
    this.userService.createUser(formValue).subscribe(() => {
      this.userForm.reset();
      this.userAdded.emit(); // 🔥 notify parent
    });
  }
}



  startEditUser(user: Students): void {
    this.userForm.patchValue(user);
    this.editingUserId = user.id!;
    this.editMode = true;
  }

  deleteUser(id: string): void {
    this.userService.deleteUser(id).subscribe(() => this.loadUsers());
  }

  cancelEdit(): void {
    this.userForm.reset();
    this.editMode = false;
    this.editingUserId = null;
  }
}
