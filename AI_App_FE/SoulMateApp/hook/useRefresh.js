import { useState, useCallback } from 'react';

/**
 * Custom hook để xử lý pull-to-refresh
 * @param {Function} onRefreshCallback - Hàm async sẽ được gọi khi refresh
 * @returns {Object} - { refreshing, onRefresh }
 * 
 * @example
 * // Trong component
 * const { refreshing, onRefresh } = useRefresh(async () => {
 *   await loadUserProfile(userId, dispatch);
 * });
 * 
 * <ScrollView
 *   refreshControl={
 *     <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
 *   }
 * >
 */
export const useRefresh = (onRefreshCallback) => {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    
    try {
      if (onRefreshCallback && typeof onRefreshCallback === 'function') {
        await onRefreshCallback();
      }
    } catch (error) {
      console.error('Refresh error:', error);
    } finally {
      setRefreshing(false);
    }
  }, [onRefreshCallback]);

  return { refreshing, onRefresh };
};