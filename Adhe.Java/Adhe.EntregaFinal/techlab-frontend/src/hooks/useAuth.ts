import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../app/store';
import { bindActionCreators } from '@reduxjs/toolkit';
import * as authActions from '../features/auth/authSlice';

export const useAppDispatch = (): AppDispatch => useDispatch<AppDispatch>();

export function useAuth(): {
  auth: RootState['auth'];
  login: typeof authActions.login;
  logout: typeof authActions.logout;
} {
  const dispatch = useAppDispatch();
  const auth = useSelector((state: RootState) => state.auth);
  const actions = bindActionCreators({ login: authActions.login, logout: authActions.logout }, dispatch);
  return { auth, ...actions };
}
