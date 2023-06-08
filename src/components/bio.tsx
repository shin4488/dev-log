/**
 * Bio component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.com/docs/use-static-query/
 */

import * as React from 'react';

const Bio: React.FC = () => {
  return (
    <div>
      <div>
        このサイト内への要望などございましたら、GitHubの
        <a href="https://github.com/shin4488/dev-log/issues" target="_blank">
          Issues
        </a>
        を登録していただけますと幸いです。
      </div>
    </div>
  );
};

export default Bio;
