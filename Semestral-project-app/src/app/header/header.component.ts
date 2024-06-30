import { Component, EventEmitter, Output } from '@angular/core';
import { RouterModule } from '@angular/router';

declare global {
  interface Window {
    require: any;
    process: any;
  }
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  @Output() refreshPage = new EventEmitter<void>();

  onRefreshPage() {
    this.refreshPage.emit();
  }
}
