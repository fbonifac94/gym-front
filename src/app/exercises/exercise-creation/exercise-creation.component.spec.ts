import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExerciseCreationComponent } from './exercise-creation.component';

describe('ExerciseCreationComponent', () => {
  let component: ExerciseCreationComponent;
  let fixture: ComponentFixture<ExerciseCreationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExerciseCreationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExerciseCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
