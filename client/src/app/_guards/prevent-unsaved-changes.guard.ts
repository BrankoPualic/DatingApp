import { CanDeactivateFn } from '@angular/router';
import { MemberEditComponent } from '../members/member-edit/member-edit.component';
import { inject } from '@angular/core';
import { ConfirmService } from '../_services/confirm.service';
import { Observable, of } from 'rxjs';

export const preventUnsavedChangesGuard: CanDeactivateFn<
  MemberEditComponent
> = (component: MemberEditComponent): Observable<boolean> => {
  if (component.editForm?.dirty) return inject(ConfirmService).confirm();
  return of(true);
};
