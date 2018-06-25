import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConversationMobileComponent } from './conversation-mobile.component';

describe('ConversationMobileComponent', () => {
  let component: ConversationMobileComponent;
  let fixture: ComponentFixture<ConversationMobileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConversationMobileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConversationMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
