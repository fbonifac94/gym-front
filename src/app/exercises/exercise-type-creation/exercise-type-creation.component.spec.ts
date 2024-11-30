import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExerciseTypeCreationComponent } from './exercise-type-creation.component';

describe('ExerciseTypeCreationComponent', () => {
  let component: ExerciseTypeCreationComponent;
  let fixture: ComponentFixture<ExerciseTypeCreationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExerciseTypeCreationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExerciseTypeCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
