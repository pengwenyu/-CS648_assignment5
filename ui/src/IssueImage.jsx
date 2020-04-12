import React from 'react';
import graphQLFetch from './graphQLFetch.js';

export default class IssueImage extends React.Component {
	constructor() {
    super();
    this.state = {
    issue: {},
	invalidFields: {},
    };
    this.onChange = this.onChange.bind(this);
	this.onValidityChange = this.onValidityChange.bind(this);
}
	componentDidMount() {
    this.loadData();
}
	componentDidUpdate(prevProps) {
    const { match: { params: { id: prevId } } } = prevProps;
    const { match: { params: { id } } } = this.props;
    if (id !== prevId) {
      this.loadData();
    }
}
	onChange(event, naturalValue) {
    const { name, value: textValue } = event.target;
	const value = naturalValue === undefined ? textValue : naturalValue;
    this.setState(prevState => ({
    issue: { ...prevState.issue, [name]: value },
}));
}
	onValidityChange(event, valid) {
    const { name } = event.target;
    this.setState((prevState) => {
      const invalidFields = { ...prevState.invalidFields, [name]: !valid };
      if (valid) delete invalidFields[name];
      return { invalidFields };
    });
  }

	async loadData() {
	const query = `query issue($id: Int!){
    issue(id: $id) {
    id name category price image
}
}`;
	const { match: { params: { id } } } = this.props;	
    const data = await graphQLFetch(query,{ id });
	this.setState({ issue: data ? data.issue : {}, invalidFields: {} });
}
  render() {
    const { issue: { id } } = this.state;
    const { match: { params: { id: propsId } } } = this.props;
    const { issue: { name, image } } = this.state;
    if (id == null) {
      if (propsId != null) {
        return <h3>{`issue with ID ${propsId} not found.`}</h3>;
      }
      return null;
    }
    return (
      <div>
        <h3>{`issue : ${name}`}</h3>
        <img src={image} />
      </div>
    );
  }
}