import Head from "next/head";

const Seo = ({ pageTitle }) => (
  <>
    <Head>
      <title>
        {pageTitle &&
          `${pageTitle} | TracerHire`}
      </title>
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, shrink-to-fit=no"
      />
    </Head>
  </>
);

export default Seo;
