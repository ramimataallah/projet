import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-careers',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="simple-page">
      <div class="container">
        <h2>Careers</h2>
        <p>We're hiring! This is a placeholder careers page — replace with real opportunities.</p>
      </div>
    </section>
  `,
  styles: [`.simple-page{padding:2rem}.simple-page .container{max-width:900px;margin:0 auto}`]
})
export class CareersComponent {}
