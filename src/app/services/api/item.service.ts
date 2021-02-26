import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService, RequestType } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class ItemService extends BaseService {

  GetAppAccessToken(): Observable<string> {
    return this.sendRequest('api/WebStaff/get-app-access-token', null, RequestType.Get);
  }

  ValidateAppAccessToken(): Observable<boolean> {
    return this.sendRequest('api/WebStaff/validate-app-access-token', null, RequestType.Get);
  }

  ValidateUserToken(): Observable<boolean> {
    return this.sendRequest('api/WebStaff/validate-user-token', null, RequestType.Get);
  }

  GetCategories(): Observable<any[]> {
    return this.sendRequest('categories', null, RequestType.Get);
  }

  GetProducts(): Observable<any[]> {
    return this.sendRequest('products', null, RequestType.Get);
  }
  
  GetMeasureTypes(): Observable<any[]> {
    return this.sendRequest('measureTypes', null, RequestType.Get);
  }
}
