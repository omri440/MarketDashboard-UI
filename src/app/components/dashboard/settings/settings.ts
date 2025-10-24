import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Card } from '../shared/components/card/card';
import { AuthService } from '../../../services/auth';
@Component({
  selector: 'app-settings',
  imports: [CommonModule, Card],
  templateUrl: './settings.html',
  styleUrl: './settings.scss'
})
export class Settings {
  constructor(public authService: AuthService) {}

  currentUser() {
    return this.authService.getCurrentUser();
  }

  currentRole() {
    return this.authService.getCurrentRole();
  }

}
