import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ListCodesComponent} from './list-codes.component';

describe('ListCodesComponent', () => {
  let component: ListCodesComponent;
  let fixture: ComponentFixture<ListCodesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListCodesComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListCodesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
