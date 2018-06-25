import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatListMobileComponent } from './chat-list-mobile.component';

describe('ChatListMobileComponent', () => {
  let component: ChatListMobileComponent;
  let fixture: ComponentFixture<ChatListMobileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChatListMobileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatListMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
