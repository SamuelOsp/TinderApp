import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterBirthdatePage } from './register-birthdate.page';

describe('RegisterBirthdatePage', () => {
  let component: RegisterBirthdatePage;
  let fixture: ComponentFixture<RegisterBirthdatePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterBirthdatePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
