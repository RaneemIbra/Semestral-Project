import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DiscussionBoxComponent } from '../discussion-box/discussion-box.component';

@Component({
  selector: 'app-discussion-preview',
  standalone: true,
  imports: [CommonModule, DiscussionBoxComponent],
  templateUrl: './discussion-preview.component.html',
  styleUrls: ['./discussion-preview.component.css'],
})
export class DiscussionPreviewComponent implements OnInit {
  title: string = '';

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.title = params.get('title') || '';
    });
  }
}
