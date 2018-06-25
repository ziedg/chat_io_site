import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatListItemMobileComponent } from './chat-list-item-mobile.component';

describe('ChatListItemMobileComponent', () => {
  let component: ChatListItemMobileComponent;
  let fixture: ComponentFixture<ChatListItemMobileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChatListItemMobileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatListItemMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
