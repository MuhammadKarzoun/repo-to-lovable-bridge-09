import { Alert } from "@octobots/ui/src/utils";
import FilterByParams from "@octobots/ui/src/components/FilterByParams";
import { NoHeight } from "@octobots/ui-inbox/src/inbox/styles";
import React from "react";
import Spinner from "@octobots/ui/src/components/Spinner";
import client from "@octobots/ui/src/apolloClient";
import { generateParams } from "@octobots/ui-inbox/src/inbox/utils";
import { gql } from "@apollo/client";
import { queries } from "@octobots/ui-inbox/src/inbox/graphql";

type Props = {
  query?: { queryName: string; dataName: string; variables?: any };
  fields?: any[];
  counts: string;
  paramKey: string;
  icon?: string;
  iconFor?: string;
  queryParams?: any;
  refetchRequired: string;
  multiple?: boolean;
  treeView?: boolean;
  setCounts?: (counts: any) => void;
};

type State = {
  fields: any[];
  counts: any;
  loading: boolean;
};

export default class FilterList extends React.PureComponent<Props, State> {
  mounted: boolean;

  private abortController;

  constructor(props: Props) {
    super(props);

    this.abortController = new AbortController();

    let loading = true;

    if (props.fields) {
      loading = false;
    }

    this.mounted = false;

    this.state = {
      fields: props.fields || [],
      counts: {},
      loading,
    };
  }

  fetchData(ignoreCache = false) {
    const { query, counts, queryParams, setCounts } = this.props;

    this.mounted = true;

    // Fetching filter lists channels, brands, tags etc
    if (query) {
      const { queryName, dataName, variables = {} } = query;

      client
        .query({
          query: gql(queries[queryName]),
          variables,
        })
        .then(({ data, loading }: any) => {
          if (this.mounted) {
            this.setState({ fields: data[dataName], loading });
          }
        })
        .catch((e) => {
          Alert.error(e.message);
        });
    }

    // Fetching count query
    client
      .query({
        query: gql(queries.conversationCounts),
        variables: { ...generateParams({ ...queryParams }), only: counts },
        fetchPolicy: ignoreCache ? "network-only" : "cache-first",
        // context: {
        //   fetchOptions: { signal: this.abortController.signal }
        // }
      })
      .then(({ data, loading }: { data: any; loading: boolean }) => {
        if (this.mounted) {
          this.setState({ counts: data.conversationCounts[counts], loading });

          if (setCounts) {
            setCounts({ [counts]: data.conversationCounts[counts] });
          }
        }
      })
      .catch((e) => {
        Alert.error(e.message);
      });
  }

  componentDidMount() {
    this.fetchData();
  }

  componentWillUnmount() {
    this.mounted = false;
    this.abortController.abort();
  }

  componentDidUpdate(prevProps) {
    const { queryParams, refetchRequired } = this.props;

    if (prevProps.refetchRequired !== refetchRequired) {
      return this.fetchData(true);
    }

    if (prevProps.queryParams === queryParams) {
      return;
    }

    return this.fetchData(true);
  }

  render() {
    const { paramKey, icon, multiple, treeView, iconFor } = this.props;
    const { counts, fields, loading } = this.state;

    if (loading) {
      return <Spinner objective={true} />;
    }

    return (
      <NoHeight>
        <FilterByParams
          fields={fields}
          paramKey={paramKey}
          counts={counts}
          icon={icon}
          iconFor={iconFor}
          loading={false}
          searchable={false}
          multiple={multiple}
          treeView={treeView}
        />
      </NoHeight>
    );
  }
}
