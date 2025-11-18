import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
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

  // --- 1. LẮNG NGHE DANH SÁCH CHAT HIỆN CÓ ---
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
      (querySnapshot) => {
        const chatRooms = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          // Lấy thông tin của người nhận (không phải mình)
          const recipientName = data.memberNames?.find(
            (name) => name !== currentUserName
          );
          chatRooms.push({
            id: doc.id,
            ...data,
            recipientName: recipientName || 'Group Chat',
          });
        });
        console.log('ChatList - Loaded chats:', chatRooms.length);
        setChats(chatRooms);
        setLoadingChats(false);
      },
      (error) => {
        console.error('ChatList - Error listening to chats:', error);
        setLoadingChats(false);
      }
    );

    return () => unsubscribe();
  }, [currentUserId, currentUserName]);

  // --- 2. HÀM TÌM KIẾM USER (CLIENT-SIDE FILTERING) ---
  const performSearch = async (text) => {
    if (text.length < 2) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    console.log('ChatList - Searching for:', text);

    try {
      const usersRef = collection(db, 'users');
      
      // Fetch ALL users (hoặc limit 100 để tối ưu)
      const q = query(usersRef, limit(100));
      const querySnapshot = await getDocs(q);
      
      const users = [];
      const searchLower = text.toLowerCase();
      
      querySnapshot.forEach((doc) => {
        if (doc.id !== currentUserId) {
          const userData = doc.data();
          const userName = userData.name || '';
          
          // Client-side filtering: Tìm trong tên (không phân biệt hoa/thường)
          if (userName.toLowerCase().includes(searchLower)) {
            users.push({ 
              id: doc.id, 
              ...userData 
            });
            console.log('ChatList - Found user:', userData.name);
          }
        }
      });

      console.log('ChatList - Search results:', users.length);
      setSearchResults(users);
      
      if (users.length === 0) {
        console.log('ChatList - No users found for query:', text);
      }
    } catch (error) {
      console.error('ChatList - Error searching users:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      
      if (error.code === 'permission-denied') {
        Alert.alert(
          'Lỗi quyền truy cập',
          'Bạn cần cập nhật Firebase Security Rules để cho phép tìm kiếm user.'
        );
      } else {
        Alert.alert(
          'Lỗi',
          `Không thể tìm kiếm: ${error.message}`
        );
      }
    }
    setIsSearching(false);
  };

  // --- 3. HÀM TẠO CHAT ---
  const handleCreateChat = async (recipientUser) => {
    if (
      !currentUserId ||
      !recipientUser.id ||
      currentUserId === recipientUser.id
    ) {
      console.log('ChatList - Invalid chat creation attempt');
      return;
    }

    console.log('ChatList - Creating chat with:', recipientUser.name);

    try {
      // 1. Kiểm tra xem chat 1-1 này đã tồn tại chưa
      const chatQuery = query(
        collection(db, 'chats'),
        where('type', '==', 'direct'),
        where('members', 'array-contains', currentUserId)
      );
      
      const querySnapshot = await getDocs(chatQuery);
      
      // Check if chat already exists with this recipient
      let existingChat = null;
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.members.includes(recipientUser.id)) {
          existingChat = { id: doc.id, ...data };
        }
      });

      if (existingChat) {
        // Chat đã tồn tại -> Điều hướng đến đó
        console.log('ChatList - Chat already exists:', existingChat.id);
        navigation.navigate('ChatRoom', {
          chatId: existingChat.id,
          chatName: recipientUser.name,
        });
      } else {
        // 2. Chat chưa tồn tại -> Tạo chat mới
        console.log('ChatList - Creating new chat');
        const newChatData = {
          type: 'direct',
          members: [currentUserId, recipientUser.id],
          memberNames: [currentUserName, recipientUser.name],
          lastMessageText: 'Đã bắt đầu cuộc trò chuyện',
          lastMessageTimestamp: serverTimestamp(),
        };
        
        const newChatRef = await addDoc(collection(db, 'chats'), newChatData);
        console.log('ChatList - New chat created:', newChatRef.id);
        
        navigation.navigate('ChatRoom', {
          chatId: newChatRef.id,
          chatName: recipientUser.name,
        });
      }
    } catch (error) {
      console.error('ChatList - Error creating chat:', error);
      Alert.alert('Lỗi', 'Không thể tạo chat: ' + error.message);
    }
  };

  // Debounce search
  const debouncedSearch = useCallback(debounce(performSearch, 500), [
    currentUserId,
  ]);

  const handleSearchTextChange = (text) => {
    setSearchText(text);
    if (text.length > 0) {
      debouncedSearch(text);
    } else {
      setSearchResults([]);
    }
  };

  // Hàm mở một chat đã có
  const handleOpenChat = (item) => {
    navigation.navigate('ChatRoom', {
      chatId: item.id,
      chatName: item.recipientName,
    });
  };

  // Render item cho danh sách (hoặc chat, hoặc user)
  const renderItem = ({ item }) => {
    // NẾU ĐANG SEARCH
    if (searchText.length > 0) {
      return (
        <TouchableOpacity
          style={styles.userItem}
          onPress={() => handleCreateChat(item)}>
          <Image
            source={{
              uri:
                item.avatar ||
                `https://placehold.co/100x100/ff77a9/fff?text=${item.name
                  ?.charAt(0)
                  .toUpperCase()}`,
            }}
            style={styles.avatar}
          />
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{item.name}</Text>
            <Text style={styles.userEmail}>{item.email}</Text>
          </View>
        </TouchableOpacity>
      );
    }

    // NẾU LÀ DANH SÁCH CHAT HIỆN CÓ
    return (
      <TouchableOpacity
        style={styles.chatItem}
        onPress={() => handleOpenChat(item)}>
        <Image
          source={{
            uri:
              item.recipientAvatar ||
              `https://placehold.co/100x100/ffb6d9/ffffff?text=${item.recipientName
                ?.charAt(0)
                .toUpperCase()}`,
          }}
          style={styles.avatar}
        />
        <View style={styles.chatContent}>
          <View style={styles.chatHeader}>
            <Text style={styles.chatName}>{item.recipientName}</Text>
            <Text style={styles.chatTime}>
              {item.lastMessageTimestamp?.toDate().toLocaleTimeString('vi-VN', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Text>
          </View>
          <Text style={styles.chatLastMessage} numberOfLines={1}>
            {item.lastMessageText}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* --- THANH TÌM KIẾM --- */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="Tìm kiếm theo tên..."
          placeholderTextColor="#888"
          value={searchText}
          onChangeText={handleSearchTextChange}
        />
      </View>

      {/* Loading indicator */}
      {(loadingChats || isSearching) && (
        <ActivityIndicator color="#ff77a9" style={{ marginVertical: 10 }} />
      )}

      {/* --- DANH SÁCH (Chat hoặc User) --- */}
      <FlatList
        data={searchText.length > 0 ? searchResults : chats}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={() => (
          !loadingChats &&
          !isSearching && (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                {searchText.length > 0
                  ? `Không tìm thấy user với tên "${searchText}"`
                  : 'Bạn chưa có tin nhắn nào.'}
              </Text>
              {searchText.length > 0 && searchText.length < 2 && (
                <Text style={styles.emptySubText}>
                  Nhập tối thiểu 2 ký tự để tìm kiếm
                </Text>
              )}
            </View>
          )
        )}
      />
    </SafeAreaView>
  );
}

// --- STYLESHEET ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  searchContainer: {
    padding: 10,
    backgroundColor: '#111',
  },
  input: {
    height: 45,
    borderColor: '#333',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 15,
    color: '#fff',
    fontSize: 16,
    marginBottom: 5,
  },
  searchHint: {
    color: '#666',
    fontSize: 12,
    paddingHorizontal: 15,
    marginTop: 2,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
    paddingHorizontal: 20,
  },
  emptyText: {
    color: '#888',
    fontSize: 16,
    textAlign: 'center',
  },
  emptySubText: {
    color: '#666',
    fontSize: 14,
    marginTop: 10,
    textAlign: 'center',
  },
  // Style cho danh sách chat
  chatItem: {
    flexDirection: 'row',
    padding: 15,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  chatContent: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  chatName: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#fff',
  },
  chatTime: {
    fontSize: 12,
    color: '#999',
  },
  chatLastMessage: {
    fontSize: 14,
    color: '#ccc',
  },
  // Style cho kết quả tìm kiếm
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  userEmail: {
    color: '#999',
    fontSize: 13,
    marginTop: 2,
  },
});