import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterPhotosPage } from './register-photos.page';

describe('RegisterPhotosPage', () => {
  let component: RegisterPhotosPage;
  let fixture: ComponentFixture<RegisterPhotosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterPhotosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
