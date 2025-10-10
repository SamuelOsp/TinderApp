import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterPassionsPage } from './register-passions.page';

describe('RegisterPassionsPage', () => {
  let component: RegisterPassionsPage;
  let fixture: ComponentFixture<RegisterPassionsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterPassionsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
