import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Image,
  Alert,
  Modal,
  Keyboard,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import * as ImagePicker from 'expo-image-picker';
import { Audio } from 'expo-av';
import { db } from '../../config/firebaseConfig';
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  getDoc,
  doc,
  updateDoc,
  serverTimestamp,
  limit,
} from 'firebase/firestore';

export default function ChatRoomScreen({ route, navigation }) {
  const { chatId, chatName } = route.params;
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const recordingRef = useRef(null);

  const currentUser = useSelector((state) => state.profile);
  const currentUserId = currentUser?.uid;
  const currentUserName = currentUser?.name || 'Unknown User';
  const currentUserAvatar = currentUser?.avatar;

  // ⭐ BÉ THÊM ĐÚNG VÀO ĐÂY 👇👇👇
const [partnerId, setPartnerId] = useState(null);

useEffect(() => {
  const fetchPartner = async () => {
    const chatRef = doc(db, "chats", chatId);
    const snap = await getDoc(chatRef);
    if (snap.exists()) {
      const data = snap.data();
      const other = data.members?.find((m) => m !== currentUserId);
      console.log("🎯 PARTNER FOUND:", other);
      setPartnerId(other);
    }
  };

  if (chatId && currentUserId) fetchPartner();
}, [chatId, currentUserId]);

  useEffect(() => {
    (async () => {
      await ImagePicker.requestCameraPermissionsAsync();
      await ImagePicker.requestMediaLibraryPermissionsAsync();
      await Audio.requestPermissionsAsync();
    })();

    // Lắng nghe sự kiện bàn phím
    const keyboardWillShow = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      (e) => {
        setKeyboardHeight(e.endCoordinates.height);
      }
    );

    const keyboardWillHide = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        setKeyboardHeight(0);
      }
    );

    return () => {
      keyboardWillShow.remove();
      keyboardWillHide.remove();
    };
  }, []);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: chatName,
      headerRight: () => (
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.headerButton} onPress={handleCall}>
            <Ionicons name="call" size={22} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => setShowMenu(true)}
          >
            <Ionicons name="ellipsis-vertical" size={22} color="#fff" />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation]);

  useEffect(() => {
    if (!chatId || !currentUserId) return;

    const messagesQuery = query(
      collection(db, 'chats', chatId, 'messages'),
      orderBy('createdAt', 'asc'),
      limit(100)
    );

    const unsubscribe = onSnapshot(messagesQuery, (querySnapshot) => {
      const loadedMessages = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        loadedMessages.push({
          id: doc.id,
          text: data.text,
          imageUrl: data.imageUrl,
          audioUrl: data.audioUrl,
          type: data.type || 'text',
          createdAt: data.createdAt ? data.createdAt.toDate() : new Date(),
          senderId: data.senderId,
          senderName: data.senderName,
          senderAvatar: data.senderAvatar,
        });
      });
      setMessages(loadedMessages);
    });

    return () => unsubscribe();
  }, [chatId, currentUserId]);

  const handleSend = async () => {
    if (!inputText.trim() || !currentUserId || !chatId) return;

    const messageText = inputText.trim();
    setInputText('');

    const messageData = {
      type: 'text',
      text: messageText,
      createdAt: serverTimestamp(),
      senderId: currentUserId,
      senderName: currentUserName,
      senderAvatar: currentUserAvatar || null,
    };

    try {
      await addDoc(collection(db, 'chats', chatId, 'messages'), messageData);
      await updateDoc(doc(db, 'chats', chatId), {
        lastMessageText: messageText,
        lastMessageTimestamp: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error sending message:', error);
      setInputText(messageText);
    }
  };

  const handleCamera = () => {
    Alert.alert(
      'Chọn ảnh',
      'Bạn muốn chọn ảnh từ đâu?',
      [
        {
          text: 'Camera',
          onPress: async () => {
            const result = await ImagePicker.launchCameraAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              quality: 0.8,
            });
            if (!result.canceled) {
              await sendImageMessage(result.assets[0].uri);
            }
          },
        },
        {
          text: 'Thư viện',
          onPress: async () => {
            const result = await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              quality: 0.8,
            });
            if (!result.canceled) {
              await sendImageMessage(result.assets[0].uri);
            }
          },
        },
        { text: 'Hủy', style: 'cancel' },
      ]
    );
  };

  const sendImageMessage = async (imageUri) => {
    try {
      const messageData = {
        type: 'image',
        text: '',
        imageUrl: imageUri,
        createdAt: serverTimestamp(),
        senderId: currentUserId,
        senderName: currentUserName,
        senderAvatar: currentUserAvatar || null,
      };

      await addDoc(collection(db, 'chats', chatId, 'messages'), messageData);
      await updateDoc(doc(db, 'chats', chatId), {
        lastMessageText: '📷 Ảnh',
        lastMessageTimestamp: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error sending image:', error);
      Alert.alert('Lỗi', 'Không thể gửi ảnh');
    }
  };

  const handleVoicePress = async () => {
    if (isRecording) {
      await stopRecording();
    } else {
      await startRecording();
    }
  };

  const startRecording = async () => {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      recordingRef.current = recording;
      setIsRecording(true);
      console.log('Recording started');
    } catch (error) {
      console.error('Failed to start recording:', error);
      Alert.alert('Lỗi', 'Không thể ghi âm');
    }
  };

  const stopRecording = async () => {
    try {
      setIsRecording(false);
      await recordingRef.current.stopAndUnloadAsync();
      const uri = recordingRef.current.getURI();
      recordingRef.current = null;

      console.log('Recording stopped, URI:', uri);

      await sendAudioMessage(uri);
    } catch (error) {
      console.error('Failed to stop recording:', error);
    }
  };

  const sendAudioMessage = async (audioUri) => {
    try {
      const messageData = {
        type: 'audio',
        text: '',
        audioUrl: audioUri,
        createdAt: serverTimestamp(),
        senderId: currentUserId,
        senderName: currentUserName,
        senderAvatar: currentUserAvatar || null,
      };

      await addDoc(collection(db, 'chats', chatId, 'messages'), messageData);
      await updateDoc(doc(db, 'chats', chatId), {
        lastMessageText: '🎤 Tin nhắn thoại',
        lastMessageTimestamp: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error sending audio:', error);
      Alert.alert('Lỗi', 'Không thể gửi âm thanh');
    }
  };

  const handleCall = () => {
    Alert.alert(
      'Gọi điện',
      `Bạn muốn gọi cho ${chatName}?`,
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Gọi thoại',
          onPress: () => {
            Alert.alert('Thông báo', 'Tính năng gọi thoại đang phát triển');
          },
        },
        {
          text: 'Gọi video',
          onPress: () => {
            Alert.alert('Thông báo', 'Tính năng gọi video đang phát triển');
          },
        },
      ]
    );
  };

  const formatTime = (date) => {
    if (!date) return '';
    return date.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderMessage = ({ item }) => {
    const isMyMessage = item.senderId === currentUserId;

    return (
      <View
        style={[
          styles.messageContainer,
          isMyMessage ? styles.myMessageContainer : styles.theirMessageContainer,
        ]}
      >
        {!isMyMessage && (
          <Image
            source={{
              uri:
                item.senderAvatar ||
                `https://placehold.co/40x40/555/fff?text=${item.senderName?.charAt(0)}`,
            }}
            style={styles.avatar}
          />
        )}
        <View
          style={[
            styles.messageBubble,
            isMyMessage ? styles.myMessage : styles.theirMessage,
          ]}
        >
          {item.type === 'text' && <Text style={styles.messageText}>{item.text}</Text>}

          {item.type === 'image' && (
            <Image
              source={{ uri: item.imageUrl }}
              style={styles.messageImage}
              resizeMode="cover"
            />
          )}

          {item.type === 'audio' && (
            <View style={styles.audioContainer}>
              <Ionicons name="play-circle" size={32} color="#e9edef" />
              <Text style={styles.audioDuration}>0:15</Text>
            </View>
          )}

          <View style={styles.timeContainer}>
            <Text style={styles.timeText}>{formatTime(item.createdAt)}</Text>
            {isMyMessage && <Ionicons name="checkmark-done" size={16} color="#53bdeb" />}
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#0b141a' }}>
      <View style={styles.container}>
        {/* Background Pattern */}
        <View style={styles.backgroundPattern} />
        
        {/* Danh sách tin nhắn với flex:1 */}
        <FlatList
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messagesList}
          style={{ flex: 1 }}
          keyboardShouldPersistTaps="handled"
        />
        
        {/* Input Bar luôn ở dưới cùng */}
        <View style={[
          styles.inputBar,
          Platform.OS === 'android' && keyboardHeight > 0 && { marginBottom: 8 }
        ]}>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="happy-outline" size={26} color="#8696a0" />
          </TouchableOpacity>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder="Nhập tin nhắn..."
              placeholderTextColor="#8696a0"
              value={inputText}
              onChangeText={setInputText}
              multiline
              maxLength={1000}
            />
          </View>
          <TouchableOpacity style={styles.iconButton} onPress={handleCamera}>
            <Ionicons name="camera-outline" size={24} color="#8696a0" />
          </TouchableOpacity>
          {inputText.trim() ? (
            <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
              <Ionicons name="send" size={22} color="#fff" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.sendButton, isRecording && styles.recordingButton]}
              onPress={handleVoicePress}
              onLongPress={startRecording}
              onPressOut={isRecording ? stopRecording : undefined}
            >
              <Ionicons
                name={isRecording ? 'stop' : 'mic'}
                size={22}
                color="#fff"
              />
            </TouchableOpacity>
          )}
        </View>
        
        {/* Menu Modal */}
        <Modal
          visible={showMenu}
          transparent
          animationType="fade"
          onRequestClose={() => setShowMenu(false)}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setShowMenu(false)}
          >
            <View style={styles.menuContainer}>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  setShowMenu(false);
                  navigation.navigate("ConnectionActionsScreen", {
                    chatId,
                    chatName,
                    partnerId,
                     // ⭐ IMPORTANT — phải gửi nó qua!!
                  });
                  
                }}
              >
                <Ionicons name="settings-outline" size={22} color="#e9edef" />
                <Text style={styles.menuText}>Cài đặt</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  setShowMenu(false);
                  Alert.alert('Thông báo', 'Xem ảnh/video');
                }}
              >
                <Ionicons name="images-outline" size={22} color="#e9edef" />
                <Text style={styles.menuText}>Xem ảnh & video</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  setShowMenu(false);
                  Alert.alert('Thông báo', 'Tìm kiếm trong chat');
                }}
              >
                <Ionicons name="search-outline" size={22} color="#e9edef" />
                <Text style={styles.menuText}>Tìm kiếm</Text>
              </TouchableOpacity>
              <View style={styles.menuDivider} />
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  setShowMenu(false);
                  Alert.alert('Xác nhận', 'Bạn muốn xóa toàn bộ tin nhắn?', [
                    { text: 'Hủy', style: 'cancel' },
                    { text: 'Xóa', style: 'destructive' },
                  ]);
                }}
              >
                <Ionicons name="trash-outline" size={22} color="#f44336" />
                <Text style={[styles.menuText, { color: '#f44336' }]}>
                  Xóa tin nhắn
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b141a',
  },
  backgroundPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#0b141a',
    opacity: 0.06,
  },
  headerRight: {
    flexDirection: 'row',
    marginRight: 8,
  },
  headerButton: {
    padding: 8,
    marginLeft: 8,
  },
  messagesList: {
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 20,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'flex-end',
  },
  myMessageContainer: {
    justifyContent: 'flex-end',
  },
  theirMessageContainer: {
    justifyContent: 'flex-start',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  messageBubble: {
    maxWidth: '75%',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },
  myMessage: {
    backgroundColor: '#005c4b',
    borderBottomRightRadius: 2,
    alignSelf: 'flex-end',
  },
  theirMessage: {
    backgroundColor: '#1f2c34',
    borderBottomLeftRadius: 2,
    alignSelf: 'flex-start',
  },
  messageText: {
    color: '#e9edef',
    fontSize: 15,
    lineHeight: 20,
    marginBottom: 4,
  },
  messageImage: {
    width: 200,
    height: 200,
    borderRadius: 8,
    marginBottom: 4,
  },
  audioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    gap: 12,
  },
  audioDuration: {
    color: '#e9edef',
    fontSize: 14,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    gap: 4,
  },
  timeText: {
    color: '#8696a0',
    fontSize: 11,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 12,
    backgroundColor: '#1f2c34',
    borderTopWidth: 1,
    borderTopColor: '#2a3942',
    marginBottom: Platform.OS === 'android' ? 16 : 0,
  },
  iconButton: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputContainer: {
    flex: 1,
    backgroundColor: '#2a3942',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginHorizontal: 4,
    maxHeight: 100,
  },
  textInput: {
    color: '#e9edef',
    fontSize: 16,
    minHeight: 20,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: '#00a884',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 4,
  },
  recordingButton: {
    backgroundColor: '#f44336',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
  menuContainer: {
    backgroundColor: '#1f2c34',
    marginTop: 60,
    marginRight: 16,
    borderRadius: 8,
    minWidth: 200,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 12,
  },
  menuText: {
    color: '#e9edef',
    fontSize: 15,
  },
  menuDivider: {
    height: 1,
    backgroundColor: '#2a3942',
    marginVertical: 4,
  },
});