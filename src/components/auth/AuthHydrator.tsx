import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMe } from '../../lib/api';
import { clearSession, setSession, selectAuth } from '../../store/authSlice';

/** Hydrate auth session from API on app load (supports phone + admin tokens). */
export default function AuthHydrator() {
  const dispatch = useDispatch();
  const { token } = useSelector(selectAuth);

  useEffect(() => {
    if (!token) return;
    fetchMe()
      .then(({ user }) => {
        if (user) dispatch(setSession({ user, token }));
        else dispatch(clearSession());
      })
      .catch(() => dispatch(clearSession()));
  }, [dispatch, token]);

  return null;
}
