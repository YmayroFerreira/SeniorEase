import { Component, computed, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';

export interface BreadcrumbItem {
  label: string;
  route?: string;
  action?: () => void;
}

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [FontAwesomeModule],
  template: `
    <nav
      class="flex items-center gap-1 text-xs flex-wrap"
      [class]="navClass()"
      aria-label="Navegação"
    >
      @for (item of items(); track item.label; let last = $last) {
        @if (!last) {
          <button
            type="button"
            (click)="handleClick(item)"
            class="transition-colors cursor-pointer bg-transparent border-none p-0 font-medium"
            [class]="linkClass()"
          >
            {{ item.label }}
          </button>
          <fa-icon [icon]="chevronRight" class="text-[0.5rem] opacity-50"></fa-icon>
        } @else {
          <span class="font-semibold" [class]="currentClass()">{{ item.label }}</span>
        }
      }
    </nav>
  `,
})
export class BreadcrumbComponent {
  readonly items = input<BreadcrumbItem[]>([]);
  readonly variant = input<'light' | 'dark'>('light');

  private readonly router = inject(Router);
  protected readonly chevronRight = faChevronRight;

  protected readonly navClass = computed(() =>
    this.variant() === 'dark' ? 'text-primary-light' : 'text-muted',
  );

  protected readonly linkClass = computed(() =>
    this.variant() === 'dark'
      ? 'text-primary-light hover:text-white'
      : 'text-muted hover:text-foreground',
  );

  protected readonly currentClass = computed(() =>
    this.variant() === 'dark' ? 'text-white' : 'text-foreground',
  );

  protected handleClick(item: BreadcrumbItem): void {
    if (item.action) {
      item.action();
    } else if (item.route) {
      this.router.navigate([item.route]);
    }
  }
}
