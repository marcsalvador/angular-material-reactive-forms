import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StringService {

  public IsEmpty(str: any): boolean {
    if (typeof str === 'string' || str instanceof String) {
      const x = str.toString().trim();
      if (x === null ||
            x === undefined ||
            x === '') {
        return true;
      }
    } else {
      if (str == null ||
            str == undefined) {
        return true;
      }
    }
    return false;
  }

  public IsNotEmpty(str: any): boolean {
    if (typeof str === 'string' || str instanceof String) {
      const x = str.toString().trim();
      if (x != null &&
            x != undefined &&
            x != '' &&
            x != 'null') {
        return true;
      }
    } else {
      if (str != null &&
            str != undefined &&
            str != 'null') {
        return true;
      }
    }
    return false;
  }

  public IsInvalidEmail(email: string): boolean {
    if (email == '' ||
        email == undefined ||
        email == null) {
      return true;
    }

    // eslint-disable-next-line max-len
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (!re.test(email)) {
      return true;
    }

    return false;
  }

  public IsNotNumberic(inputtedTxt: any): boolean {
    if (isNaN(inputtedTxt)) {
      return true;
    }
    return false;
  }

  public IsNotStrongPassword(inputtxt: any): boolean {
    const decimal = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;
    if (inputtxt.match(decimal)) {
      return false;
    } else {
      return true;
    }
  }

  public IsInvalidPassword(password: string): boolean {
    if (password == undefined ||
        password == null ||
        password == '' ||
        password.trim() == '') {
      return true;
    }

    if (password.length < 6) {
      return true;
    } else if (password.search(/\d/) == -1) {
      return true;
    }

    return false;
  }

  public lessText(str: string, len: number): string {
    if (this.IsEmpty(str) || str.length < len) {
      return str;
    }
    return str.substring(1, len) + '...';
  }

}
