import { AuthenticationError } from "apollo-server-express";
import User from "../models/User.js";
import { signToken } from "../services/auth.js";

// TypeScript interfaces for clarity
interface Book {
  bookId: string;
  authors: string[];
  description: string;
  title: string;
  image: string;
  link: string;
}

interface UserInterface {
  _id: string;
  username: string;
  email: string;
  password: string;
  bookCount?: number;
  savedBooks?: Book[];
}

const resolvers = {
  Query: {
    // Returns the logged-in user's data
    me: async (
      _parent: unknown,
      _args: unknown,
      context: { user?: UserInterface }
    ): Promise<UserInterface | null> => {
      if (context.user) {
        const foundUser = await User.findOne({ _id: context.user._id });
        if (!foundUser) {
          throw new AuthenticationError("User not found");
        }
        return { ...foundUser.toObject(), _id: foundUser._id.toString() };
      }
      throw new AuthenticationError("Not authenticated");
    },
  },

  Mutation: {
    // Creates a new user, signs a token, and returns both
    addUser: async (
      _parent: unknown,
      {
        username,
        email,
        password,
      }: { username: string; email: string; password: string }
    ): Promise<{ token: string; user: UserInterface }> => {
      const user = await User.create({ username, email, password });
      if (!user) {
        throw new Error("User creation failed");
      }
      const token = signToken(
        user.username,
        user.password,
        user._id.toString()
      );
      return { token, user: { ...user.toObject(), _id: user._id.toString() } };
    },

    // Logs in a user by verifying credentials, signs a token, and returns both
    login: async (
      _parent: unknown,
      { email, password }: { email: string; password: string }
    ): Promise<{ token: string; user: UserInterface }> => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new AuthenticationError("Can't find this user");
      }
      const correctPw = await user.isCorrectPassword(password);
      if (!correctPw) {
        throw new AuthenticationError("Wrong password!");
      }
      const token = signToken(
        user.username,
        user.password,
        user._id.toString()
      );
      return { token, user: { ...user.toObject(), _id: user._id.toString() } };
    },

    // Saves a book to a user's savedBooks array
    saveBook: async (
      _parent: unknown,
      { input }: { input: Book },
      context: { user?: UserInterface }
    ): Promise<UserInterface | null> => {
      if (context.user) {
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $addToSet: { savedBooks: input } },
          { new: true, runValidators: true }
        );
        if (!updatedUser) {
          throw new Error("Could not update user with saved book");
        }
        return { ...updatedUser.toObject(), _id: updatedUser._id.toString() };
      }
      throw new AuthenticationError("You need to be logged in!");
    },

    // Removes a book from a user's savedBooks array by bookId
    removeBook: async (
      _parent: unknown,
      { bookId }: { bookId: string },
      context: { user?: UserInterface }
    ): Promise<UserInterface | null> => {
      if (context.user) {
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { savedBooks: { bookId } } },
          { new: true }
        );
        if (!updatedUser) {
          throw new Error("Could not update user after removing book");
        }
        return { ...updatedUser.toObject(), _id: updatedUser._id.toString() };
      }
      throw new AuthenticationError("You need to be logged in!");
    },
  },
};

// Ensure that the resolvers object is exported as the default export.
export default resolvers;
