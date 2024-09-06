import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalyzeCompatabilityComponent } from './analyze-compatibility.component';

describe('AnalyzeCompatabilityComponent', () => {
  let component: AnalyzeCompatabilityComponent;
  let fixture: ComponentFixture<AnalyzeCompatabilityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnalyzeCompatabilityComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnalyzeCompatabilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
