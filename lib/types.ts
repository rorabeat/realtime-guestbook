export type Guestbook = {
  id: number;
  created_at: string;
  author: string;
  content: string;
  image_url: string;
  image_type: 'upload' | 'drawing';
};

export type Comment = {
  id: number;
  created_at: string;
  guestbook_id: number;
  author: string;
  content: string;
};

export type Database = {
  public: {
    Tables: {
      guestbook: {
        Row: Guestbook;
        Insert: Omit<Guestbook, 'id' | 'created_at'> & { created_at?: string };
        Update: Partial<Omit<Guestbook, 'id'>>;
      };
      comments: {
        Row: Comment;
        Insert: Omit<Comment, 'id' | 'created_at'> & { created_at?: string };
        Update: Partial<Omit<Comment, 'id'>>;
      };
    };
  };
};
