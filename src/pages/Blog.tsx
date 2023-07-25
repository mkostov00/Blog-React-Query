import { Box, Button, Container, FormControl, FormLabel, List, ListItem, Modal, Stack, TextField, Typography } from "@mui/material";
import { useContext, useState } from "react";
import ImgMediaCard from "../components/CardComponent";
import EditModal from "../components/EditModal";
import { BlogContext, IPost } from "../context/BlogPostProvider";
import { UseQueryResult, useQuery } from "@tanstack/react-query";
import { getAllBlogPosts } from "../api/blogPosts";

interface BlogPostData {
  _id: string;
  title: string;
  description: string;
  picture: string;
}

const Blog = () => {
  const {posts, setPosts, singlePost, setSinglePost} = useContext(BlogContext)
  const [isCreatePostModalOpened, setIsCreatePostModalOpened] = useState<boolean>(false)

  const blogPostsQuery: UseQueryResult<any, unknown> = useQuery({
    queryKey: ["blogPosts"],
    queryFn: getAllBlogPosts,
    placeholderData: [{ 
      _id: "1", 
      title: "initial title", 
      description: "initial description", 
      picture: "initial picture" 
    }]
  })

  const handleChange = (e: any) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      setSinglePost((prev: IPost) => ({
        ...prev,
        picture: selectedFile,
      }));
    }
  };
  
  const handleFormSubmit = (e: any) => {
      e.preventDefault()
      setIsCreatePostModalOpened(false)

      setSinglePost((prev: IPost) => ({...prev,
        id: prev.id + 1,
        title: e.currentTarget.title.value,
        description: e.currentTarget.description.value
      }))
      setPosts((prev: any) => [...prev, singlePost])     
  }
    
  const handleDeletePost = (post: any) => {
    const updatedPosts = posts.filter((prev) => prev.id !== post.id)
    setPosts(updatedPosts)
  }

  if (blogPostsQuery.isLoading) return <h1>Loading...</h1>;
  if (blogPostsQuery.isError) {
    return <pre>{JSON.stringify(blogPostsQuery.error)}</pre>;
  }

  const listItems = blogPostsQuery.data.map((post: any) => (
    <ListItem sx={{marginBottom: "50px", maxWidth:"87%"}}
      key={post._id}>
      <ImgMediaCard currentPost={post} />
      <Container sx={{display: "flex", flexDirection: 'column'}}>
        <EditModal currentPost={post} />
        <Button onClick={() => {handleDeletePost(post)}} variant="contained" color="primary" sx={{marginLeft: "-15px", maxWidth: "70px", width: "70px"}}>Delete</Button>
      </Container>
    </ListItem>
  ));

  return (
    <Container>
      <Container sx={{marginTop: "20px", marginLeft: "125px"}}>
        <Typography variant="h4" sx={{marginBottom: "12.5px"}}>Blog Page</Typography>
        <Button disableRipple color="secondary" variant="outlined" onClick={() => setIsCreatePostModalOpened(true)}>Add a new Post</Button>
      </Container>
      <Modal open={isCreatePostModalOpened} onClose={() => setIsCreatePostModalOpened(false)}>
        <Box sx={{
            position: 'absolute',
            top: '15%',
            left: '36%',
            width: 450,
            bgcolor: 'background.paper',
            border: '2px solid #000',
            borderRadius:"10px",
            boxShadow: 24,
            p: 4,
        }}>
            <Typography variant="h5" sx={{marginBottom: '20px'}}>Create a new post</Typography>
            <FormControl component={'form'} onSubmit={handleFormSubmit} >
              <FormLabel sx={{marginBottom: "10px"}}>Enter title</FormLabel>
              <TextField type="text" name="title" label="Title" required onChange={(e) => setSinglePost((prev: IPost) => ({...prev, title: e.target.value}))} sx={{marginBottom: "10px"}}/>
              <FormLabel sx={{marginBottom: "10px"}}>Enter description</FormLabel>
              <TextField type="text" name="description" label="Description" multiline rows={2} required onChange={(e) => setSinglePost((prev: IPost) => ({...prev, description: e.target.value}))} sx={{marginBottom: "10px"}}/>
              <FormLabel sx={{marginBottom: "10px"}}>Insert an image</FormLabel>
              <TextField type="file" name="picture" required onChange={handleChange} sx={{marginBottom: "25px"}}/>
              <Stack direction="row" spacing={1} sx={{marginTop: "5px"}}>
                <Button variant="contained" type="submit" sx={{width: "13vh"}}>Submit</Button>
                <Button sx={{width: "13vh"}} onClick={() => setIsCreatePostModalOpened(false)}>Close</Button>
              </Stack>
            </FormControl>
          </Box>
      </Modal>        
      <Container sx={{display: 'flex', justifyContent: 'center'}}>
        <List>
          {listItems}
        </List>
        {/* <ol>
          {blogPostsQuery.data?.map((post: BlogPostData) => (
            <li key={post._id}>{post.title}</li>
          ))}
        </ol> */}
      </Container>
    </Container>
  );
};
export default Blog