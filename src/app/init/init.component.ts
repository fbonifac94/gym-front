import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-init',
  standalone: true,
  imports: [MatCardModule],
  templateUrl: './init.component.html',
  styleUrl: './init.component.css',
})
export class InitComponent {}
