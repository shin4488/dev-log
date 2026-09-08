export interface Post {
  fields: { slug: string };
  frontmatter: {
    title: string;
    createdDate: string;
    updatedDate?: string;
    description?: string;
    tags?: string[];
  };
  excerpt: string;
  seoExcerpt: string;
  html: string;
  feedHtml: string;
}

export interface PageProps<T = unknown> {
  location: { pathname: string };
  data: T;
}
export interface BlogData {
  allMarkdownRemark: { nodes: Post[] };
}
export interface TagData {
  tags: { group: { tag: string; totalCount: number }[] };
}
export interface PostData {
  markdownRemark: Post;
  previous: Post | null;
  next: Post | null;
}
