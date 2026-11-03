import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

/**
 * Renders text and highlights any `[PLACEHOLDER]` parts so unfinished
 * content is easy to spot. Colour comes from the `--ph-color` custom property.
 */
@Component({
  selector: 'app-ph',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `@for (part of parts(); track $index) {@if (part.placeholder) {<span class="ph">{{ part.text }}</span>} @else {<ng-container>{{ part.text }}</ng-container>}}`,
  styles: `
    .ph {
      color: var(--ph-color, inherit);
    }
  `,
})
export class PlaceholderText {
  readonly text = input.required<string>();

  protected readonly parts = computed(() =>
    this.text()
      .split(/(\[[^\]]+\])/)
      .filter(Boolean)
      .map((text) => ({ text, placeholder: text.startsWith('[') && text.endsWith(']') })),
  );
}
