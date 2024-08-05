import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-discussion-box',
  standalone: true,
  imports: [],
  templateUrl: './discussion-box.component.html',
  styleUrl: './discussion-box.component.css',
})
export class DiscussionBoxComponent {
  @Input() title: string = '';
}
