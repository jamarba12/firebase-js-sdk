/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  Endpoint,
  HttpMethod,
  performApiRequest,
  performSignInRequest
} from '..';
import { Auth } from '../../model/auth';
import { IdToken, IdTokenResponse } from '../../model/id_token';

export interface SignInWithPasswordRequest {
  returnSecureToken?: boolean;
  email: string;
  password: string;
}

export interface SignInWithPasswordResponse extends IdTokenResponse {
  email: string;
  displayName: string;
}

export async function signInWithPassword(
  auth: Auth,
  request: SignInWithPasswordRequest
): Promise<SignInWithPasswordResponse> {
  return performSignInRequest<
    SignInWithPasswordRequest,
    SignInWithPasswordResponse
  >(auth, HttpMethod.POST, Endpoint.SIGN_IN_WITH_PASSWORD, request);
}

export enum GetOobCodeRequestType {
  PASSWORD_RESET = 'PASSWORD_RESET',
  EMAIL_SIGNIN = 'EMAIL_SIGNIN',
  VERIFY_EMAIL = 'VERIFY_EMAIL',
  VERIFY_AND_CHANGE_EMAIL = 'VERIFY_AND_CHANGE_EMAIL'
}

interface GetOobCodeRequest {
  email?: string; // Everything except VERIFY_AND_CHANGE_EMAIL
  continueUrl?: string;
  iosBundleId?: string;
  iosAppStoreId?: string;
  androidPackageName?: string;
  androidInstallApp?: boolean;
  androidMinimumVersionCode?: string;
  canHandleCodeInApp?: boolean;
  dynamicLinkDomain?: string;
  tenantId?: string;
  targetProjectid?: string;
}

export interface VerifyEmailRequest extends GetOobCodeRequest {
  requestType: GetOobCodeRequestType.VERIFY_EMAIL;
  idToken: IdToken;
}

export interface PasswordResetRequest extends GetOobCodeRequest {
  requestType: GetOobCodeRequestType.PASSWORD_RESET;
  email: string;
  captchaResp?: string;
  userIp?: string;
}

export interface EmailSignInRequest extends GetOobCodeRequest {
  requestType: GetOobCodeRequestType.EMAIL_SIGNIN;
  email: string;
}

interface GetOobCodeResponse {
  email: string;
}

export interface VerifyEmailResponse extends GetOobCodeResponse {}
export interface PasswordResetResponse extends GetOobCodeResponse {}
export interface EmailSignInResponse extends GetOobCodeResponse {}

async function sendOobCode(
  auth: Auth,
  request: GetOobCodeRequest
): Promise<GetOobCodeResponse> {
  return performApiRequest<GetOobCodeRequest, GetOobCodeResponse>(
    auth,
    HttpMethod.POST,
    Endpoint.SEND_OOB_CODE,
    request
  );
}

export async function sendEmailVerification(
  auth: Auth,
  request: VerifyEmailRequest
): Promise<VerifyEmailResponse> {
  return sendOobCode(auth, request);
}

export async function sendPasswordResetEmail(
  auth: Auth,
  request: PasswordResetRequest
): Promise<PasswordResetResponse> {
  return sendOobCode(auth, request);
}

export async function sendSignInLinkToEmail(
  auth: Auth,
  request: EmailSignInRequest
): Promise<EmailSignInResponse> {
  return sendOobCode(auth, request);
}
