import { getAllIEOIds, getIEOData } from "../../lib/ieo";

export async function getStaticProps({ params }) {
  const ieoData = getIEOData(params.id);
  return {
    props: { ieoData },
  };
}

export async function getStaticPaths() {
  const paths = getAllIEOIds();
  return {
    paths,
    fallback: true,
  };
}

export default function IEO({ ieoData }) {
  return <div>{ieoData?.id}</div>;
}
