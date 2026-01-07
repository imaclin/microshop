import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { LiquidGlassCard } from '../../components/LiquidGlass';
import { Conversation } from '../../types';

const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: '1',
    participants: ['1', '2'],
    productId: '1',
    lastMessage: {
      id: '1',
      conversationId: '1',
      senderId: '2',
      text: 'Is this still available?',
      createdAt: new Date(Date.now() - 30 * 60 * 1000),
      read: false,
    },
    unreadCount: 2,
    updatedAt: new Date(Date.now() - 30 * 60 * 1000),
  },
  {
    id: '2',
    participants: ['1', '3'],
    productId: '2',
    lastMessage: {
      id: '2',
      conversationId: '2',
      senderId: '1',
      text: 'Thanks for purchasing! I will ship it tomorrow.',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      read: true,
    },
    unreadCount: 0,
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    id: '3',
    participants: ['1', '4'],
    lastMessage: {
      id: '3',
      conversationId: '3',
      senderId: '4',
      text: 'Would you accept $80 for the shoes?',
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      read: true,
    },
    unreadCount: 0,
    updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
  },
];

const MOCK_USERS: { [key: string]: { name: string; avatar?: string } } = {
  '2': { name: 'John Doe' },
  '3': { name: 'Fashion Store' },
  '4': { name: 'Sneaker Fan' },
};

export const MessagesScreen: React.FC = () => {
  const [conversations] = useState<Conversation[]>(MOCK_CONVERSATIONS);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setRefreshing(false);
  }, []);

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) {
      return `${minutes}m`;
    } else if (hours < 24) {
      return `${hours}h`;
    } else if (days < 7) {
      return `${days}d`;
    } else {
      return new Date(date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
    }
  };

  const getOtherParticipant = (conversation: Conversation) => {
    const otherId = conversation.participants.find((p) => p !== '1');
    return MOCK_USERS[otherId || ''] || { name: 'Unknown' };
  };

  const renderConversation = useCallback(
    ({ item }: { item: Conversation }) => {
      const otherUser = getOtherParticipant(item);
      const isUnread = item.unreadCount > 0;

      return (
        <TouchableOpacity activeOpacity={0.7}>
          <LiquidGlassCard style={styles.conversationCard}>
            <View style={styles.conversationRow}>
              <View style={styles.avatarContainer}>
                {otherUser.avatar ? (
                  <Image source={{ uri: otherUser.avatar }} style={styles.avatar} />
                ) : (
                  <View style={styles.avatarPlaceholder}>
                    <Text style={styles.avatarInitial}>
                      {otherUser.name.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                )}
                {isUnread && <View style={styles.unreadDot} />}
              </View>

              <View style={styles.conversationInfo}>
                <View style={styles.nameRow}>
                  <Text style={[styles.name, isUnread && styles.nameUnread]}>
                    {otherUser.name}
                  </Text>
                  <Text style={styles.time}>{formatTime(item.updatedAt)}</Text>
                </View>
                <Text
                  style={[styles.lastMessage, isUnread && styles.lastMessageUnread]}
                  numberOfLines={1}
                >
                  {item.lastMessage.senderId === '1' ? 'You: ' : ''}
                  {item.lastMessage.text}
                </Text>
              </View>
            </View>
          </LiquidGlassCard>
        </TouchableOpacity>
      );
    },
    []
  );

  const keyExtractor = useCallback((item: Conversation) => item.id, []);

  return (
    <LinearGradient
      colors={['#1a1a2e', '#16213e', '#0f3460']}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.title}>Messages</Text>
          <TouchableOpacity style={styles.composeButton}>
            <Ionicons name="create-outline" size={24} color="#ffffff" />
          </TouchableOpacity>
        </View>

        <FlatList
          data={conversations}
          renderItem={renderConversation}
          keyExtractor={keyExtractor}
          contentContainerStyle={styles.conversationList}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#ffffff"
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="chatbubbles-outline" size={64} color="rgba(255,255,255,0.3)" />
              <Text style={styles.emptyText}>No messages yet</Text>
              <Text style={styles.emptySubtext}>
                Start a conversation when you buy or sell
              </Text>
            </View>
          }
        />
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#ffffff',
  },
  composeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  conversationList: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  conversationCard: {
    marginBottom: 8,
  },
  conversationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0, 122, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    fontSize: 20,
    fontWeight: '600',
    color: '#ffffff',
  },
  unreadDot: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#0A84FF',
    borderWidth: 2,
    borderColor: '#1C1C1E',
  },
  conversationInfo: {
    flex: 1,
    marginLeft: 12,
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: '500',
    color: '#ffffff',
  },
  nameUnread: {
    fontWeight: '700',
  },
  time: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.5)',
  },
  lastMessage: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  lastMessageUnread: {
    color: '#ffffff',
    fontWeight: '500',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingTop: 80,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.5)',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.4)',
    marginTop: 8,
    textAlign: 'center',
  },
});
