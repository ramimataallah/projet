import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="simple-page">
      <div class="container">
        <h2>Categories</h2>
        <p>List news categories here (e.g., business, technology, sports).</p>
      </div>
    </section>
  `,
  styles: [`.simple-page{padding:2rem}.simple-page .container{max-width:900px;margin:0 auto}`]
})
export class CategoriesComponent {}
