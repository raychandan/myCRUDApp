import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  private readonly _authToken: string = 'AccessToken';
	private readonly _userDetails: string = 'user_details';

  constructor() { }

  getAuthToken(): string {
		if (localStorage.getItem(this._authToken) !== null) {
			return localStorage.getItem(this._authToken)!;
		}
		return '';
	}


	setAuthToken(value: string) {
		if (value !== null && value !== '' && value !== undefined) {
			localStorage.setItem(this._authToken, value);
		}
		else {
			if (localStorage.getItem(this._authToken) !== null) {
				localStorage.removeItem(this._authToken);
			}
		}
	}

	getUserDetails() {
		if (this.getAuthToken() !== null) {
			let userDetails = localStorage.getItem(this._userDetails)!;
			return JSON.parse(userDetails);
		}
		return null;
	}

	setUserDetails(value: any) {
		if (value !== null && value !== undefined) {
			let userObj = {
        "Name": value.Name,
        "Email": value.Email,
        "ResetPasswordToken": value.ResetPasswordToken,
        "_id": value._id,
        "IsSocialLogin": value.IsSocialLogin
      };
			localStorage.setItem(this._userDetails, JSON.stringify((userObj)));
		}
		else {
			if (localStorage.getItem(this._userDetails) !== null) {
				localStorage.removeItem(this._userDetails);
			}
		}
	}
}
