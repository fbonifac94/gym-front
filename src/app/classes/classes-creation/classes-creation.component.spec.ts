import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassesCreationComponent } from './classes-creation.component';

describe('ClassesCreationComponent', () => {
  let component: ClassesCreationComponent;
  let fixture: ComponentFixture<ClassesCreationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClassesCreationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClassesCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
