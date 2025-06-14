import * as React from 'react';
import { IconType } from 'react-icons';
import { FaGithub, FaDev, FaLinkedin } from 'react-icons/fa';
import { RiFileLine } from 'react-icons/ri';
import { SiQiita } from 'react-icons/si';
import { SiZenn } from 'react-icons/si';

interface SnsLink {
  className?: string;
  style?: React.CSSProperties;
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
    uri: 'https://qiita.com/shin4488',
    title: 'Qiita',
    iconComponent: SiQiita,
    style: { color: '#00ca00' },
  },
  {
    style: { color: '#3EA8FF' },
    uri: 'https://zenn.dev/shin4488',
    title: 'Zenn',
    iconComponent: SiZenn,
  },
  {
    uri: 'https://dev.to/shin4488',
    title: 'dev.to',
    iconComponent: FaDev,
  },
  {
    uri: 'https://note.com/shin4488',
    title: 'note',
    iconComponent: RiFileLine,
  },
  {
    uri: 'https://www.linkedin.com/in/shinya-umeshita-668676240',
    title: 'LinkedIn',
    iconComponent: FaLinkedin,
    style: { color: '#0e76a8' },
  },
];

export { snsLinkItems };
