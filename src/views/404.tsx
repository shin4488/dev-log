import * as React from 'react';
import type { PageProps } from '@/lib/types';
import Layout from '@/components/layout';

const NotFoundPage: React.FC<PageProps<never>> = ({ location }) => {
  return (
    <Layout location={location}>
      <h1>404: Not Found</h1>
      <p>You just hit a route that doesn&#39;t exist...</p>
    </Layout>
  );
};

export default NotFoundPage;
