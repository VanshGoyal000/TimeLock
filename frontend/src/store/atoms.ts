import { atom } from 'jotai';
import { UserSession } from '@stacks/auth';

// Network selection atom - defaults to testnet
export const networkAtom = atom<string>('testnet');

// User session atom
export const userSessionAtom = atom<UserSession>(new UserSession());
