import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PongAudioComponent } from './pong-audio.component';

describe('PongAudioComponent', () => {
  let component: PongAudioComponent;
  let fixture: ComponentFixture<PongAudioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PongAudioComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PongAudioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
