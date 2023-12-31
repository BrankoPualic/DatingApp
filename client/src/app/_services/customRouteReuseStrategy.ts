import { DetachedRouteHandle, RouteReuseStrategy } from '@angular/router';

export class CustomRouteReuseStrategy implements RouteReuseStrategy {
  shouldDetach(): boolean {
    return false;
  }
  store(): void {
    return;
  }
  shouldAttach(): boolean {
    return false;
  }
  retrieve(): DetachedRouteHandle | null {
    return null;
  }
  shouldReuseRoute(): boolean {
    return false;
  }
}
