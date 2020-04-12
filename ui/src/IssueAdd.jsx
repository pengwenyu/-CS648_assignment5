import React from 'react';
import PropTypes from 'prop-types';

export default class IssueAdd extends React.Component {
  constructor() {
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    const form = document.forms.issueAdd;
    const issue = {
      category: form.category.value,
      price: form.price.value.replace('$', ''),
      name: form.name.value,
      image: form.image.value,
    };
    const { createIssue } = this.props;
    createIssue(issue);
    form.category.value = 'Shirts';
    form.price.value = '$';
    form.name.value = '';
    form.image.value = '';
  }

  render() {
    return (
      <form name="issueAdd" onSubmit={this.handleSubmit}>
        Category:
        <br />
        <select name="category">
          <option value="Shirts">Shirts</option>
          <option value="Jeans">Jeans</option>
          <option value="Jackets">Jackets</option>
          <option value="Sweaters">Sweaters</option>
          <option value="Accessories">Accessories</option>
        </select>
        <br />
        Price Per Unit:
        <br />
        <input type="text" name="price" placeholder="$" />
        <br />
        Product Name:
        <br />
        <input type="text" name="name" placeholder="Product Name" />
        <br />
        Image URL:
        <br />
        <input type="text" name="image" placeholder="Image" />
        <br />
        <button type="submit">Add Product</button>
      </form>
    );
  }
}