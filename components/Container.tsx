import Header from "./header";
import Footer from "./footer";
import Content from "./Content";
import Head from "next/head";
import PropTypes from "prop-types";

const Container = ({ children, title }) => {
  return (
    <div>
      <Head>
        <title>{title}</title>
      </Head>
      <div className={`wrapper font-sans`}>
        <Header />
        <main>
          <Content>{children}</Content>
        </main>
        <Footer />
      </div>
    </div>
  );
};

Container.propTypes = {
  children: PropTypes.node,
};

export default Container;
