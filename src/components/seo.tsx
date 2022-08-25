/**
 * SEO component that queries for data with
 *  Gatsby's useStaticQuery React hook
 *
 * See: https://www.gatsbyjs.com/docs/use-static-query/
 */

import * as React from 'react';
import PropTypes from 'prop-types';
import { useStaticQuery, graphql } from 'gatsby';
import { ReactNode } from 'react';
import { SeoQuery } from '~/gatsby-graphql';
import ProfileImage from '@/images/my-profile-image.png';

interface SeoParameter {
  description?: string;
  lang?: string;
  title: string;
  image?: string;
  children?: ReactNode;
}

const Seo: React.FC<SeoParameter> = ({
  description,
  title,
  image,
  children,
}) => {
  const { site }: SeoQuery = useStaticQuery(
    graphql`
      query Seo {
        site {
          siteMetadata {
            title
            description
            social {
              twitter
            }
          }
        }
      }
    `,
  );

  const metaDescription = description || site?.siteMetadata?.description || '';
  const defaultTitle = site?.siteMetadata?.title;

  return (
    <>
      <title>{defaultTitle ? `${title} | ${defaultTitle}` : title}</title>
      <meta name="description" content={metaDescription} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={image || ProfileImage} />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary" />
      <meta
        name="twitter:creator"
        content={site?.siteMetadata?.social?.twitter || ``}
      />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={metaDescription} />
      {children}
    </>
  );
};

Seo.defaultProps = {
  description: ``,
};

Seo.propTypes = {
  description: PropTypes.string,
  title: PropTypes.string.isRequired,
};

export default Seo;
