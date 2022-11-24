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
  battleRequests?: Maybe<Array<Maybe<BattleRequest>>>;
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

export type BattleRequest = {
  __typename?: 'BattleRequest';
  battle?: Maybe<Battle>;
  id: Scalars['ID'];
  user?: Maybe<User>;
  validated?: Maybe<Scalars['Boolean']>;
};

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
  approveBattleRequest?: Maybe<Scalars['Boolean']>;
  chooseSong?: Maybe<BattleUser>;
  createBattle?: Maybe<Battle>;
  deleteBattle?: Maybe<Scalars['Boolean']>;
  deleteUser?: Maybe<Scalars['Boolean']>;
  likeDislike?: Maybe<BattleOrComment>;
  login?: Maybe<LoginResponse>;
  register?: Maybe<User>;
  removeBattleRequest?: Maybe<Scalars['Boolean']>;
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


export type MutationApproveBattleRequestArgs = {
  battleRequestId: Scalars['Int'];
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


export type MutationRemoveBattleRequestArgs = {
  battleRequestId: Scalars['Int'];
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
  getAllBattleRequests?: Maybe<Array<Maybe<BattleRequest>>>;
  getAllBattleUsers?: Maybe<Array<Maybe<BattleUser>>>;
  getBattle?: Maybe<Battle>;
  getBattleRequest?: Maybe<BattleRequest>;
  getBattleRequests?: Maybe<Array<Maybe<BattleRequest>>>;
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
  manage: Scalars['Boolean'];
};


export type QueryGetBattleRequestArgs = {
  battleRequestId: Scalars['Int'];
};


export type QueryGetBattleRequestsArgs = {
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


export type QueryGetUsersArgs = {
  search?: InputMaybe<Scalars['String']>;
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

export type AddBattleUserMutationVariables = Exact<{
  battleId: Scalars['Int'];
  userId: Scalars['Int'];
}>;


export type AddBattleUserMutation = { __typename?: 'Mutation', addBattleUser?: boolean | null };

export type ApproveBattleRequestMutationVariables = Exact<{
  battleRequestId: Scalars['Int'];
}>;


export type ApproveBattleRequestMutation = { __typename?: 'Mutation', approveBattleRequest?: boolean | null };

export type CreateBattleMutationVariables = Exact<{
  title: Scalars['String'];
}>;


export type CreateBattleMutation = { __typename?: 'Mutation', createBattle?: { __typename?: 'Battle', id: string, title: string, status: string, likeDislikeCount?: number | null, expires?: string | null, createdAt?: string | null } | null };

export type GetBattleQueryVariables = Exact<{
  battleId: Scalars['Int'];
  manage: Scalars['Boolean'];
}>;


export type GetBattleQuery = { __typename?: 'Query', getBattle?: { __typename?: 'Battle', id: string, uuid: string, title: string, status: string, likeDislikeCount?: number | null, expires?: string | null, createdAt?: string | null, battleUsers?: Array<{ __typename?: 'BattleUser', battleCreator?: boolean | null, createdAt?: string | null, id: string, songArtist?: string | null, songAlbum?: string | null, isWinner?: boolean | null, songImage?: string | null, songLink?: string | null, songName?: string | null, voteCount?: number | null, user?: { __typename?: 'User', id: string, email: string, username: string } | null } | null> | null, battleRequests?: Array<{ __typename?: 'BattleRequest', id: string, validated?: boolean | null, user?: { __typename?: 'User', id: string, email: string, username: string, createdAt?: string | null } | null } | null> | null } | null };

export type GetBattleRequestsQueryVariables = Exact<{
  battleId: Scalars['Int'];
}>;


export type GetBattleRequestsQuery = { __typename?: 'Query', getBattleRequests?: Array<{ __typename?: 'BattleRequest', id: string, validated?: boolean | null, user?: { __typename?: 'User', id: string, username: string, email: string, createdAt?: string | null } | null } | null> | null };

export type GetUsersQueryVariables = Exact<{
  search?: InputMaybe<Scalars['String']>;
}>;


export type GetUsersQuery = { __typename?: 'Query', getUsers?: Array<{ __typename?: 'User', id: string, username: string, email: string, createdAt?: string | null } | null> | null };

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

export type RemoveBattleRequestMutationVariables = Exact<{
  battleRequestId: Scalars['Int'];
}>;


export type RemoveBattleRequestMutation = { __typename?: 'Mutation', removeBattleRequest?: boolean | null };

export type RemoveBattleUserMutationVariables = Exact<{
  battleUserId: Scalars['Int'];
}>;


export type RemoveBattleUserMutation = { __typename?: 'Mutation', removeBattleUser?: boolean | null };

export type TestQueryVariables = Exact<{ [key: string]: never; }>;


export type TestQuery = { __typename?: 'Query', test?: string | null };


export const AddBattleUserDocument = gql`
    mutation AddBattleUser($battleId: Int!, $userId: Int!) {
  addBattleUser(battleId: $battleId, userId: $userId)
}
    `;
export type AddBattleUserMutationFn = Apollo.MutationFunction<AddBattleUserMutation, AddBattleUserMutationVariables>;

/**
 * __useAddBattleUserMutation__
 *
 * To run a mutation, you first call `useAddBattleUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddBattleUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addBattleUserMutation, { data, loading, error }] = useAddBattleUserMutation({
 *   variables: {
 *      battleId: // value for 'battleId'
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useAddBattleUserMutation(baseOptions?: Apollo.MutationHookOptions<AddBattleUserMutation, AddBattleUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddBattleUserMutation, AddBattleUserMutationVariables>(AddBattleUserDocument, options);
      }
export type AddBattleUserMutationHookResult = ReturnType<typeof useAddBattleUserMutation>;
export type AddBattleUserMutationResult = Apollo.MutationResult<AddBattleUserMutation>;
export type AddBattleUserMutationOptions = Apollo.BaseMutationOptions<AddBattleUserMutation, AddBattleUserMutationVariables>;
export const ApproveBattleRequestDocument = gql`
    mutation ApproveBattleRequest($battleRequestId: Int!) {
  approveBattleRequest(battleRequestId: $battleRequestId)
}
    `;
export type ApproveBattleRequestMutationFn = Apollo.MutationFunction<ApproveBattleRequestMutation, ApproveBattleRequestMutationVariables>;

/**
 * __useApproveBattleRequestMutation__
 *
 * To run a mutation, you first call `useApproveBattleRequestMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useApproveBattleRequestMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [approveBattleRequestMutation, { data, loading, error }] = useApproveBattleRequestMutation({
 *   variables: {
 *      battleRequestId: // value for 'battleRequestId'
 *   },
 * });
 */
export function useApproveBattleRequestMutation(baseOptions?: Apollo.MutationHookOptions<ApproveBattleRequestMutation, ApproveBattleRequestMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ApproveBattleRequestMutation, ApproveBattleRequestMutationVariables>(ApproveBattleRequestDocument, options);
      }
export type ApproveBattleRequestMutationHookResult = ReturnType<typeof useApproveBattleRequestMutation>;
export type ApproveBattleRequestMutationResult = Apollo.MutationResult<ApproveBattleRequestMutation>;
export type ApproveBattleRequestMutationOptions = Apollo.BaseMutationOptions<ApproveBattleRequestMutation, ApproveBattleRequestMutationVariables>;
export const CreateBattleDocument = gql`
    mutation CreateBattle($title: String!) {
  createBattle(title: $title) {
    id
    title
    status
    likeDislikeCount
    expires
    createdAt
  }
}
    `;
export type CreateBattleMutationFn = Apollo.MutationFunction<CreateBattleMutation, CreateBattleMutationVariables>;

/**
 * __useCreateBattleMutation__
 *
 * To run a mutation, you first call `useCreateBattleMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateBattleMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createBattleMutation, { data, loading, error }] = useCreateBattleMutation({
 *   variables: {
 *      title: // value for 'title'
 *   },
 * });
 */
export function useCreateBattleMutation(baseOptions?: Apollo.MutationHookOptions<CreateBattleMutation, CreateBattleMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateBattleMutation, CreateBattleMutationVariables>(CreateBattleDocument, options);
      }
export type CreateBattleMutationHookResult = ReturnType<typeof useCreateBattleMutation>;
export type CreateBattleMutationResult = Apollo.MutationResult<CreateBattleMutation>;
export type CreateBattleMutationOptions = Apollo.BaseMutationOptions<CreateBattleMutation, CreateBattleMutationVariables>;
export const GetBattleDocument = gql`
    query GetBattle($battleId: Int!, $manage: Boolean!) {
  getBattle(battleId: $battleId, manage: $manage) {
    id
    uuid
    title
    status
    likeDislikeCount
    expires
    createdAt
    battleUsers {
      battleCreator
      createdAt
      id
      songArtist
      songAlbum
      isWinner
      songImage
      songLink
      songName
      user {
        id
        email
        username
      }
      voteCount
    }
    battleRequests {
      id
      validated
      user {
        id
        email
        username
        createdAt
      }
    }
  }
}
    `;

/**
 * __useGetBattleQuery__
 *
 * To run a query within a React component, call `useGetBattleQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetBattleQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetBattleQuery({
 *   variables: {
 *      battleId: // value for 'battleId'
 *      manage: // value for 'manage'
 *   },
 * });
 */
export function useGetBattleQuery(baseOptions: Apollo.QueryHookOptions<GetBattleQuery, GetBattleQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetBattleQuery, GetBattleQueryVariables>(GetBattleDocument, options);
      }
export function useGetBattleLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetBattleQuery, GetBattleQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetBattleQuery, GetBattleQueryVariables>(GetBattleDocument, options);
        }
export type GetBattleQueryHookResult = ReturnType<typeof useGetBattleQuery>;
export type GetBattleLazyQueryHookResult = ReturnType<typeof useGetBattleLazyQuery>;
export type GetBattleQueryResult = Apollo.QueryResult<GetBattleQuery, GetBattleQueryVariables>;
export const GetBattleRequestsDocument = gql`
    query GetBattleRequests($battleId: Int!) {
  getBattleRequests(battleId: $battleId) {
    id
    user {
      id
      username
      email
      createdAt
    }
    validated
  }
}
    `;

/**
 * __useGetBattleRequestsQuery__
 *
 * To run a query within a React component, call `useGetBattleRequestsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetBattleRequestsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetBattleRequestsQuery({
 *   variables: {
 *      battleId: // value for 'battleId'
 *   },
 * });
 */
export function useGetBattleRequestsQuery(baseOptions: Apollo.QueryHookOptions<GetBattleRequestsQuery, GetBattleRequestsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetBattleRequestsQuery, GetBattleRequestsQueryVariables>(GetBattleRequestsDocument, options);
      }
export function useGetBattleRequestsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetBattleRequestsQuery, GetBattleRequestsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetBattleRequestsQuery, GetBattleRequestsQueryVariables>(GetBattleRequestsDocument, options);
        }
export type GetBattleRequestsQueryHookResult = ReturnType<typeof useGetBattleRequestsQuery>;
export type GetBattleRequestsLazyQueryHookResult = ReturnType<typeof useGetBattleRequestsLazyQuery>;
export type GetBattleRequestsQueryResult = Apollo.QueryResult<GetBattleRequestsQuery, GetBattleRequestsQueryVariables>;
export const GetUsersDocument = gql`
    query GetUsers($search: String) {
  getUsers(search: $search) {
    id
    username
    email
    createdAt
  }
}
    `;

/**
 * __useGetUsersQuery__
 *
 * To run a query within a React component, call `useGetUsersQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUsersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUsersQuery({
 *   variables: {
 *      search: // value for 'search'
 *   },
 * });
 */
export function useGetUsersQuery(baseOptions?: Apollo.QueryHookOptions<GetUsersQuery, GetUsersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetUsersQuery, GetUsersQueryVariables>(GetUsersDocument, options);
      }
export function useGetUsersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUsersQuery, GetUsersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetUsersQuery, GetUsersQueryVariables>(GetUsersDocument, options);
        }
export type GetUsersQueryHookResult = ReturnType<typeof useGetUsersQuery>;
export type GetUsersLazyQueryHookResult = ReturnType<typeof useGetUsersLazyQuery>;
export type GetUsersQueryResult = Apollo.QueryResult<GetUsersQuery, GetUsersQueryVariables>;
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
export const RemoveBattleRequestDocument = gql`
    mutation RemoveBattleRequest($battleRequestId: Int!) {
  removeBattleRequest(battleRequestId: $battleRequestId)
}
    `;
export type RemoveBattleRequestMutationFn = Apollo.MutationFunction<RemoveBattleRequestMutation, RemoveBattleRequestMutationVariables>;

/**
 * __useRemoveBattleRequestMutation__
 *
 * To run a mutation, you first call `useRemoveBattleRequestMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveBattleRequestMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeBattleRequestMutation, { data, loading, error }] = useRemoveBattleRequestMutation({
 *   variables: {
 *      battleRequestId: // value for 'battleRequestId'
 *   },
 * });
 */
export function useRemoveBattleRequestMutation(baseOptions?: Apollo.MutationHookOptions<RemoveBattleRequestMutation, RemoveBattleRequestMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RemoveBattleRequestMutation, RemoveBattleRequestMutationVariables>(RemoveBattleRequestDocument, options);
      }
export type RemoveBattleRequestMutationHookResult = ReturnType<typeof useRemoveBattleRequestMutation>;
export type RemoveBattleRequestMutationResult = Apollo.MutationResult<RemoveBattleRequestMutation>;
export type RemoveBattleRequestMutationOptions = Apollo.BaseMutationOptions<RemoveBattleRequestMutation, RemoveBattleRequestMutationVariables>;
export const RemoveBattleUserDocument = gql`
    mutation RemoveBattleUser($battleUserId: Int!) {
  removeBattleUser(battleUserId: $battleUserId)
}
    `;
export type RemoveBattleUserMutationFn = Apollo.MutationFunction<RemoveBattleUserMutation, RemoveBattleUserMutationVariables>;

/**
 * __useRemoveBattleUserMutation__
 *
 * To run a mutation, you first call `useRemoveBattleUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveBattleUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeBattleUserMutation, { data, loading, error }] = useRemoveBattleUserMutation({
 *   variables: {
 *      battleUserId: // value for 'battleUserId'
 *   },
 * });
 */
export function useRemoveBattleUserMutation(baseOptions?: Apollo.MutationHookOptions<RemoveBattleUserMutation, RemoveBattleUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RemoveBattleUserMutation, RemoveBattleUserMutationVariables>(RemoveBattleUserDocument, options);
      }
export type RemoveBattleUserMutationHookResult = ReturnType<typeof useRemoveBattleUserMutation>;
export type RemoveBattleUserMutationResult = Apollo.MutationResult<RemoveBattleUserMutation>;
export type RemoveBattleUserMutationOptions = Apollo.BaseMutationOptions<RemoveBattleUserMutation, RemoveBattleUserMutationVariables>;
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