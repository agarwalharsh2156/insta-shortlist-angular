import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  isFontAwesomeEnabled = true;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder, 
    private authService: AuthService, 
    private apiService: ApiService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      role: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit(): void {}

  passwordMatchValidator(form: FormGroup) {
    return form.get('password')?.value === form.get('confirmPassword')?.value
      ? null
      : { mismatch: true };
  }

  get name() { return this.registerForm.get('name'); }
  get username() { return this.registerForm.get('username'); }
  get email() { return this.registerForm.get('email'); }
  get role() { return this.registerForm.get('role'); }
  get password() { return this.registerForm.get('password'); }
  get confirmPassword() { return this.registerForm.get('confirmPassword'); }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const registerData = {
        name: this.registerForm.value.name,
        username: this.registerForm.value.username,
        email: this.registerForm.value.email,
        role: this.registerForm.value.role,
        password: this.registerForm.value.password,
      };

      this.apiService.register(registerData).subscribe({
        next: (response) => {
          console.log('Registration successful:', response);
          // Auto-login after successful registration
          const loginCredentials = {
            username: this.registerForm.value.username,
            password: this.registerForm.value.password
          };
          
          this.authService.login(loginCredentials).subscribe({
            next: (loginSuccess) => {
              if (loginSuccess) {
                this.router.navigate(['/dashboard']);
              }
            },
            error: (loginError) => {
              console.error('Auto-login failed:', loginError);
              this.router.navigate(['/login']);
            }
          });
        },
        error: (error) => {
          console.error('Registration failed:', error);
          this.errorMessage = error;
          this.isLoading = false;
        }
      });
    }
  }
}