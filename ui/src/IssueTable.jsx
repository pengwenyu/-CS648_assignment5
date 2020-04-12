import React from 'react';
import { Link, NavLink, withRouter } from 'react-router-dom';
function issue$(string) {
  const string1 = '$';
  const string2 = string1 + string;
  return string2;
}

const IssueRow = withRouter(({ issue, location: { search }, deleteIssue,index }) => {
  const selectLocation = { pathname: `/issues/${issue.id}`, search };
  return (
    <tr>
      <td>{issue.id}</td>
      <td>{issue.name}</td>
      <td>{issue$(issue.price)}</td>
      <td>{issue.category}</td>
      <td><Link to={`/image/${issue.id}`}>View</Link></td>
        <Link to={`/edit/${issue.id}`}>Edit</Link>
        {' | '}
        <NavLink to={selectLocation}>Select</NavLink>
        {' | '}
        <button type="button" onClick={() => { deleteIssue(index); }}>
          Delete
        </button>
    </tr>
  );
});

export default function IssueTable({ issues, deleteIssue }) {
const issueRows = issues.map((issue, index) => (
    <IssueRow
      key={issue.id}
      issue={issue}
      deleteIssue={deleteIssue}
      index={index}
    />
  ));
  return (
    <table className="bordered-table" border="2">
      <thead>
        <tr>
          <th>Product ID</th>
          <th>Product Name</th>
          <th>Price</th>
          <th>Category</th>
          <th>Image</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {issueRows}
      </tbody>
    </table>
  );
}