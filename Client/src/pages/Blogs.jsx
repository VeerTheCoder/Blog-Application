import React, { useState, useEffect } from "react";
import axios from "axios";
import Blogcard from "../components/Blogcard";

const Blogs = () => {
  const [blog, setBlog] = useState();
  const getAllBlog = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:5000/api/v1/blog/all-blog"
      );
      if (data && data.success) {
        setBlog(data?.blog);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getAllBlog();
  }, []);

  return (
    <>
      {blog &&
        blog.map((blogdata) => (
          <Blogcard
            id={blogdata?._id}
            isUser={localStorage.getItem("userId") === blogdata?.user?._id}
            title={blogdata?.title}
            description={blogdata?.description}
            image={blogdata?.image}
            username={blogdata?.user?.username}
            time={blogdata?.createdAt}
          />
        ))}
    </>
  );
};

export default Blogs;
