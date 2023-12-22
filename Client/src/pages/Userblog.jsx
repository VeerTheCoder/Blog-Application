import React, { useState, useEffect } from "react";
import axios from "axios";
import Blogcard from "../components/Blogcard";

const Userblog = () => {
  const [blog, setBlog] = useState();

  const getUserBlogs = async () => {
    try {
      const id = localStorage.getItem("userId");
      const { data } = await axios.get(
        `http://localhost:5000/api/v1/blog/user-blog/${id}`
      );
      if (data?.success) {
        setBlog(data?.userblog.blogs);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUserBlogs();
  }, []);
  return (
    <div>
      {blog && blog.length > 0 ? (
        blog.map((blogdata) => (
          <Blogcard
            id={blogdata?._id}
            isUser={true}
            title={blogdata?.title}
            description={blogdata?.description}
            image={blogdata?.image}
            username={blogdata?.user?.username}
            time={blogdata.createdAt}
          />
        ))
      ) : (
        <h3>Loading...</h3>
      )}
    </div>
  );
};

export default Userblog;
