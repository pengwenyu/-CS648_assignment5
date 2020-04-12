import React from 'react';
import IssueFilter from './IssueFilter.jsx';
import IssueTable from './IssueTable.jsx';
import IssueAdd from './IssueAdd.jsx';
import graphQLFetch from './graphQLFetch.js';

export default class IssueList extends React.Component{
  constructor() {
    super();
    this.state = { issues: [] };
    this.createIssue = this.createIssue.bind(this);
    this.deleteIssue = this.deleteIssue.bind(this);
  }

  componentDidMount() {
    this.loadData();
  }

  async loadData() {
    const query = `query {
    issueList {
    id name category price image
}
}`;
    const data = await graphQLFetch(query);
    if (data) {
      this.setState({ issues: data.issueList });
    }
  }

  async createIssue(issue) {
    const query = `mutation issueAdd($issue: IssueInputs!) {
  issueAdd(issue: $issue) {
    id,
        }
    }`;
    const data = await graphQLFetch(query, { issue });
    if (data) {
      this.loadData();
    }
    this.loadData();
  }
  async deleteIssue(index) {
    const query = `mutation issueDelete($id: Int!) {
      issueDelete(id: $id)
    }`;
    const { issues } = this.state;
    const { location: { pathname, search }, history } = this.props;
    const { id } = issues[index];
    const data = await graphQLFetch(query, { id });
    if (data && data.issueDelete) {
      this.setState((prevState) => {
        const newList = [...prevState.issues];
        if (pathname === `/issues/${id}`) {
          history.push({ pathname: '/issues', search });
        }
        newList.splice(index, 1);
        return { issues: newList };
      });
    } else {
      this.loadData();
    }
  }
  render() {
    const { issues } = this.state;
    const { match } = this.props;
    return (
      <React.Fragment>
        <h1>My company Inventory</h1>
        <IssueFilter />
        <hr />
        <IssueTable issues={issues} deleteIssue={this.deleteIssue}/>
        <hr />
        <h2>Add a new product to inventory</h2>
        <IssueAdd createIssue={this.createIssue} />
      </React.Fragment>
    );
  }
}