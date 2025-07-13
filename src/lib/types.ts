export interface Category {
  id: string;
  userId?: string;
  name: string;
  archived?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Resource {
  id: string;
  userId?: string;
  title: string;
  url: string;
  description: string;
  categoryId: string;
  createdAt?: Date;
  updatedAt?: Date;
}
