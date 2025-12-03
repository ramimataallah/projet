import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-terms',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="simple-page">
      <div class="container">
        <h2>Terms</h2>
        <p>Terms and conditions placeholder. Add legal terms for your site here.</p>
      </div>
    </section>
  `,
  styles: [`.simple-page{padding:2rem}.simple-page .container{max-width:900px;margin:0 auto}`]
})
export class TermsComponent {}
