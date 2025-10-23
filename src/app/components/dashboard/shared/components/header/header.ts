// header.component.ts
import { Component, Output, EventEmitter, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../../services/auth';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Output() toggleSidebar = new EventEmitter<void>();

  currentTime = signal('');
  currentUser = signal('');
  private timeInterval: any;

  constructor(public authService: AuthService) {}

  ngOnInit(): void {
    this.updateTime();
    this.currentUser.set(this.authService.getCurrentUser() || 'User');
    this.timeInterval = setInterval(() => this.updateTime(), 1000);
  }

  ngOnDestroy(): void {
    if (this.timeInterval) clearInterval(this.timeInterval);
  }

  private updateTime(): void {
    const now = new Date();
    this.currentTime.set(
      now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    );
  }

  // onToggleSidebar(): void {
  //   this.toggleSidebar.emit();
  // }
}