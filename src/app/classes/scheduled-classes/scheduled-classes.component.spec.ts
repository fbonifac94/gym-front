import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduledClassesComponent } from './scheduled-classes.component';

describe('ScheduledClassesComponent', () => {
  let component: ScheduledClassesComponent;
  let fixture: ComponentFixture<ScheduledClassesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScheduledClassesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScheduledClassesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
