import React, { useContext } from 'react';
import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import { Grid, Image } from 'semantic-ui-react'
import PostCard from '../components/PostCard';
import { FETCH_POSTS_QUERY } from '../utils/graphql'

function Home() {
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
