// sidebar.component.ts
import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../../../services/auth';

interface NavItem {
  label: string;
  route: string;
  icon: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss'
})
export class SidebarComponent {
  @Input() isOpen = signal(true);
  @Output() toggle = new EventEmitter<void>();

  navItems: NavItem[] = [
    { label: 'Home', route: '/dashboard', icon: '🏠' },
    { label: 'Journal', route: '/dashboard/journal', icon: '📔' },
    { label: 'Scanner', route: '/dashboard/scanner', icon: '📊' },
    { label: 'Portfolio', route: '/dashboard/portfolio', icon: '💼' },
    { label: 'Analytics', route: '/dashboard/analytics', icon: '📈' },
    { label: 'Broker', route: '/dashboard/broker', icon: '🔌' },
    { label: 'Settings', route: '/dashboard/settings', icon: '⚙️' }
  ];

  constructor(public authService: AuthService) {}

  toggleSidebar(): void {
    this.toggle.emit();
  }

  logout(): void {
    this.authService.logout();
  }
}