export interface Category {
  id: string;
  name: string;
}

export interface Resource {
  id: string;
  title: string;
  url: string;
  description: string;
  categoryId: string;
}
