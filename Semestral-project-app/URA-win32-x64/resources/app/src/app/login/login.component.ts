import { AfterViewInit, Component, ElementRef, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements AfterViewInit {
  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngAfterViewInit() {
    const container = this.el.nativeElement.querySelector('#container');
    const registerBtn = this.el.nativeElement.querySelector('#register');
    const loginBtn = this.el.nativeElement.querySelector('#login');

    this.renderer.listen(registerBtn, 'click', () => {
      this.renderer.addClass(container, 'active');
    });

    this.renderer.listen(loginBtn, 'click', () => {
      this.renderer.removeClass(container, 'active');
    });
  }
}
