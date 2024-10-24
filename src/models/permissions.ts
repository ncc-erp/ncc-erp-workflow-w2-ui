export interface Permissions {
  id: string;
  name: string;
  code: string;
  creationTime: string;
  children?: Permissions[];
}
