import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getFirestore, collection, query, where, onSnapshot } from "firebase/firestore"; // Use onSnapshot for real-time updates
import "../css/UserPortfolio.css"; // Ensure correct styling for text
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faInstagram, faTwitter } from '@fortawesome/free-brands-svg-icons'; // Import necessary icons

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
        if (userData.portfolio) {
          const elementsWithFontSize = userData.portfolio.elements.map((element) => {
            const fontSize = element.fontSize; // Default to 12px if fontSize is missing
            console.log(`Element ID: ${element.id}, Font Size: ${fontSize}`); // Log font size for each element
            return {
              ...element,
              fontSize, // Set fontSize in the returned object
            };
          });

          setDroppedElements(elementsWithFontSize || []);
          setDropAreaColor(userData.portfolio.dropAreaColor || "#ffffff"); // Load background color
          
          console.log("Loaded portfolio elements:", userData.portfolio.elements);
          console.log("Loaded drop area color:", userData.portfolio.dropAreaColor);
        } else {
          console.error("No portfolio data found!");
        }
      } else {
        console.error("No such user portfolio exists!");
      }
    });

    // Cleanup subscription on component unmount
    return () => unsubscribe();
  }, [username, db]);
  
  // Function to handle formatting text with line breaks
  const formatText = (text) => {
    return text.split('\n').map((line, index) => (
      <React.Fragment key={index}>
        {line}
        <br />
      </React.Fragment>
    ));
  };

  return (
    <div className="user-portfolio-container">
      <div
        className="full-screen-drop-area"
        style={{ backgroundColor: dropAreaColor }}
        onContextMenu={(e) => e.preventDefault()} // Disable context menu (right-click) for extra protection
      >
        {droppedElements.map((element) => {
          // Element positioning and styling
          const posX = element.position?.x || 0;
          const posY = element.position?.y || 0;
          const width = element.size?.width || 100;
          const height = element.size?.height || 100;
          const backgroundColor = element.color || "#ffffff";
          const borderRadius = element.borderRadius || "0%";

          if (element.type === "uploaded-image") {
            return (
              <img
                key={element.id}
                src={element.url}
                alt=""
                style={{
                  position: "absolute",
                  top: posY,
                  left: posX,
                  width: width,
                  height: height,
                  borderRadius: borderRadius,
                  border: "none", // Ensure no borders on uploaded images
                  cursor: "default",
                }}
              />
            );
          }

          if (element.type === "icon") {
            return (
              <i
                key={element.id}
                className={element.iconClass || "fas fa-question-circle"} // Fallback icon if class is missing
                style={{
                  position: "absolute",
                  top: posY,
                  left: posX,
                  fontSize: element.size || "24px", // Adjust size if needed
                  color: element.iconColor || "#000",
                  cursor: "default",
                }}
              />
            );
          }

          if (element.type === "shape") {
            return (
              <div
                key={element.id}
                className={`dropped-element ${element.shape || ""}`}
                style={{
                  position: "absolute",
                  top: posY,
                  left: posX,
                  width: width,
                  height: height,
                  backgroundColor: backgroundColor,
                  borderRadius: borderRadius,
                  border: "none", // Ensure no borders on shapes unless defined elsewhere
                  cursor: "default",
                }}
              />
            );
          }

          if (element.type === "hyperlink") {
            return (
              <a
                key={element.id}
                href={element.url.startsWith('http') ? element.url : `http://${element.url}`} // Make sure URL has http or https
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  position: "absolute",
                  left: element.position.x,
                  top: element.position.y,
                  color: element.color,
                  textDecoration: 'none', // Prevent underline
                }}
              >
                {/* Display the logo */}
                {element.logo === "facebook" && (
                  <FontAwesomeIcon
                    icon={faFacebook}
                    size="2x"
                    style={{ color: element.color }}
                  />
                )}
                {element.logo === "instagram" && (
                  <FontAwesomeIcon
                    icon={faInstagram}
                    size="2x"
                    style={{ color: element.color }}
                  />
                )}
                {element.logo === "twitter" && (
                  <FontAwesomeIcon
                    icon={faTwitter}
                    size="2x"
                    style={{ color: element.color }}
                  />
                )}
              </a>
            );
          }

          // Default case: handle other types of elements (text)
          return (
            <div
              className={`dropped-element ${element.type} ${element.customClass || ""}`} // Apply shape-specific class
              key={element.id}
              style={{
                position: "absolute",
                top: posY,
                left: posX,
                width: width,
                height: height,
                backgroundColor: backgroundColor,
                borderRadius: borderRadius,
                border: "none", // Ensure no borders on default elements
                color: element.fontColor || "#000", // Text color
                fontFamily: element.textFont || "Arial", // Text font
                display: "flex", // Use flex to center the textarea
                justifyContent: "center",
                alignItems: "center",
                cursor: "default",
                padding: '20px', // Add padding for spacing between text and border
                boxSizing: 'border-box', // Include padding in width/height calculations
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: "100%", // Ensure the div takes the full size of the element
                  display: "flex",
                  justifyContent: "center", // Center text horizontally
                  alignItems: "center", // Center text vertically
                  padding: 0,
                }}
                onClick={(e) => e.stopPropagation()} // Prevent parent click event when editing
              >
                <textarea
                  value={element.text}
                  readOnly
                  style={{
                    width: "80%",
                    height: "80%",
                    border: "none",
                    outline: "none",
                    boxSizing: "border-box",
                    fontSize: `${element.fontSize}px`,
                    color: element.fontColor,
                    fontFamily: element.textFont,
                    backgroundColor: "transparent",
                    cursor: "text",
                    margin: 0,
                    padding: "10px",
                    textAlign: "center",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default UserPortfolio;
