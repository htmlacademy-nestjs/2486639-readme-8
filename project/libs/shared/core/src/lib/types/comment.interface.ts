export interface Comment {
  id?: string;
  message: string;
  postId: string;
  userId: string;
  createdAt?: Date;
}
