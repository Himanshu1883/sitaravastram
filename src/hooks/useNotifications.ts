import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchNotifications,
  fetchUnreadNotificationCount,
  markAllNotificationsRead,
  markNotificationRead,
} from '../lib/api';
import {
  setNotifications,
  setUnreadCount,
  markRead,
  markAllRead,
  clearNotifications,
  selectUnreadCount,
  selectNotifications,
} from '../store/notificationSlice';
import { selectIsUser } from '../store/authSlice';

export function useNotifications(options?: { poll?: boolean }) {
  const dispatch = useDispatch();
  const isUser = useSelector(selectIsUser);
  const items = useSelector(selectNotifications);
  const unreadCount = useSelector(selectUnreadCount);

  const refresh = useCallback(async () => {
    if (!isUser) {
      dispatch(clearNotifications());
      return;
    }
    try {
      const [list, { count }] = await Promise.all([
        fetchNotifications(),
        fetchUnreadNotificationCount(),
      ]);
      dispatch(setNotifications(list));
      dispatch(setUnreadCount(count));
    } catch {
      /* silent */
    }
  }, [dispatch, isUser]);

  const markOneRead = useCallback(
    async (id: string) => {
      dispatch(markRead(id));
      try {
        await markNotificationRead(id);
      } catch {
        refresh();
      }
    },
    [dispatch, refresh],
  );

  const markAllReadAction = useCallback(async () => {
    dispatch(markAllRead());
    try {
      await markAllNotificationsRead();
    } catch {
      refresh();
    }
  }, [dispatch, refresh]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    if (!options?.poll || !isUser) return;
    const id = window.setInterval(refresh, 60_000);
    return () => window.clearInterval(id);
  }, [options?.poll, isUser, refresh]);

  return { items, unreadCount, refresh, markOneRead, markAllRead: markAllReadAction };
}

export function useUnreadNotificationCount() {
  const isUser = useSelector(selectIsUser);
  const dispatch = useDispatch();
  const unreadCount = useSelector(selectUnreadCount);

  useEffect(() => {
    if (!isUser) {
      dispatch(clearNotifications());
      return;
    }
    fetchUnreadNotificationCount()
      .then(({ count }) => dispatch(setUnreadCount(count)))
      .catch(() => undefined);
    const id = window.setInterval(() => {
      fetchUnreadNotificationCount()
        .then(({ count }) => dispatch(setUnreadCount(count)))
        .catch(() => undefined);
    }, 60_000);
    return () => window.clearInterval(id);
  }, [dispatch, isUser]);

  return unreadCount;
}
