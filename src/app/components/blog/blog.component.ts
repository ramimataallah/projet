import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="simple-page">
      <div class="container">
        <h2>Blog</h2>
        <p>Placeholder for blog posts. Add integration or list of posts here.</p>
      </div>
    </section>
  `,
  styles: [`.simple-page{padding:2rem}.simple-page .container{max-width:900px;margin:0 auto}`]
})
export class BlogComponent {}
