import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaBell, FaCircle, FaCheck } from 'react-icons/fa';
import { getNotifications, markNotificationAsRead } from '../../services/api';
import { wsService } from '../../services/websocket';

const NotificationContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const NotificationIcon = styled.div`
  cursor: pointer;
  position: relative;
`;

const NotificationBadge = styled.span`
  position: absolute;
  top: -8px;
  right: -8px;
  background-color: #dc3545;
  color: white;
  border-radius: 50%;
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  min-width: 18px;
  text-align: center;
`;

const NotificationPanel = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  width: 320px;
  max-height: 400px;
  overflow-y: auto;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  margin-top: 0.5rem;
`;

const NotificationItem = styled.div<{ unread: boolean }>`
  padding: 1rem;
  border-bottom: 1px solid #e0e0e0;
  background: ${props => props.unread ? '#f8f9fa' : 'white'};
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f1f3f5;
  }

  &:last-child {
    border-bottom: none;
  }
`;

const NotificationTitle = styled.div`
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const NotificationMessage = styled.p`
  color: #666;
  font-size: 0.875rem;
  margin: 0;
`;

const NotificationTime = styled.span`
  font-size: 0.75rem;
  color: #888;
`;

const UnreadIndicator = styled(FaCircle)`
  color: #007bff;
  font-size: 0.5rem;
  margin-right: 0.5rem;
`;

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'withdrawal' | 'deposit' | 'bet' | 'user' | 'system';
  timestamp: string;
  read: boolean;
}

export const NotificationsSystem: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showPanel, setShowPanel] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
    
    // Subscribe to WebSocket notifications
    const unsubscribe = wsService.subscribe('notification', (notification: Notification) => {
      setNotifications(prev => [notification, ...prev]);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await getNotifications();
      setNotifications(response.data);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.read) {
      try {
        await markNotificationAsRead(notification.id);
        setNotifications(notifications.map(n => 
          n.id === notification.id ? { ...n, read: true } : n
        ));
        // Inform other clients about the read status
        wsService.send('notification_read', { id: notification.id });
      } catch (error) {
        console.error('Failed to mark notification as read:', error);
      }
    }
    
    // Handle navigation based on notification type
    switch (notification.type) {
      case 'withdrawal':
        // Navigate to transactions tab with withdrawal filter
        break;
      case 'deposit':
        // Navigate to transactions tab with deposit filter
        break;
      case 'bet':
        // Navigate to bets tab
        break;
      case 'user':
        // Navigate to users tab
        break;
      default:
        break;
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationContainer>
      <NotificationIcon onClick={() => setShowPanel(!showPanel)}>
        <FaBell size={20} />
        {unreadCount > 0 && <NotificationBadge>{unreadCount}</NotificationBadge>}
      </NotificationIcon>

      {showPanel && (
        <NotificationPanel>
          {loading ? (
            <NotificationItem unread={false}>
              <NotificationMessage>Loading notifications...</NotificationMessage>
            </NotificationItem>
          ) : notifications.length === 0 ? (
            <NotificationItem unread={false}>
              <NotificationMessage>No notifications</NotificationMessage>
            </NotificationItem>
          ) : (
            notifications.map(notification => (
              <NotificationItem
                key={notification.id}
                unread={!notification.read}
                onClick={() => handleNotificationClick(notification)}
              >
                <NotificationTitle>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    {!notification.read && <UnreadIndicator />}
                    {notification.title}
                  </div>
                  {notification.read && <FaCheck size={12} color="#28a745" />}
                </NotificationTitle>
                <NotificationMessage>{notification.message}</NotificationMessage>
                <NotificationTime>
                  {new Date(notification.timestamp).toLocaleString()}
                </NotificationTime>
              </NotificationItem>
            ))
          )}
        </NotificationPanel>
      )}
    </NotificationContainer>
  );
}; 