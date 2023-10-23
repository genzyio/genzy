import React from "react";
import Layout from "@theme/Layout";
import HomepageHeader from "../components/header";
import Benefits from "../components/benefits";
import Features from "../components/features";

export default function Home() {
  return (
    <Layout>
      <HomepageHeader />
      <main>
        <Benefits />
        <Features />
      </main>
    </Layout>
  );
}
