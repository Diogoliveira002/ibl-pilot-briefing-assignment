import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'ibl-card',
  imports: [MatCardModule],
  templateUrl: './ibl-card.html',
  styleUrl: './ibl-card.css',
})
export class IblCard {
  @Input() title: string = '';
  @Input() subtitle: string = '';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() appearance: 'outlined' | 'filled' = 'outlined';
  @Input() actionsAlign: 'start' | 'end' = 'start';
}
