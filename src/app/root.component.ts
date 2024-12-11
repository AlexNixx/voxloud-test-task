import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  template: `
    <router-outlet class="hidden" aria-hidden="true" />
    <footer><h4>Designed and Coded by <a href="https://github.com/AlexNixx">Alex</a></h4></footer>
  `,
  styleUrl: './root.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [RouterOutlet],
})
export class RootComponent {}
