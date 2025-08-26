import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { getAuth, signOut } from 'firebase/auth';
@Component({
  selector: 'app-menu-global',
  standalone: true,
  imports: [],
  templateUrl: './menu-global.component.html',
  styleUrl: './menu-global.component.scss'
})
export class MenuGlobalComponent {

    private auth = getAuth();

  constructor(private router: Router) {}

  logout() {
    signOut(this.auth).then(() => {
      this.router.navigate(['/login']);
    });
  }

}
