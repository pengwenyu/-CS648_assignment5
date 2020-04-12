const { UserInputError } = require('apollo-server-express');
const { getDb, getNextSequence } = require('./db.js');

async function update(_, { id, changes }) {
const db = getDb();
if (changes.name || changes.category || changes.image) {
const issue = await db.collection('issues').findOne({ id });
Object.assign(issue, changes);
validate(issue);
}
await db.collection('issues').updateOne({ id }, { $set: changes });
const savedIssue = await db.collection('issues').findOne({ id });
return savedIssue;
}

async function get(_, { id }) {
  const db = getDb();
  const issue = await db.collection('issues').findOne({ id });
  return issue;
}

async function list() {
const db = getDb();
const issues = await db.collection('issues').find({}).toArray();
return issues;
}

function validate(issue) {
  const errors = [];
  if (issue.name.length < 3) {
    errors.push('Field "name" must be at least 3 characters long.');
  }
  if (errors.length > 0) {
    throw new UserInputError('Invalid input(s)', { errors });
  }
}
async function remove(_, { id }) {
  const db = getDb();
  const issue = await db.collection('issues').findOne({ id });
  if (!issue) return false;
  issue.deleted = new Date();

  let result = await db.collection('deleted_issues').insertOne(issue);
  if (result.insertedId) {
    result = await db.collection('issues').removeOne({ id });
    return result.deletedCount === 1;
  }
  return false;
}

async function add(_, { issue }) {
const db = getDb();
  const newIssue = Object.assign({}, issue);
  newIssue.id = await getNextSequence('issues');
  const result = await db.collection('issues').insertOne(newIssue);
  const savedIssue = await db.collection('issues').findOne({ _id: result.insertedId });
  return savedIssue;
}
module.exports = { list, add, get, update,delete: remove, };