/**
 * @license
 * Copyright 2019 Google Inc.
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

import { expect } from 'chai';
import { firebase } from '@firebase/app';
import { UserCredential } from '../../src/model/user_credential';
import { initializeAuth } from '../../src/core/initialize_auth';
import { FirebaseApp } from '@firebase/app-types';

import * as PROJECT_CONFIG from '../../../../config/project.json';
import { Provider } from '../../src/model/id_token';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from '../../src/core/strategies/email_and_password';

describe('signUp & signInWithEmailAndPassword', () => {
  let app: FirebaseApp;

  before(() => {
    app = firebase.initializeApp(
      { apiKey: PROJECT_CONFIG.apiKey, projectId: PROJECT_CONFIG.projectId },
      'test-app-auth-test'
    );
  });

  it('should work', async () => {
    const auth = initializeAuth(app);

    const email = `test-user-${Date.now()}@example.com`;
    const password = Math.random().toString(36).substring(2,15);

    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    expect(userCredential).to.be.instanceOf(UserCredential);
    expect(userCredential.user.refreshToken).to.not.be.empty;
    expect(userCredential.user.isAnonymous).to.be.false;
    expect(userCredential.user.uid).to.not.be.empty;

    const idToken = await userCredential.user.getIdToken();
    expect(idToken).to.not.be.empty;

    const idTokenResult = await userCredential.user.getIdTokenResult();
    expect(idTokenResult.authTime).to.not.be.empty;
    expect(idTokenResult.claims).to.be.empty;
    expect(idTokenResult.expirationTime).to.not.be.empty;
    expect(idTokenResult.issuedAtTime).to.not.be.empty;
    expect(idTokenResult.signInProvider).to.eq(Provider.PASSWORD);
    expect(idTokenResult.signInSecondFactor).to.be.null;

    await auth.signOut();

    const login = await signInWithEmailAndPassword(auth, email, password);
    expect(login.user.uid).to.eq(userCredential.user.uid);
  });
});
