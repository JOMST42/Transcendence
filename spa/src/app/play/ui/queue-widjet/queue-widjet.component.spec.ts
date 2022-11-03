import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QueueWidjetComponent } from './queue-widjet.component';

describe('QueueWidjetComponent', () => {
  let component: QueueWidjetComponent;
  let fixture: ComponentFixture<QueueWidjetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QueueWidjetComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QueueWidjetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
