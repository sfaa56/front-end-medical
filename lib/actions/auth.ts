'use server';

import { createSession,deleteSession  } from '../session'; 


export async function handleLogin(accessToken: string) {
  await createSession(accessToken);

}


export async function handleLogout() {
  await deleteSession();

}