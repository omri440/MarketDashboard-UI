import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './shared/components/sidebar/sidebar';
import { HeaderComponent } from './shared/components/header/header';
@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterOutlet, SidebarComponent, HeaderComponent],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard {
  sidebarOpen = signal(false);

  toggleSidebar(): void {
    this.sidebarOpen.set(!this.sidebarOpen());
  }

}



