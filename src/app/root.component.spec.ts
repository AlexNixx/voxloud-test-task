import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { RootComponent } from './root.component';

describe('RootComponent', () => {
  let component: RootComponent;
  let fixture: ComponentFixture<RootComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RootComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RootComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('init', () => {
    it('should to be defined', () => {
      expect(component).toBeDefined();
    });
  });

  describe('ui', () => {
    it('should render the router-outlet with correct attributes', () => {
      const routerOutlet = fixture.debugElement.query(By.css('router-outlet'));
      expect(routerOutlet).toBeTruthy();
      expect(routerOutlet.attributes['class']).toBe('hidden');
      expect(routerOutlet.attributes['aria-hidden']).toBe('true');
    });

    it('should render the footer with developer credit', () => {
      const footer = fixture.debugElement.query(By.css('footer'));
      expect(footer).toBeTruthy();

      const footerText = footer.nativeElement.querySelector('h4').textContent.trim();
      expect(footerText).toContain('Designed and Coded by');

      const footerLink = footer.nativeElement.querySelector('a');
      expect(footerLink).toBeTruthy();
      expect(footerLink.getAttribute('href')).toBe('https://github.com/AlexNixx');
      expect(footerLink.textContent.trim()).toBe('Alex');
    });
  });
});
