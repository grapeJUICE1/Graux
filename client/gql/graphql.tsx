import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Battle = {
  __typename?: 'Battle';
  battleUsers?: Maybe<Array<Maybe<BattleUser>>>;
  createdAt?: Maybe<Scalars['String']>;
  expires?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  likeDislikeCount?: Maybe<Scalars['Int']>;
  status: Scalars['String'];
  title: Scalars['String'];
  uuid: Scalars['String'];
};

export type BattleOrComment = Battle | Comment;

export type BattleUser = {
  __typename?: 'BattleUser';
  battle?: Maybe<Battle>;
  battleCreator?: Maybe<Scalars['Boolean']>;
  createdAt?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  isWinner?: Maybe<Scalars['Boolean']>;
  songAlbum?: Maybe<Scalars['String']>;
  songArtist?: Maybe<Scalars['String']>;
  songImage?: Maybe<Scalars['String']>;
  songLink?: Maybe<Scalars['String']>;
  songName?: Maybe<Scalars['String']>;
  user?: Maybe<User>;
  voteCount?: Maybe<Scalars['Int']>;
};

export type Comment = {
  __typename?: 'Comment';
  battle?: Maybe<Battle>;
  body: Scalars['String'];
  id: Scalars['ID'];
  likeDislikeCount?: Maybe<Scalars['Int']>;
  user?: Maybe<User>;
};

export type LoginResponse = {
  __typename?: 'LoginResponse';
  accessToken?: Maybe<Scalars['String']>;
  user?: Maybe<User>;
};

export type Mutation = {
  __typename?: 'Mutation';
  addBattleUser?: Maybe<Scalars['Boolean']>;
  addComment?: Maybe<Comment>;
  chooseSong?: Maybe<BattleUser>;
  createBattle?: Maybe<Battle>;
  deleteBattle?: Maybe<Scalars['Boolean']>;
  deleteUser?: Maybe<Scalars['Boolean']>;
  likeDislike?: Maybe<BattleOrComment>;
  login?: Maybe<LoginResponse>;
  register?: Maybe<User>;
  removeBattleUser?: Maybe<Scalars['Boolean']>;
  removeComment?: Maybe<Scalars['Boolean']>;
  startBattle?: Maybe<Scalars['Boolean']>;
  updateBattle?: Maybe<Battle>;
  updateComment?: Maybe<Comment>;
  updateUser?: Maybe<User>;
  vote?: Maybe<Scalars['Boolean']>;
};


export type MutationAddBattleUserArgs = {
  battleId: Scalars['Int'];
  userId: Scalars['Int'];
};


export type MutationAddCommentArgs = {
  battleId: Scalars['Int'];
  body: Scalars['String'];
};


export type MutationChooseSongArgs = {
  battleId: Scalars['Int'];
  songAlbum: Scalars['String'];
  songArtist: Scalars['String'];
  songImage: Scalars['String'];
  songLink: Scalars['String'];
  songName: Scalars['String'];
};


export type MutationCreateBattleArgs = {
  title: Scalars['String'];
};


export type MutationDeleteBattleArgs = {
  battleId: Scalars['Int'];
};


export type MutationLikeDislikeArgs = {
  battleId?: InputMaybe<Scalars['Int']>;
  commentId?: InputMaybe<Scalars['Int']>;
  value: Scalars['Int'];
};


export type MutationLoginArgs = {
  password: Scalars['String'];
  username: Scalars['String'];
};


export type MutationRegisterArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
  username: Scalars['String'];
};


export type MutationRemoveBattleUserArgs = {
  battleUserId: Scalars['Int'];
};


export type MutationRemoveCommentArgs = {
  commentId: Scalars['Int'];
};


export type MutationStartBattleArgs = {
  battleId: Scalars['Int'];
  hoursTillActive: Scalars['Int'];
};


export type MutationUpdateBattleArgs = {
  battleId: Scalars['Int'];
  title: Scalars['String'];
};


export type MutationUpdateCommentArgs = {
  body: Scalars['String'];
  commentId: Scalars['Int'];
};


export type MutationUpdateUserArgs = {
  newEmail: Scalars['String'];
  newUsername: Scalars['String'];
};


export type MutationVoteArgs = {
  battleUserId: Scalars['Int'];
};

export type Query = {
  __typename?: 'Query';
  getAllBattleUsers?: Maybe<Array<Maybe<BattleUser>>>;
  getBattle?: Maybe<Battle>;
  getBattleUsers?: Maybe<Array<Maybe<GetBattleUsersResponse>>>;
  getBattles?: Maybe<Array<Maybe<Battle>>>;
  getComment?: Maybe<Comment>;
  getComments?: Maybe<Array<Maybe<Comment>>>;
  getCommentsOfBattle?: Maybe<Array<Maybe<Comment>>>;
  getUser?: Maybe<User>;
  getUserBattles?: Maybe<Array<Maybe<GetUserBattlesResponse>>>;
  getUsers?: Maybe<Array<Maybe<User>>>;
  me?: Maybe<User>;
  test?: Maybe<Scalars['String']>;
};


export type QueryGetBattleArgs = {
  battleId: Scalars['Int'];
};


export type QueryGetBattleUsersArgs = {
  battleId: Scalars['Int'];
};


export type QueryGetCommentArgs = {
  commentId: Scalars['Int'];
};


export type QueryGetCommentsOfBattleArgs = {
  battleId: Scalars['Int'];
};


export type QueryGetUserArgs = {
  userId: Scalars['Int'];
};


export type QueryGetUserBattlesArgs = {
  userId: Scalars['Int'];
};

export type User = {
  __typename?: 'User';
  battleSongs?: Maybe<Array<Maybe<BattleUser>>>;
  createdAt?: Maybe<Scalars['String']>;
  email: Scalars['String'];
  id: Scalars['ID'];
  username: Scalars['String'];
};

export type GetBattleUsersResponse = {
  __typename?: 'getBattleUsersResponse';
  user?: Maybe<User>;
};

export type GetUserBattlesResponse = {
  __typename?: 'getUserBattlesResponse';
  battle?: Maybe<Battle>;
};

export type LoginMutationVariables = Exact<{
  username: Scalars['String'];
  password: Scalars['String'];
}>;


export type LoginMutation = { __typename?: 'Mutation', login?: { __typename?: 'LoginResponse', accessToken?: string | null, user?: { __typename?: 'User', id: string, username: string, email: string } | null } | null };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me?: { __typename?: 'User', id: string, email: string, username: string } | null };

export type RegisterMutationVariables = Exact<{
  username: Scalars['String'];
  email: Scalars['String'];
  password: Scalars['String'];
}>;


export type RegisterMutation = { __typename?: 'Mutation', register?: { __typename?: 'User', id: string, email: string, createdAt?: string | null, username: string } | null };

export type TestQueryVariables = Exact<{ [key: string]: never; }>;


export type TestQuery = { __typename?: 'Query', test?: string | null };


export const LoginDocument = gql`
    mutation Login($username: String!, $password: String!) {
  login(username: $username, password: $password) {
    accessToken
    user {
      id
      username
      email
    }
  }
}
    `;
export type LoginMutationFn = Apollo.MutationFunction<LoginMutation, LoginMutationVariables>;

/**
 * __useLoginMutation__
 *
 * To run a mutation, you first call `useLoginMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginMutation, { data, loading, error }] = useLoginMutation({
 *   variables: {
 *      username: // value for 'username'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useLoginMutation(baseOptions?: Apollo.MutationHookOptions<LoginMutation, LoginMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument, options);
      }
export type LoginMutationHookResult = ReturnType<typeof useLoginMutation>;
export type LoginMutationResult = Apollo.MutationResult<LoginMutation>;
export type LoginMutationOptions = Apollo.BaseMutationOptions<LoginMutation, LoginMutationVariables>;
export const MeDocument = gql`
    query Me {
  me {
    id
    email
    username
  }
}
    `;

/**
 * __useMeQuery__
 *
 * To run a query within a React component, call `useMeQuery` and pass it any options that fit your needs.
 * When your component renders, `useMeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMeQuery({
 *   variables: {
 *   },
 * });
 */
export function useMeQuery(baseOptions?: Apollo.QueryHookOptions<MeQuery, MeQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MeQuery, MeQueryVariables>(MeDocument, options);
      }
export function useMeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MeQuery, MeQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MeQuery, MeQueryVariables>(MeDocument, options);
        }
export type MeQueryHookResult = ReturnType<typeof useMeQuery>;
export type MeLazyQueryHookResult = ReturnType<typeof useMeLazyQuery>;
export type MeQueryResult = Apollo.QueryResult<MeQuery, MeQueryVariables>;
export const RegisterDocument = gql`
    mutation Register($username: String!, $email: String!, $password: String!) {
  register(username: $username, email: $email, password: $password) {
    id
    email
    createdAt
    username
  }
}
    `;
export type RegisterMutationFn = Apollo.MutationFunction<RegisterMutation, RegisterMutationVariables>;

/**
 * __useRegisterMutation__
 *
 * To run a mutation, you first call `useRegisterMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRegisterMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [registerMutation, { data, loading, error }] = useRegisterMutation({
 *   variables: {
 *      username: // value for 'username'
 *      email: // value for 'email'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useRegisterMutation(baseOptions?: Apollo.MutationHookOptions<RegisterMutation, RegisterMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RegisterMutation, RegisterMutationVariables>(RegisterDocument, options);
      }
export type RegisterMutationHookResult = ReturnType<typeof useRegisterMutation>;
export type RegisterMutationResult = Apollo.MutationResult<RegisterMutation>;
export type RegisterMutationOptions = Apollo.BaseMutationOptions<RegisterMutation, RegisterMutationVariables>;
export const TestDocument = gql`
    query Test {
  test
}
    `;

/**
 * __useTestQuery__
 *
 * To run a query within a React component, call `useTestQuery` and pass it any options that fit your needs.
 * When your component renders, `useTestQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTestQuery({
 *   variables: {
 *   },
 * });
 */
export function useTestQuery(baseOptions?: Apollo.QueryHookOptions<TestQuery, TestQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<TestQuery, TestQueryVariables>(TestDocument, options);
      }
export function useTestLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TestQuery, TestQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<TestQuery, TestQueryVariables>(TestDocument, options);
        }
export type TestQueryHookResult = ReturnType<typeof useTestQuery>;
export type TestLazyQueryHookResult = ReturnType<typeof useTestLazyQuery>;
export type TestQueryResult = Apollo.QueryResult<TestQuery, TestQueryVariables>;