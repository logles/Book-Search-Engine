import { gql } from "apollo-server-express";

const typeDefs = gql`
  type User {
    _id: ID!
    username: String!
    email: String!
    bookCount: Int
    savedBooks: [Book]
  }

  type Book {
    bookId: String!
    authors: [String]
    description: String
    title: String
    image: String
    link: String
  }

  type Auth {
    token: String
    user: User
  }

  type Query {
    me: User
  }

  input BookInput {
    bookId: String!
    authors: [String]
    description: String
    title: String
    image: String
    link: String
  }

  type Mutation {
    addUser(username: String!, email: String!, password: String!): Auth
    login(email: String!, password: String!): Auth
    saveBook(input: BookInput!): User
    removeBook(bookId: String!): User
  }
`;

export default typeDefs;
