import React from 'react';
import graphQLFetch from './graphQLFetch.js';
import { Link } from 'react-router-dom';
import NumInput from './NumInput.jsx';
import TextInput from './TextInput.jsx';
export default class IssueEdit extends React.Component {
	constructor() {
    super();
    this.state = {
    issue: {},
	invalidFields: {},
    };
    this.onChange = this.onChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
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
	async handleSubmit(e) {
    e.preventDefault();
    const { issue, invalidFields } = this.state;
    if (Object.keys(invalidFields).length !== 0) return;
	const query = `mutation issueUpdate(
      $id: Int!
      $changes: IssueUpdateInputs!
    ) {
      issueUpdate(
        id: $id
        changes: $changes
      ) {
        id name price category image
      }
    }`;

    const { id, created, ...changes } = issue;
    const data = await graphQLFetch(query, { changes, id });
    if (data) {
      this.setState({ issue: data.issueUpdate });
      alert('Updated issue successfully'); // eslint-disable-line no-alert
    }
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
    if (id == null) {
        if (propsId != null) {
            return <h3>{`Issue with ID ${propsId} not found.`}</h3>;
        }
        return null;
    }
    const { invalidFields } = this.state;
    let validationMessage;
    if (Object.keys(invalidFields).length !== 0) {
      validationMessage = (
        <div className="error">
          Please correct invalid fields before submitting.
        </div>
      );
    }
    const { issue: { name, category } } = this.state;
    const { issue: { price, image } } = this.state;
    return (
      <form onSubmit={this.handleSubmit}>
        <h3>{`Editing issue: ${id}`}</h3>
        <table>
          <tbody>
            <tr>
              <td>Name:</td>
              <td>{name.toString()}</td>
            </tr>
            <tr>
              <td>Category:</td>
              <td>
                <select name="category" value={category} onChange={this.onChange}>
                  <option value="Shirts">Shirts</option>
                  <option value="Jeans">Jeans</option>
                  <option value="Jackets">Jackets</option>
                  <option value="Sweaters">Sweaters</option>
                  <option value="Accessories">Accessories</option>
                </select>
              </td>
            </tr>
            <tr>
              <td>Price:</td>
              <td>
                <NumInput
                  name="price"
                  value={price}
                  onChange={this.onChange}
                  key={id}
                />
              </td>
            </tr>
            <tr>
              <td>Image:</td>
              <td>
                <TextInput
                  name="image"
                  value={image}
                  onChange={this.onChange}
                  key={id}
                />
              </td>
            </tr>
            <tr>
              <td />
              <td><button type="submit">Submit</button></td>
            </tr>
          </tbody>
        </table>
       {validationMessage}
        <Link to={`/edit/${id - 1}`}>Prev</Link>
        {' | '}
        <Link to={`/edit/${id + 1}`}>Next</Link>
      </form>
    );
  }
}