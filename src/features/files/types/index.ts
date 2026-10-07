export type FileCategory =
  | 'image'
  | 'video'
  | 'audio'
  | 'document'
  | 'archive'
  | 'code'
  | 'other';

export type StoredFile = {
  id: string;
  name: string;
  type: string;
  category: FileCategory;
  size: number;
  createdAt: number;
  updatedAt: number;
  blob: Blob;
};

export type FileSort =
  | 'name'
  | 'size'
  | 'newest'
  | 'oldest'
  | 'type';
