import React from "react";
import Head from "next/head";
import Link from "next/link";
import PaginationStyles from "./styles/PaginationStyles";
import gql from "graphql-tag";
import { Query } from "react-apollo";
import { perPage } from "../config";
const PAGEINATION_QUERY = gql`
  query PAGEINATION_QUERY {
    itemsConnection {
      aggregate {
        count
      }
    }
  }
`;

const Pagination = props => {
  return (
    <Query query={PAGEINATION_QUERY}>
      {({ data, loading, error }) => {
        const count = data.itemsConnection.aggregate.count;
        const pages = Math.ceil(count / perPage);
        const { page } = props;
        if (loading) return <p>Loading...</p>;

        return (
          <PaginationStyles>
            <Head>
              <title>
                Sick Fits | Page {page} of {pages}
              </title>
            </Head>
            <Link
              // in production this will prerender the page (only works in development)
              prefetch
              href={{
                pathname: "items",
                query: { page: page - 1 }
              }}
            >
              <a className="prev" aria-disabled={page <= 1}>
                Prev
              </a>
            </Link>
            <p>
              You are on page {page} of {pages}
            </p>

            <p>{count} items total</p>

            <Link
              prefetch
              href={{
                pathname: "items",
                query: { page: page + 1 }
              }}
            >
              <a className="prev" aria-disabled={page >= pages}>
                Next
              </a>
            </Link>
          </PaginationStyles>
        );
      }}
    </Query>
  );
};

export default Pagination;
