import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useSelector } from 'react-redux';
import { db } from '../../config/firebaseConfig';
import {
  collection,
  onSnapshot,
  query,
  where,
  getDocs,
  addDoc,
  serverTimestamp,
  doc,
  getDoc,
  limit,
  orderBy,
} from 'firebase/firestore';

// Hàm debounce: Chờ người dùng gõ xong mới search
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

export default function ChatListScreen({ navigation }) {
  // State cho danh sách chat hiện có
  const [chats, setChats] = useState([]);
  const [loadingChats, setLoadingChats] = useState(true);

  // State cho tìm kiếm
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // Lấy thông tin user từ Redux
  const currentUser = useSelector((state) => state.profile);
  const currentUserId = currentUser?.uid;
  const currentUserName = currentUser?.name;

  // Debug log
  useEffect(() => {
    console.log('ChatList - Current User:', {
      uid: currentUserId,
      name: currentUserName,
    });
  }, [currentUserId, currentUserName]);

  // Avatar mặc định từ assets 
  const DEFAULT_AVATAR = require('../../assets/default_avatar.jpg');

  // Helper function để lấy avatar source cho Image component
  const getAvatarSource = (user) => {
    // Nếu có avatar URL từ Cloudinary/Firestore
    if (user?.avatar && user.avatar.trim() !== '') {
      return { uri: user.avatar };
    }
    // Nếu không có, dùng ảnh local từ assets
    return DEFAULT_AVATAR;
  };

  // DANH SÁCH CHAT HIỆN CÓ 
  useEffect(() => {
    if (!currentUserId) {
      console.log('ChatList - No currentUserId, skipping chat listener');
      return;
    }

    console.log('ChatList - Setting up chat listener for:', currentUserId);
    setLoadingChats(true);

    const q = query(
      collection(db, 'chats'),
      where('members', 'array-contains', currentUserId),
      orderBy('lastMessageTimestamp', 'desc')
    );

    const unsubscribe = onSnapshot(
      q,
      async (querySnapshot) => {
        const chatRooms = [];
        
        // lấy avatar của recipient
        const chatPromises = querySnapshot.docs.map(async (docSnap) => {
          const data = docSnap.data();
          
          // Tìm recipient (người còn lại trong chat)
          const recipientId = data.members?.find(id => id !== currentUserId);
          const recipientName = data.memberNames?.find(name => name !== currentUserName);
          
          // Lấy avatar của recipient từ collection users
          let recipientAvatar = null;
          if (recipientId) {
            try {
              const userDoc = await getDoc(doc(db, 'users', recipientId));
              if (userDoc.exists()) {
                const userData = userDoc.data();
                recipientAvatar = userData?.avatar && userData.avatar.trim() !== '' 
                  ? userData.avatar 
                  : null; // null để dùng default avatar sau này
              }
            } catch (error) {
              console.error('Error fetching recipient avatar:', error);
            }
          }
          
          return {
            id: docSnap.id,
            ...data,
            recipientId,
            recipientName: recipientName || 'Group Chat',
            recipientAvatar: recipientAvatar, // Giữ null nếu chưa có, sẽ dùng default khi render
          };
        });
        
        const resolvedChats = await Promise.all(chatPromises);
        console.log('ChatList - Loaded chats:', resolvedChats.length);
        setChats(resolvedChats);
        setLoadingChats(false);
      },
      (error) => {
        console.error('ChatList - Error listening to chats:', error);
        setLoadingChats(false);
      }
    );

    return () => unsubscribe();
  }, [currentUserId, currentUserName]);

  // HÀM TÌM KIẾM TRONG DANH SÁCH CHAT HIỆN CÓ 
  const performSearch = (text) => {
    if (text.length < 1) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    console.log('ChatList - Searching in existing chats for:', text);

    try {
      const searchLower = text.toLowerCase();
      
      // Lọc từ danh sách chat hiện có (chats)
      const filteredChats = chats.filter((chat) => {
        const recipientName = chat.recipientName || '';
        // Tìm kiếm không phân biệt hoa/thường
        return recipientName.toLowerCase().includes(searchLower);
      });

      console.log('ChatList - Found chats:', filteredChats.length);
      setSearchResults(filteredChats);
      
      if (filteredChats.length === 0) {
        console.log('ChatList - No chats found for query:', text);
      }
    } catch (error) {
      console.error('ChatList - Error searching chats:', error);
      Alert.alert('Lỗi', `Không thể tìm kiếm: ${error.message}`);
    }
    
    setIsSearching(false);
  };

  // HÀM MỞ CHAT (không cần tạo mới nữa, chỉ mở)
  const handleOpenChat = (chatItem) => {
    navigation.navigate('ChatRoomScreen', {
      chatId: chatItem.id,
      chatName: chatItem.recipientName,
      recipientAvatar: chatItem.recipientAvatar || null,
      shouldScrollToBottom: true,
    });
  };

  // Debounce search (thay đổi thành synchronous)
  const debouncedSearch = useCallback(debounce(performSearch, 300), [chats]);

  const handleSearchTextChange = (text) => {
    setSearchText(text);
    if (text.length > 0) {
      debouncedSearch(text);
    } else {
      setSearchResults([]);
      setIsSearching(false);
    }
  };

  // Render item cho danh sách chat (cả kết quả search và danh sách chính đều là chat items)
  const renderItem = ({ item }) => {
    const unreadCount = item.unreadCount?.[currentUserId] || 0;
    const hasUnread = unreadCount > 0;
    const isLastMessageFromMe = item.lastMessageSenderId === currentUserId;

    return (
      <TouchableOpacity
        style={[
          styles.chatItem,
          hasUnread && !isLastMessageFromMe && styles.chatItemUnread
        ]}
        onPress={() => handleOpenChat(item)}
        activeOpacity={0.7}>
        <View style={styles.avatarContainer}>
          <Image
            source={
              item.recipientAvatar 
                ? { uri: item.recipientAvatar } 
                : DEFAULT_AVATAR
            }
            style={styles.avatar}
          />
          {/*Unread indicator dot - chỉ hiện khi có tin nhắn chưa đọc từ người khác */}
          {hasUnread && !isLastMessageFromMe && (
            <View style={styles.unreadDot} />
          )}
        </View>
        
        <View style={styles.chatContent}>
          <View style={styles.chatHeader}>
            <Text style={[
              styles.chatName,
              hasUnread && !isLastMessageFromMe && styles.chatNameUnread
            ]}>
              {item.recipientName}
            </Text>
            
            <View style={styles.chatTimeContainer}>
              <Text style={[
                styles.chatTime,
                hasUnread && !isLastMessageFromMe && styles.chatTimeUnread
              ]}>
                {formatMessageTime(item.lastMessageTimestamp)}
              </Text>
            </View>
          </View>
          
          <View style={styles.lastMessageRow}>
            <Text 
              style={[
                styles.chatLastMessage,
                hasUnread && !isLastMessageFromMe && styles.chatLastMessageUnread
              ]} 
              numberOfLines={1}>
              {isLastMessageFromMe && 'Bạn: '}
              {item.lastMessageText}
            </Text>
            
            {/* Unread count badge - hiển thị số tin nhắn chưa đọc */}
            {hasUnread && !isLastMessageFromMe && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadBadgeText}>
                  {unreadCount > 99 ? '99+' : unreadCount}
                </Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  // Format thời gian hiển thị
  const formatMessageTime = (timestamp) => {
    if (!timestamp) return '';
    
    const messageDate = timestamp.toDate();
    const now = new Date();
    const diffInMs = now - messageDate;
    const diffInHours = diffInMs / (1000 * 60 * 60);
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
    
    // Nếu trong vòng 24 giờ, hiển thị giờ
    if (diffInHours < 24) {
      return messageDate.toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
      });
    }
    
    // Nếu trong tuần, hiển thị thứ
    if (diffInDays < 7) {
      const days = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
      return days[messageDate.getDay()];
    }
    
    // Nếu lâu hơn, hiển thị ngày/tháng
    return messageDate.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
    });
  };

  return (
    <View style={styles.container}>
      {/*THANH TÌM KIẾM */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputWrapper}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.input}
            placeholder="Tìm kiếm theo tên..."
            placeholderTextColor="#555"
            value={searchText}
            onChangeText={handleSearchTextChange}
          />
          {searchText.length > 0 && (
            <TouchableOpacity 
              onPress={() => setSearchText('')}
              style={styles.clearButton}>
              <Text style={styles.clearButtonText}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
        {searchText.length === 0}
      </View>

      {/* Loading indicator */}
      {(loadingChats || isSearching) && (
        <ActivityIndicator color="#ff77a9" size="large" style={styles.loader} />
      )}

      {/* DANH SÁCH (Chat hoặc User) */}
      <FlatList
        data={searchText.length > 0 ? searchResults : chats}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListFooterComponent={() => <View style={{ height: 80 }} />}
        ListEmptyComponent={() => (
          !loadingChats &&
          !isSearching && (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>
                {searchText.length > 0 ? '🔍' : '💬'}
              </Text>
              <Text style={styles.emptyText}>
                {searchText.length > 0
                  ? `Không tìm thấy cuộc trò chuyện với "${searchText}"`
                  : 'Bạn chưa có tin nhắn nào.'}
              </Text>
              {searchText.length > 0 && (
                <Text style={styles.emptySubText}>
                  Thử tìm kiếm với tên khác
                </Text>
              )}
            </View>
          )
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  searchContainer: {
    padding: 12,
    backgroundColor: '#000',
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a1a',
  },
  searchInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0a0a0a',
    borderRadius: 24,
    paddingHorizontal: 16,
    height: 48,
    borderWidth: 1,
    borderColor: '#1a1a1a',
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  input: {
    flex: 1,
    color: '#fff',
    fontSize: 15,
    paddingVertical: 0,
  },
  clearButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  clearButtonText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '600',
  },
  searchHint: {
    color: '#444',
    fontSize: 12,
    paddingHorizontal: 16,
    marginTop: 8,
  },
  loader: {
    marginVertical: 20,
  },
  listContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
    paddingHorizontal: 40,
  },
  emptyIcon: {
    fontSize: 60,
    marginBottom: 16,
    opacity: 0.3,
  },
  emptyText: {
    color: '#666',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  emptySubText: {
    color: '#444',
    fontSize: 14,
    marginTop: 12,
    textAlign: 'center',
  },
  chatItem: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
    backgroundColor: '#000',
    borderBottomWidth: 1,
    borderBottomColor: '#0a0a0a',
  },
  chatItemUnread: {
    backgroundColor: '#050505',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: '#1a1a1a',
  },
  unreadDot: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#ff77a9',
    borderWidth: 2,
    borderColor: '#000',
  },
  chatContent: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  chatName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ccc',
    flex: 1,
  },
  chatNameUnread: {
    fontWeight: '700',
    color: '#fff',
  },
  chatTimeContainer: {
    marginLeft: 8,
  },
  chatTime: {
    fontSize: 12,
    color: '#555',
    fontWeight: '500',
  },
  chatTimeUnread: {
    color: '#ff77a9',
    fontWeight: '600',
  },
  lastMessageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  chatLastMessage: {
    fontSize: 14,
    color: '#666',
    flex: 1,
    marginRight: 8,
  },
  chatLastMessageUnread: {
    color: '#aaa',
    fontWeight: '600',
  },
  unreadBadge: {
    backgroundColor: '#ff77a9',
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
    shadowColor: '#ff77a9',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  unreadBadgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },
});