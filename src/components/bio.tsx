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
    <span className="bio">
      {twitterAccountUserName && (
        <>
          エンジニアです。
          <a
            href={`https://twitter.com/${twitterAccountUserName || ``}`}
            target="_blank"
          >
            {`@${twitterAccountUserName}`}
          </a>
        </>
      )}
    </span>
  );
};

export default Bio;
