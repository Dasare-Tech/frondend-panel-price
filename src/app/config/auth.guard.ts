import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '../firebase.config';

// Inicializa Firebase (se ainda não inicializado)
const app = initializeApp(firebaseConfig);

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const auth = getAuth();

  return new Promise<boolean>((resolve) => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        resolve(true); // usuário logado, libera rota
      } else {
        router.navigate(['/login']);
        resolve(false); // redireciona para login
      }
    });
  });
};
