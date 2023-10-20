export interface Post {
  id: string;
  slug: string;
  title: string;
  body: string;
  author: User;
  authorId: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  posts: Post[];
  avatarImage: string;
}
