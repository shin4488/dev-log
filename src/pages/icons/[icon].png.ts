import { iconResponse, iconSizes } from '../../lib/icons';

export function getStaticPaths() {
  return iconSizes.map((size) => ({
    params: { icon: `icon-${size}x${size}` },
    props: { size },
  }));
}

export function GET({ props }: { props: { size: number } }) {
  return iconResponse(props.size);
}
