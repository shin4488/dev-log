export interface PageProps<T = unknown> {
  location: { pathname: string };
  data: T;
}
