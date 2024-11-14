import { Component } from '@angular/core';

@Component({
  selector: 'app-contact-us',
  standalone: true,
  imports: [],
  templateUrl: './contact-us.component.html',
  styleUrl: './contact-us.component.css',
})
export class ContactUsComponent {
  ngOnInit(): void {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('show');
        } else {
          entry.target.classList.remove('show');
        }
      });
    });

    const hiddenElements = document.querySelectorAll('.hidden');
    hiddenElements.forEach((el) => observer.observe(el));

    const form = document.getElementById('contactForm') as HTMLFormElement;
    const submitButton = document.getElementById(
      'submitBtn'
    ) as HTMLButtonElement;

    form.addEventListener('submit', (event) => {
      event.preventDefault();

      const nameInput = document.getElementById('name') as HTMLInputElement;
      const emailInput = document.getElementById('email') as HTMLInputElement;
      const subjectInput = document.getElementById(
        'subject'
      ) as HTMLInputElement;
      const messageInput = document.getElementById(
        'message'
      ) as HTMLTextAreaElement;

      if (
        nameInput.value.trim() !== '' &&
        emailInput.value.trim() !== '' &&
        subjectInput.value.trim() !== '' &&
        messageInput.value.trim() !== ''
      ) {
        alert('Your message has been received!');

        nameInput.value = '';
        emailInput.value = '';
        subjectInput.value = '';
        messageInput.value = '';
      } else {
        alert('Please fill out all fields.');
      }
    });
  }
}
