import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getFirestore, collection, query, where, onSnapshot } from "firebase/firestore"; // Use onSnapshot for real-time updates
import "../css/UserPortfolio.css";

const UserPortfolio = () => {
  const { username } = useParams();
  const [droppedElements, setDroppedElements] = useState([]);
  const [dropAreaColor, setDropAreaColor] = useState("#ffffff");

  const db = getFirestore();

  useEffect(() => {
    const usersCollection = collection(db, "users");
    const q = query(usersCollection, where("username", "==", username));
    
    // Use onSnapshot to listen for real-time updates
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      if (!querySnapshot.empty) {
        const userData = querySnapshot.docs[0].data();
        setDroppedElements(userData.droppedElements || []);
        setDropAreaColor(userData.dropAreaColor || "#ffffff");
      } else {
        console.error("No such user portfolio exists!");
      }
    });

    // Cleanup subscription on component unmount
    return () => unsubscribe();
  }, [username, db]);

  return (
    <div className="user-portfolio-container">
      <div
        className="full-screen-drop-area"
        style={{ backgroundColor: dropAreaColor }}
        onContextMenu={(e) => e.preventDefault()} // Disable context menu (right-click) for extra protection
      >
        {droppedElements.map((element) => {
          if (element.type === "uploaded-image") {
            return (
              <img
                key={element.id}
                src={element.url} // Use the URL from the uploaded image
                alt=""
                style={{
                  position: "absolute",
                  top: element.position.y,
                  left: element.position.x,
                  width: element.size.width,
                  height: element.size.height,
                  borderRadius: element.borderRadius,
                  cursor: "default", // Disable pointer to indicate non-editable state
                }}
              />
            );
          }

          return (
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
          );
        })}
      </div>
    </div>
  );
};

export default UserPortfolio;
