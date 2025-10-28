import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
// import { HomeComponent } from './components/home.component';
import { HeaderComponent } from './layout/header.component';
import { SidebarComponent } from './layout/sidebar.component';
import { FooterComponent } from './layout/footer.component';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, SidebarComponent, FooterComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('CreaPrint');
}
