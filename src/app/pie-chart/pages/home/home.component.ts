import { Component, Inject, NgZone, PLATFORM_ID } from '@angular/core';
import { SettingService } from '../../services/setting.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  public title = 'AmChart PieChart Configurator';
  public charts;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private zone: NgZone,
    private settingService: SettingService
  ) {
    this.charts = this.settingService.charts
  }

  public add(): void {
    this.settingService.charts.push((++this.settingService.chartsCreated).toString());
  }

  public delete(id: string): void {
    this.settingService.charts.splice(this.settingService.charts.indexOf(id), 1);
    this.browserOnly(() => {
      if (this.settingService.roots[id]?.root) {
        this.settingService.roots[id].root.dispose();
        delete this.settingService.roots[id];
      }
    });
  }

  public trackBy(index: number, item: string): string {
    return item;
  }

  private browserOnly(callback: () => void): void {
    if (isPlatformBrowser(this.platformId)) {
      this.zone.runOutsideAngular(() => {
        callback();
      });
    }
  }
}
