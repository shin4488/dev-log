import { IconType } from 'react-icons';
import { FaGithub, FaDev, FaTwitter, FaLinkedin } from 'react-icons/fa';
import { SiQiita } from 'react-icons/si';

interface SnsLink {
  className?: string;
  uri: string;
  title: string;
  iconComponent: IconType;
}

const snsLinkItems: SnsLink[] = [
  {
    uri: 'https://github.com/shin4488',
    title: 'GitHub',
    iconComponent: FaGithub,
  },
  {
    className: 'text-qiita',
    uri: 'https://qiita.com/shin4488',
    title: 'Qiita',
    iconComponent: SiQiita,
  },
  {
    uri: 'https://dev.to/shin4488',
    title: 'dev.to',
    iconComponent: FaDev,
  },
  {
    className: 'text-twitter',
    uri: 'https://twitter.com/shin44880',
    title: 'Twitter',
    iconComponent: FaTwitter,
  },
  {
    className: 'text-linkedin',
    uri: 'https://www.linkedin.com/in/shinya-umeshita-668676240',
    title: 'LinkedIn',
    iconComponent: FaLinkedin,
  },
];

export { snsLinkItems };
