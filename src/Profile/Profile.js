import React, { useEffect, useState } from "react";
import styles from "./ProfileStyles.module.scss";
import axios from "axios";
import ImageOne from "./Images/ImageOne.svg";
import { BsLink45Deg, BsFillFolderSymlinkFill } from "react-icons/bs";
import { FaStar } from "react-icons/fa";
import { MdSchool } from "react-icons/md";
import { GiGreekTemple } from "react-icons/gi";
import { Link, Redirect } from "react-router-dom";
import { BACKEND_DEV } from '../constants';
import { auth } from '../base'

const Profile = (props) => {

  const [user, setUser] = useState({
    fullname: "Loading name...",
    username: "username",
    links: ["Loading..."],
    mastered: ["Loading..."],
    learning: ["Loading..."],
    want: ["Loading..."],
    bio: "Loading my cool description...",
  });

  const { loginStatus } = props;

  const [isOwner, setIsOwner] = useState(false);
  const [redirect, setRedirect] = useState(loginStatus);

  const { id } = props.match.params;

  useEffect(() => {
    console.log("Profile.js useEffect")
    if (!loginStatus) return;
    if (id === "null") {
      console.log("Username id not found");
      return;
    }

    if (id === "me") {
      // Get currentUser Data, isOwner=true
      console.log("Fetching my profile...");
      (async () => {
        const user_email = auth.currentUser.email;

        try {
          const idToken = await auth.currentUser?.getIdToken(true);
          console.log("idToken fetched");
          const authTokenHeader = {
            "authorization": `Bearer ${idToken}`,
          };

          console.log("idToken created")

          axios.post(BACKEND_DEV + "/users/by-email/", { email: user_email }, { headers: authTokenHeader })
            .then(response => {
              const { user } = response.data;
              setUser(user);
              setIsOwner(true);

            })
            .catch(error => {
              console.error(error);
            })
        } catch (error) {
          console.log("Something happened", error);
          console.error(error)
          return;
        }


      })();

      return;
    }
    console.log("Normal user id query");
    // Get Profile Data and determine isOwner
    (async () => {
      const idToken = await auth.currentUser?.getIdToken(true);

      const authTokenHeader = {
        "authorization": `Bearer ${idToken}`,
      };

      axios
        .get(BACKEND_DEV + "/users/" + id, {
          headers: authTokenHeader,
        })
        .then((response) => {

          const { user } = response.data;
          setUser(user);
          setIsOwner(user.username === id);

        })
        .catch((err) => {
          console.log("Error in getting Profile:", err);
        });

    })();


  }, []);

  return redirect ? (
    <Redirect to="/login" />
  ) : (
    <div className={styles.Wrapper}>
      <div className={styles.NameContainer}>
        <p className={styles.Name}>{user.fullname}</p>
        <p className={styles.Username}>@{user.username}</p>
      </div>
      <div className={styles.ImageOneContainer}>
        <img className={styles.ImageOne} src={ImageOne}></img>
      </div>
      <div className={styles.AboutMeContainer}>
        <p className={styles.AboutMeTitle}>About me</p>
        <p className={styles.InfoText}>{user.bio}</p>
      </div>
      <div className={styles.EducationContainer}>
        <p className={styles.CollegeTitle}>
          <GiGreekTemple /> University
        </p>
        <p className={styles.InfoText}>{user.college}</p>
        <p className={styles.CollegeContent}>Semester: {user.semester}</p>
        <p className={styles.MajorTitle}>
          <MdSchool /> Major
        </p>
        <p className={styles.InfoText}>{user.major}</p>
        {isOwner ? (
          <Link to="/editprofile" className={styles.Button}>
            Edit Profile
          </Link>
        ) : (
          <></>
        )}
      </div>

      <div className={styles.LinksContainer}>
        <p className={styles.LinksTitle}>
          {" "}
          <BsFillFolderSymlinkFill /> My Links
        </p>
        {user.links.length ? (
          user.links.map((link, i) => (
            // Doble // para que el href sea absoluto
            <a key={i} href={`//${link}`} target="_blank" className={styles.Link}>
              <BsLink45Deg /> {link}
            </a>
          ))
        ) : (
          <p className={styles.InfoText}>No links yet!</p>
        )}
      </div>

      <div className={styles.StackContainer}>
        <p className={styles.StackTitle}>
          {" "}
          <FaStar /> My Stack
        </p>
      </div>
      <div className={styles.MasterdContainer}>
        <p className={styles.MasterdTitle}>Mastered:</p>
        <div className={styles.MasterdTagsContanier}>
          {user.mastered.map((tag, i) => (
            <div key={i} className={`${styles.Tag} ${styles.Mastered}`}> {tag}</div>
          ))}
        </div>
      </div>
      <div className={styles.LearningContainer}>
        <p className={styles.LearningTitle}>Learning:</p>
        <div className={styles.LearningTagsContanier}>
          {user.learning.map((tag, i) => (
            <div key={i} className={`${styles.Tag} ${styles.Learning}`}> {tag}</div>
          ))}
        </div>
      </div>
      <div className={styles.WantContainer}>
        <p className={styles.WantTitle}>Want to learn:</p>
        <div className={styles.MasterdTagsContanier}>
          {user.want.map((tag, i) => (
            <div key={i} className={`${styles.Tag} ${styles.Want}`}> {tag}</div>
          ))}
        </div>
      </div>
      <div className={styles.ProjectsContainer}>
        <p className={styles.TeamContent}>
          Collaborating in X Team Projects:
        </p>
        <Link to={`/myapplication/${props.match.params.id}`} className={styles.PortfolioLink}>here</Link>

      </div>
      {/* LINKS TO UNSUPPORTED SECTIONS
      <div className={styles.ProjectsContainer}>
        <p className={styles.PortfolioContent}>My Portfolio</p>
        <Link to={`/myapplication/${props.match.params.id}`} className={styles.PortfolioLink}>here</Link>
        <p className={styles.TeamContent}>
          Collaborating in X Team Projects:
        </p>
        <a className={styles.TeamLink}>here</a>
      </div>
      <div className={styles.ImageTwoContainer}>
        <img className={styles.ImageTwo} src={ImageTwo} />
          </div>*/}
    </div>
  );
}

export default Profile;
