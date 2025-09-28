import { MiniKit } from '@worldcoin/minikit-js';
import { signIn } from 'next-auth/react';
import { getNewNonces } from './server-helpers';

/**
 * Authenticates a user via their wallet using a nonce-based challenge-response mechanism.
 *
 * This function generates a unique `nonce` and requests the user to sign it with their wallet,
 * producing a `signedNonce`. The `signedNonce` ensures the response we receive from wallet auth
 * is authentic and matches our session creation.
 *
 * @returns {Promise<SignInResponse>} The result of the sign-in attempt.
 * @throws {Error} If wallet authentication fails at any step.
 */
export const walletAuth = async () => {
  const startTime = performance.now();
  console.log('⏱️ walletAuth: Starting authentication process...');
  
  console.log('⏱️ walletAuth: Step 1 - Generating nonces...');
  const nonceStart = performance.now();
  const { nonce, signedNonce } = await getNewNonces();
  console.log(`⏱️ walletAuth: Step 1 completed in ${(performance.now() - nonceStart).toFixed(2)}ms`);

  console.log('⏱️ walletAuth: Step 2 - Calling MiniKit wallet auth...');
  const miniKitStart = performance.now();
  const result = await MiniKit.commandsAsync.walletAuth({
    nonce,
    expirationTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    notBefore: new Date(Date.now() - 24 * 60 * 60 * 1000),
    statement: `Authenticate (${crypto.randomUUID().replace(/-/g, '')}).`,
  });
  console.log(`⏱️ walletAuth: Step 2 completed in ${(performance.now() - miniKitStart).toFixed(2)}ms`);
  console.log('Result', result);
  if (!result) {
    throw new Error('No response from wallet auth');
  }

  if (result.finalPayload.status !== 'success') {
    console.error(
      'Wallet authentication failed',
      result.finalPayload.error_code,
    );
    return;
  } else {
    console.log(result.finalPayload);
  }

  console.log('⏱️ walletAuth: Step 3 - Calling NextAuth signIn...');
  const signInStart = performance.now();
  const signInResult = await signIn('credentials', {
    redirectTo: '/home',
    nonce,
    signedNonce,
    finalPayloadJson: JSON.stringify(result.finalPayload),
  });
  console.log(`⏱️ walletAuth: Step 3 completed in ${(performance.now() - signInStart).toFixed(2)}ms`);
  console.log(`⏱️ walletAuth: Total authentication time: ${(performance.now() - startTime).toFixed(2)}ms`);
  
  return signInResult;
};
