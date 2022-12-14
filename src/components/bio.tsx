/**
 * Bio component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.com/docs/use-static-query/
 */

import * as React from 'react';
import { useStaticQuery, graphql } from 'gatsby';

const Bio: React.FC = () => {
  const data = useStaticQuery(graphql`
    query BioQuery {
      site {
        siteMetadata {
          author {
            name
            summary
          }
          social {
            twitter
          }
        }
      }
    }
  `);

  // Set these values by editing "siteMetadata" in gatsby-config.js
  const social = data.site.siteMetadata?.social;
  const twitterAccountUserName = social?.twitter;

  return (
    <div>
      {twitterAccountUserName && (
        <>
          <div>
            お問合せは、Twitter（
            <a
              href={`https://twitter.com/${twitterAccountUserName || ``}`}
              target="_blank"
            >
              {`@${twitterAccountUserName}`}
            </a>
            ）のDMにてご連絡お願いいたします。
          </div>
          <div>
            このサイト内への要望などございましたら、GitHubの
            <a
              href="https://github.com/shin4488/dev-log/issues"
              target="_blank"
            >
              Issues
            </a>
            を登録していただけますと幸いです。
          </div>
        </>
      )}
    </div>
  );
};

export default Bio;
