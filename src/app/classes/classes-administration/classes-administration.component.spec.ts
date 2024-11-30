import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassesAdministrationComponent } from './classes-administration.component';

describe('ClassesAdministrationComponent', () => {
  let component: ClassesAdministrationComponent;
  let fixture: ComponentFixture<ClassesAdministrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClassesAdministrationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClassesAdministrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
