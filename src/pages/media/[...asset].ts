import { allContentAssets } from '../../../scripts/content-assets.mjs';

export async function getStaticPaths() {
  return (await allContentAssets()).map((asset) => ({
    params: { asset: asset.name },
    props: { bytes: asset.bytes },
  }));
}

export function GET({ props }: { props: { bytes: Uint8Array } }) {
  return new Response(new Uint8Array(props.bytes));
}
