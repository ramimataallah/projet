import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-privacy',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="simple-page">
      <div class="container">
        <h2>Privacy</h2>
        <p>Privacy policy placeholder. Replace with your site's privacy statement.</p>
      </div>
    </section>
  `,
  styles: [`.simple-page{padding:2rem}.simple-page .container{max-width:900px;margin:0 auto}`]
})
export class PrivacyComponent {}
