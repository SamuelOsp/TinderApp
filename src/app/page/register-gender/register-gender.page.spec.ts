import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterGenderPage } from './register-gender.page';

describe('RegisterGenderPage', () => {
  let component: RegisterGenderPage;
  let fixture: ComponentFixture<RegisterGenderPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterGenderPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
