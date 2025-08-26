import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule,FormBuilder, FormGroup, Validators } from '@angular/forms';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail, Auth } from 'firebase/auth';
import { firebaseConfig } from '../firebase.config';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'] // CORRETO
})
export class LoginComponent {

 
  loginForm: FormGroup;
  forgotPasswordForm: FormGroup;
  showPassword = false;
  loading = false;
  submitted = false;

  showForgotPasswordModal = false;
  forgotPasswordSubmitted = false;
  forgotPasswordMessage = '';
  forgotPasswordError = '';

  errorMessage = '';
  successMessage = '';

  private auth: Auth;

  constructor(private fb: FormBuilder, private router: Router) {
    // Inicializa Firebase
    initializeApp(firebaseConfig);
    this.auth = getAuth();

    // Inicializa formulários
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  get f() { return this.loginForm.controls; }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  // LOGIN
  onSubmit() {
    this.submitted = true;
    if (this.loginForm.invalid) return;

    this.loading = true;
    const { email, password } = this.loginForm.value;

    signInWithEmailAndPassword(this.auth, email, password)
      .then((res: any) => {
    this.successMessage = 'Login realizado com sucesso! Redirecionando...';
    this.loading = false;

    setTimeout(() => {
      this.router.navigate(['/dashboard']);
    }, 1500);
  })
      .catch((err: any) => {
        this.errorMessage = err.message;
        this.loading = false;
      });
  }

  // MODAL DE REDEFINIÇÃO DE SENHA
  openForgotPasswordModal() {
    this.showForgotPasswordModal = true;
    this.forgotPasswordSubmitted = false;
    this.forgotPasswordMessage = '';
    this.forgotPasswordError = '';
    this.forgotPasswordForm.reset();
  }

  closeForgotPasswordModal() {
    this.showForgotPasswordModal = false;
  }

  // RESET PASSWORD
  sendResetLink() {
    this.forgotPasswordSubmitted = true;
    if (this.forgotPasswordForm.invalid) return;

    const email = this.forgotPasswordForm.value.email;

    sendPasswordResetEmail(this.auth, email)
      .then(() => {
        this.forgotPasswordMessage = `Um link de redefinição foi enviado para ${email}`;
        this.forgotPasswordError = '';
        setTimeout(() => this.closeForgotPasswordModal(), 4000);
      })
      .catch((err: any) => {
        this.forgotPasswordError = err.message;
        this.forgotPasswordMessage = '';
      });
  }
}