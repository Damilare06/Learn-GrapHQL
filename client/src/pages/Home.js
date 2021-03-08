import React, { useContext } from 'react';
import { useQuery } from '@apollo/client';
import { Grid, Image } from 'semantic-ui-react'
import { AuthContext } from '../context/auth'

import PostCard from '../components/PostCard';
import { FETCH_POSTS_QUERY } from '../utils/graphql';
import PostForm from '../components/PostForm';

function Home() {
  const { user } = useContext(AuthContext)
  const {
    loading,
		error,
    data: { getPosts: posts } = {}
  } = useQuery(FETCH_POSTS_QUERY);
	
	if (error) return `Error! ${error.message}`;
  return (
    <Grid columns={3}>
      <Grid.Row className="page-title">
        <h1>Recent Posts</h1>
      </Grid.Row>
    <Grid.Row>
      { user && (
        <Grid.Column>
          <PostForm/>
        </Grid.Column>
      )}
      {loading ? (
        <h1>Loading posts...</h1>
      ) : (
        posts && posts.map(post =>(
          <Grid.Column key={post.id} style={{marginBottom: 30}}>
            <PostCard post = {post}/>
          </Grid.Column>
        ))
      )}
    </Grid.Row>
    </Grid>
  );
}


export default Home;
