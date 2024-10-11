import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";
import "../css/UserPortfolio.css";

const UserPortfolio = () => {
  const { username } = useParams();
  const [droppedElements, setDroppedElements] = useState([]);
  const [dropAreaColor, setDropAreaColor] = useState("#ffffff");

  const db = getFirestore();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersCollection = collection(db, "users");
        const q = query(usersCollection, where("username", "==", username));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const userData = querySnapshot.docs[0].data();
          setDroppedElements(userData.droppedElements || []);
          setDropAreaColor(userData.dropAreaColor || "#ffffff");
        } else {
          console.error("No such user portfolio exists!");
        }
      } catch (error) {
        console.error("Error fetching user portfolio:", error);
      }
    };

    fetchData();
  }, [username]);

  return (
    <div className="user-portfolio-container">
      <div
        className="full-screen-drop-area"
        style={{ backgroundColor: dropAreaColor }}
        onContextMenu={(e) => e.preventDefault()} // Disable context menu (right-click) for extra protection
      >
        {droppedElements.map((element) => (
          <div
            key={element.id}
            className="portfolio-element"
            style={{
              position: "absolute",
              top: element.position.y,
              left: element.position.x,
              width: element.size.width,
              height: element.size.height,
              backgroundColor: element.color,
              borderRadius: element.borderRadius,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: element.fontColor,
              fontFamily: element.textFont,
              cursor: "default", // Disable pointer to indicate non-editable state
            }}
          >
            {element.text}
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserPortfolio;
