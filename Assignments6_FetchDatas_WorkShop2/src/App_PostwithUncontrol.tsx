import { ChangeEvent, MouseEvent, useRef, useState } from "react";

import classNames from "classnames";
import _ from "lodash";
import { v4 as uuidv4 } from "uuid";
import dayjs from "dayjs";

import "./App.scss";
import avatar from "./images/bozai.png";
import avater1 from "./images/jack.png";
import avater2 from "./images/avatar2.png";

// Comment List data
const defaultList = [
  {
    // comment id
    rpid: 3,
    // user info
    user: {
      uid: "13258165",
      avatar: avater1,
      uname: "Jay Zhou",
    },
    // comment content
    content: "Nice, well done",
    // created datetime
    ctime: "10-18 08:15",
    like: 88,
  },
  {
    rpid: 2,
    user: {
      uid: "36080105",
      avatar: avater2,
      uname: "Song Xu",
    },
    content: "I search for you thousands of times, from dawn till dusk.",
    ctime: "11-13 11:29",
    like: 88,
  },
  {
    rpid: 1,
    user: {
      uid: "30009257",
      avatar,
      uname: "John",
    },
    content:
      "I told my computer I needed a break... now it will not stop sending me vacation ads.",
    ctime: "10-19 09:00",
    like: 66,
  },
  {
    rpid: 4,
    user: {
      uid: "30009257",
      avatar,
      uname: "John",
    },
    content: "This is second post from john",
    ctime: "10-19 09:00",
    like: 66,
  },
];
// current logged in user info
const user = {
  // userid
  uid: "30009257",
  // profile
  avatar,
  // username
  uname: "John",
};

// Nav Tab
const tabs = [
  { type: "hot", text: "Top" },
  { type: "newest", text: "Newest" },
];

const UnControllApp = () => {
  interface Comment {
    rpid: number | string;
    user: {
      uid: string;
      avatar: string;
      uname: string;
    };
    content: string;
    ctime: string;
    like: number;
  }
  const [commentList, setCommentList] = useState<Comment[]>(
    _.orderBy(defaultList, "like", "desc")
  );

  // Only display delete for current log in user
  const deleteHandler = (rid: number | string) => {
    const result = commentList.filter((comments) => comments.rpid !== rid);
    setCommentCount(commentCount - 1);
    setCommentList(result);
  };
  // Extract likes from state
  const defaultLikes = commentList.map((items) => items.like);
  const [likes, setLike] = useState(defaultLikes);

  // Handle likes
  const handleLikes = (rpid: string | number) => {
    const updateLikes = commentList.map((items) => {
      if (items.rpid === rpid) {
        return { ...items, like: items.like + 1 };
      } else {
        return items;
      }
    });
    const stateLike = updateLikes.map((comments) => comments.like);
    // Update state to comment
    setLike(stateLike);

    // Update the state
    setCommentList(updateLikes);
  };

  // Display and highlight tabs
  const [activeType, setActiveType] = useState("hot");
  const changeActiveType = (type: string) => {
    setActiveType(type);
    if (type === "hot") {
      setCommentList(_.orderBy(commentList, "like", "desc"));
    } else {
      setCommentList(_.orderBy(commentList, "ctime", "desc"));
    }
  };
  // Count Comment
  const [commentCount, setCommentCount] = useState(4);

  // Post comment
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const addNewComment = () => {
    const newComment = textAreaRef.current?.value;
    const comments = {
      rpid: uuidv4(),
      user,
      content: newComment!,
      ctime: dayjs(Date.now()).format("YYYY-MM-DD HH:mm"),
      like: 0,
    };
    setCommentCount(commentCount + 1);
    setCommentList([...commentList, comments]);
    setLike([...likes, 0]);
    textAreaRef.current!.value = "";

    textAreaRef.current!.focus();
  };
  return (
    <div className="app">
      {/* Nav Tab */}
      <div className="reply-navigation">
        <ul className="nav-bar">
          <li className="nav-title">
            <span className="nav-title-text">Comments</span>
            {/* Like */}
            <span className="total-reply">{commentCount}</span>
          </li>
          <li className="nav-sort">
            {/* highlight class name： active */}
            {tabs.map((tab) => (
              <span
                key={tab.type}
                // className={
                //   activeType == tab.type ? "nav-item active" : "nav-item"
                // }
                // Use ClassNames
                className={classNames("nav-item", {
                  active: tab.type === activeType,
                })}
                onClick={() => changeActiveType(tab.type)}
              >
                {tab.text}
              </span>
            ))}
          </li>
        </ul>
      </div>

      <div className="reply-wrap">
        {/* comments */}
        <div className="box-normal">
          {/* current logged in user profile */}
          <div className="reply-box-avatar">
            <div className="bili-avatar">
              <img className="bili-avatar-img" src={avatar} alt="Profile" />
            </div>
          </div>
          <div className="reply-box-wrap">
            {/* comment Using Uncontrol Component */}
            <textarea
              ref={textAreaRef}
              className="reply-box-textarea"
              placeholder="tell something..."
            />
            <div className="reply-box-send" onClick={addNewComment}>
              <div className="send-text">post</div>
            </div>
          </div>
        </div>
        {/* comment list */}
        <div className="reply-list">
          {/* comment item */}
          {commentList.map((items) => (
            <div className="reply-item" key={items.rpid}>
              {/* profile */}
              <div className="root-reply-avatar">
                <div className="bili-avatar">
                  <img
                    className="bili-avatar-img"
                    // src={require("./images/jack.png")}
                    src={items.user.avatar}
                    alt="Profile"
                  />
                </div>
              </div>

              <div className="content-wrap">
                {/* username */}
                <div className="user-info">
                  <div className="user-name">{items.user.uname}</div>
                </div>
                {/* comment content */}
                <div className="root-reply">
                  <span className="reply-content">{items.content}</span>
                  <div className="reply-info">
                    {/* comment created time */}
                    <span className="reply-time">{items.ctime}</span>
                    {/* total likes */}
                    <span
                      className="reply-time"
                      onClick={() => handleLikes(items.rpid)}
                    >{`Likes: ${items.like} `}</span>
                    {/* When to delete: When post userId is the same as currentUser id */}
                    {user.uid === items.user.uid && (
                      <span
                        className="delete-btn"
                        onClick={() => deleteHandler(items.rpid)}
                      >
                        Delete
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UnControllApp;
