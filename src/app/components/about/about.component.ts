import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="simple-page">
      <div class="container">
        <h2>About</h2>
        <p>This is a lightweight About page placeholder. Replace with real company information.</p>
      </div>
    </section>
  `,
  styles: [
    `
      .simple-page{padding:2rem}
      .simple-page .container{max-width:900px;margin:0 auto}
    `
  ]
})
export class AboutComponent {}
