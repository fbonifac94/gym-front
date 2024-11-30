import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassesInscriptionsComponent } from './classes-inscriptions.component';

describe('ClassesInscriptionsComponent', () => {
  let component: ClassesInscriptionsComponent;
  let fixture: ComponentFixture<ClassesInscriptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClassesInscriptionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClassesInscriptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
