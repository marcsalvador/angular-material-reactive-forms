/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, delay } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { StringService } from '../library/string.service';

@Injectable()
export class BaseService {

  public requestOptions: any;
  public token = '';
  public isAdmin = false;

  constructor(
    public http: HttpClient,
    public stringService: StringService
  ) {
  }

  GetToken(model: GetTokenBindingModel): Observable<any> {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
      }),
    };

    const body = 'email=' + encodeURIComponent(model.email) +
      '&username=' + encodeURIComponent(model.username) +
      '&password=' + encodeURIComponent(model.password) +
      '&grant_type=password';

    return this.http.post<any>(environment.apiUrl + 'token', body, options);
  }

  getHeaderToken(requestType?: RequestType): void {

    let contentType = 'application/json';
    if (requestType === RequestType.Get) {
      contentType = 'application/x-www-form-urlencoded';
    }
    // User Authentication
    let authorization = '';
    // if (this.stringService.IsNotEmpty(this.storageService.getItem(AppConstants.Token))) {
    //   const token = JSON.parse(this.storageService.getItem(AppConstants.Token)) as GetTokenViewModel;
    //   if (this.stringService.IsNotEmpty(token)) {
    //     authorization = 'bearer ' + token.access_token;
    //   }
    // }

    // App Authorization
    let appAuthorization = '';
    // const appToken = this.storageService.getItem(AppConstants.AppToken);
    // if (this.stringService.IsNotEmpty(appToken)) {
    //   appAuthorization = appToken;
    // }
    // if (this.stringService.IsNotEmpty(authorization) || this.stringService.IsNotEmpty(appAuthorization)) {
    //   this.requestOptions = {
    //     headers: { 'X-App-Access-Token': appAuthorization, 'Authorization': authorization, 'Content-Type': contentType },
    //   };
    //   return;
    // }

    // API KEY
    let apiKey = '';
    // if (this.stringService.IsNotEmpty(this.config.apiKey)) {
    //   apiKey = this.config.apiKey;
    //   this.requestOptions = {
    //     headers: { 'X-API-Key': apiKey, 'Content-Type': contentType },
    //   };
    //   return;
    // }
  }

  getContent(fileName: string): Observable<any> {
    const url = environment.appUrl + 'assets/content/' + environment.appCode + '/' + fileName;
    return this.http.get(url, { responseType: 'text' });
  }

  sendRequest(actionPath: string, model: any, requestType?: RequestType): Observable<any> {
    if (requestType === undefined || requestType == null) {
      requestType = RequestType.Post;
    }
    //const url = environment.apiUrl + actionPath + (environment.production ? '' : '.json');
    const url = environment.apiUrl + actionPath + ".json";
    this.getHeaderToken(requestType);
    if (requestType === RequestType.Post) {
      return this.post(url, model);
    } else if (requestType === RequestType.Get) {
      return this.get(url, model);
    } else if (requestType === RequestType.Beacon) {
      this.beacon(url, model);
      return new Observable();
    } else {
      return this.post(url, model);
    }
  }

  public post(url: string, model: any): Observable<any> {
    return this.http.post<any>(url, model, this.requestOptions)
      .pipe(delay(200), catchError(this.handleError));
  }

  public get(url: string, model?: any): Observable<any> {
    const params = this.convertModelToParam(model);
    return this.http.get<any>(url + params, this.requestOptions)
      .pipe(delay(200), catchError(this.handleError));
  }

  public beacon(url: string, model?: any): void {
    // Convert model to web form request
    const params = this.convertModelToParam(model);

    // Generate blob data
    const request = new Blob([params], this.requestOptions);

    // Send request using beacon
    navigator.sendBeacon(url, request);
  }

  handleError(error: HttpErrorResponse): any {
    let message = '';
    if (error.status === 401) {
      message = 'Authorization Failed. Please check API Authorization Key.';
    } else if (error.status === 0) {
      message = error.statusText + ', unable to connect to the API.';
    } else if (error.error != null && error.error !== undefined) {
      if (error.error.message != null) {
        message = error.error.message;
      }
      if (error.error.error_description != null) {
        message = error.error.error_description;
      }
    } else {
      return throwError(error);
    }
    return throwError(message);
  }

  convertModelToParam(model: any): string {
    let params = '';
    if (model !== undefined && model != null) {
      params = Object.keys(model)
        .map((k) => k + '=' + model[k])
        .join('&');
      if (this.stringService.IsNotEmpty(params)) {
        params = '?' + params;
      }
    }
    return params;
  }

}

export enum RequestType {
  Post = 0,
  Get = 1,
  Beacon = 2
}


export class GetTokenBindingModel {

  public email = '';
  public password = '';
  public grand_type = '';
  public username = '';
  constructor() {
    this.grand_type = 'password';
  }

}

export class GetTokenViewModel {

  public access_token = '';
  public expires_in = 0;
  public token_type = '';
  public userName = '';
  public created_date = '';

}
