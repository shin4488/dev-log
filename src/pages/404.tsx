import * as React from 'react';
import { PageProps, graphql, HeadFC } from 'gatsby';
import Layout from '@/components/layout';
import Seo from '@/components/seo';
import { NotFoundQuery } from '~/gatsby-graphql';

const NotFoundPage: React.FC<PageProps<NotFoundQuery>> = ({ location }) => {
  return (
    <Layout location={location}>
      <h1>404: Not Found</h1>
      <p>You just hit a route that doesn&#39;t exist...</p>
    </Layout>
  );
};

export const Head: HeadFC<NotFoundQuery> = () => <Seo title="404: Not Found" />;

export default NotFoundPage;

export const pageQuery = graphql`
  query NotFound {
    site {
      siteMetadata {
        title
      }
    }
  }
`;
