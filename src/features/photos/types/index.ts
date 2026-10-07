export type Photo = {
  id: string;
  dataUrl: string;
  createdAt: string;
};

export type PhotoSort =
  | 'newest'
  | 'oldest';
