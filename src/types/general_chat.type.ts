interface BaseTestChat {
    id: string;
    type: 'private' | 'group';
    title: string;
    last_message: {
        content: string;
        timestamp: string;
        type: string;
        sender: string;
    };
    unread_count: number;
}

interface PrivateTestChat extends BaseTestChat {
    type: 'private';
    participants: {
        id: number;
        username: string | null;
        full_name: string;
        is_online: boolean;
    };
}

interface GroupTestChat extends BaseTestChat {
    type: 'group';
    participants: {
        total_count: number;
        online_count: number;
        online_members: number[];
    };
}

type TestChat = PrivateTestChat | GroupTestChat;


interface BaseChat {
    id: string;
    type: 'general' | 'private' | 'group' | 'task';
    lastMessage: {
      content: string;
      timestamp: string;
      sender: {
        id: string;
        name: string;
      };
    };
    unreadCount: number;
  }
  
  interface GeneralChat extends BaseChat {
    type: 'general';
    name: string;
    avatar: string;
  }
  
  interface PrivateChat extends BaseChat {
    type: 'private';
    participant: {
      id: string;
      name: string;
      avatar: string;
    };
  }
  
  interface GroupChat extends BaseChat {
    type: 'group';
    name: string;
    avatar: string;
    participantsCount: number;
  }
  
  interface TaskChat extends BaseChat {
    type: 'task';
    taskName: string;
    projectName: string;
    avatar: string;
  }
  
 type Chat = GeneralChat | PrivateChat | GroupChat | TaskChat;