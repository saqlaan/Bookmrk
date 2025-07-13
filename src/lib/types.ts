export interface Category {
  id: string;
  name: string;
  archived?: boolean;
}

export interface Resource {
  id: string;
  title: string;
  url: string;
  description: string;
  categoryId: string;
}
