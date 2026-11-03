import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CV } from '../../data/cv.data';
import { SiteFooter } from '../../shared/site-footer';
import { SiteHeader } from '../../shared/site-header';
import { QUICK_COMMANDS } from '../../terminal/commands';
import { Terminal } from '../../terminal/terminal';
import { TerminalService } from '../../terminal/terminal.service';

@Component({
  selector: 'app-home',
  imports: [RouterLink, SiteHeader, SiteFooter, Terminal],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  protected readonly terminal = inject(TerminalService);
  protected readonly cv = CV;
  protected readonly quickCommands = QUICK_COMMANDS;
  protected readonly firstName = CV.name.split(' ')[0];
  protected readonly lastName = CV.name.split(' ').slice(1).join(' ');
}
