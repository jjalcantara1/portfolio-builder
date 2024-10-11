import React, { useState, useEffect } from "react";
import { Nav } from "react-bootstrap";
import "../css/Portfolio.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPalette, faShapes } from "@fortawesome/free-solid-svg-icons";
import Navbar from "./Navbar";
import { auth } from "../firebase";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore"; // Import setDoc
import { onAuthStateChanged } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

import Draggable from "react-draggable";
import { Resizable } from "react-resizable";
import "react-resizable/css/styles.css"; // Import styles for resizable element



const ImageUpload = ({ onImageUpload }) => {  // Remove uploadedImageUrl from props
  const handleDrop = (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      onImageUpload(files[0]);  // Use the passed onImageUpload function
    }
  };

  const handleClick = () => {
    document.getElementById("image-input").click();
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      onImageUpload(e.target.files[0]);  // Use the passed onImageUpload function
    }
  };

  return (
    <div
      className="image-upload"
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      onClick={handleClick}
      style={{
        border: "2px dashed #cccccc",
        padding: "20px",
        textAlign: "center",
        cursor: "pointer",
      }}
    >
      <input
        type="file"
        id="image-input"
        onChange={handleFileChange}
        style={{ display: "none" }}
      />
      <p>Drag & drop an image here, or click to upload</p>
    </div>
  );
};

const Portfolio = () => {
  const [profile, setProfile] = useState({
    name: "",
    age: "",
    bio: "",
    image: null,
    profilePictureUrl: "",
  });

  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [activeSection, setActiveSection] = useState("");
  const [hoverSection, setHoverSection] = useState("");
  const [draggedElement, setDraggedElement] = useState(null);
  const [droppedElements, setDroppedElements] = useState([]);
  const [isResizing, setIsResizing] = useState(false);
  const [draggingElement, setDraggingElement] = useState(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dropAreaColor, setDropAreaColor] = useState("#ffffff");
  const [selectedElementId, setSelectedElementId] = useState(null);
  const [isTextFocused, setIsTextFocused] = useState(false);
  const [activeCategory, setActiveCategory] = useState("textboxes");

  const db = getFirestore();


  const handleImageUpload = async (file) => {
    if (file) {
      const storage = getStorage();
      const storageRef = ref(storage, `images/${file.name}`);
      
      // Upload the file to Firebase Storage
      await uploadBytes(storageRef, file);
      
      // Get the download URL
      const url = await getDownloadURL(storageRef);
      
      setUploadedImageUrl(url); // Save the permanent URL
    }
  };


  const handleCategoryClick = (category) => {
    setActiveCategory(category);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProfile((prevProfile) => ({
            ...prevProfile,
            ...docSnap.data(),
            links: docSnap.data().links || [""],
          }));
          // Load existing dropped elements and background color from Firestore
          if (docSnap.data().droppedElements) {
            setDroppedElements(docSnap.data().droppedElements);
          }
          if (docSnap.data().dropAreaColor) {
            setDropAreaColor(docSnap.data().dropAreaColor); // Load background color
          }
        } else {
          console.log("No such document!");
        }
      }
    });

    return () => unsubscribe();
  }, [db]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Backspace" && selectedElementId && !isTextFocused) {
        // If an element is selected and no text is focused, delete the selected element
        setDroppedElements((prevElements) =>
          prevElements.filter((element) => element.id !== selectedElementId)
        );
        setSelectedElementId(null);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedElementId, isTextFocused]);

  const handleSectionClick = (section) => {
    setActiveSection(section);
  };

  const handleDragStart = (e, element) => {
    setDraggedElement(element);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const dropArea = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - dropArea.left;
    const y = e.clientY - dropArea.top;

    if (draggedElement) {
      let newElement;

      // Assign specific size and style based on shape type
      if (draggedElement === "square-textbox") {
        newElement = {
          type: draggedElement,
          id: Date.now(),
          position: { x, y },
          size: { width: 100, height: 100 }, // Square
          text: "",
          color: "#1dd1a1",
          fontColor: "#000000",
          textFont: "Arial",
          borderRadius: "0%", // No rounding for square
        };
      } else if (draggedElement === "circle-textbox") {
        newElement = {
          type: draggedElement,
          id: Date.now(),
          position: { x, y },
          size: { width: 100, height: 100 }, // Circle-like dimensions
          text: "",
          color: "#1dd1a1",
          fontColor: "#000000",
          textFont: "Arial",
          borderRadius: "50%", // Fully rounded for circle
        };
      } else if (draggedElement === "rounded-textbox") {
        newElement = {
          type: draggedElement,
          id: Date.now(),
          position: { x, y },
          size: { width: 150, height: 100 }, // Rectangle-like dimensions
          text: "",
          color: "#1dd1a1",
          fontColor: "#000000",
          textFont: "Arial",
          borderRadius: "15%", // Slight rounding for rounded rectangle
        };
      }
      setDroppedElements((prevElements) => [...prevElements, newElement]);
      setDraggedElement(null);
    }

    // Handle the uploaded image
    if (uploadedImageUrl) {
      const newImageElement = {
        type: "uploaded-image",
        id: Date.now(),
        position: { x, y },
        size: { width: 100, height: 100 }, // Adjust size as needed
        url: uploadedImageUrl,
      };
      setDroppedElements((prevElements) => [...prevElements, newImageElement]);
      setUploadedImageUrl(""); // Clear after adding
    }
  };

  const handleTextChange = (id, newText) => {
    setDroppedElements((prevElements) =>
      prevElements.map((element) =>
        element.id === id ? { ...element, text: newText } : element
      )
    );
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };
  const startResizing = (e, element) => {
    e.preventDefault(); // Prevent default behavior
    e.stopPropagation(); // Prevent triggering drag events
    setIsResizing(true); // Set resizing mode

    const initialWidth = element.size.width;
    const initialHeight = element.size.height;
    const initialX = e.clientX;
    const initialY = e.clientY;

    // Add the mousemove event listener to the document to track the resizing
    const mouseMoveHandler = (event) => {
      const newWidth = Math.max(50, initialWidth + (event.clientX - initialX));
      const newHeight = Math.max(
        50,
        initialHeight + (event.clientY - initialY)
      );
      handleResize(element.id, newWidth, newHeight); // Continuously resize
    };

    // Once mouse is released, stop resizing and remove listeners
    const mouseUpHandler = () => {
      setIsResizing(false); // End resizing
      document.removeEventListener("mousemove", mouseMoveHandler); // Remove mousemove listener
      document.removeEventListener("mouseup", mouseUpHandler); // Remove mouseup listener
    };

    // Attach the event listeners to track mouse movement
    document.addEventListener("mousemove", mouseMoveHandler);
    document.addEventListener("mouseup", mouseUpHandler);
  };

  // Handles resizing the element's dimensions
  const handleResize = (id, width, height) => {
    setDroppedElements((prevElements) =>
      prevElements.map((element) =>
        element.id === id ? { ...element, size: { width, height } } : element
      )
    );
  };

  // Prevent drag if resizing is happening
  const handleElementDragStart = (e, element) => {
    if (isResizing) return; // Prevent dragging if resizing is happening

    e.preventDefault(); // Prevent default drag behavior

    setDraggingElement(element.id);

    const dropArea = e.currentTarget.parentElement.getBoundingClientRect();
    const offsetX = e.clientX - dropArea.left - element.position.x;
    const offsetY = e.clientY - dropArea.top - element.position.y;

    const moveElement = (event) => {
      const newX = event.clientX - dropArea.left - offsetX;
      const newY = event.clientY - dropArea.top - offsetY;

      requestAnimationFrame(() => {
        setDroppedElements((prevElements) =>
          prevElements.map((el) =>
            el.id === element.id
              ? { ...el, position: { x: newX, y: newY } }
              : el
          )
        );
      });
    };

    const stopDragging = () => {
      setDraggingElement(null);
      document.removeEventListener("mousemove", moveElement);
      document.removeEventListener("mouseup", stopDragging);
    };

    document.addEventListener("mousemove", moveElement);
    document.addEventListener("mouseup", stopDragging);
  };

  // Handles resizing the element's dimensions

  const clearSelectedElement = () => {
    setSelectedElementId(null);
  };

  const handleTextBoxClick = (id) => {
    setSelectedElementId(id);
  };

  const handleShapeColorChange = (id, color) => {
    setDroppedElements((prevElements) =>
      prevElements.map((element) =>
        element.id === id ? { ...element, color } : element
      )
    );
  };

  const savePortfolio = () => {
    // Convert droppedElements to JSON and store in local storage
    localStorage.setItem("savedPortfolio", JSON.stringify(droppedElements));
  };

  useEffect(() => {
    const savedPortfolio = localStorage.getItem("savedPortfolio");
    if (savedPortfolio) {
      setDroppedElements(JSON.parse(savedPortfolio));
    }
  }, []);

  

  

  // New save function
  const handleSave = async () => {
    const user = auth.currentUser;
    if (user) {
      const docRef = doc(db, "users", user.uid);
      await setDoc(
        docRef,
        {
          ...profile,
          dropAreaColor, // Add dropAreaColor to the saved data
          droppedElements,
          uploadedImageUrl,
        },
        { merge: true }
      ); // Merge to keep existing data and add new
      alert("Portfolio saved successfully!");
    } else {
      alert("You need to be logged in to save your portfolio.");
    }
  };

  return (
    <div className="portfolio-container">
      <Navbar />
      <div className="sidebar-oblong">
        <Nav className="flex-column sidebar-nav">
          <Nav.Link
            href="#theme"
            className={`sidebar-link ${
              activeSection === "theme" ? "active" : ""
            } ${hoverSection === "theme" ? "hover" : ""}`}
            onClick={() => handleSectionClick("theme")}
            onMouseEnter={() => setHoverSection("theme")}
            onMouseLeave={() => setHoverSection("")}
          >
            <FontAwesomeIcon icon={faPalette} className="nav-icon" />
            <span className="nav-text">Theme</span>
          </Nav.Link>
          <Nav.Link
            href="#elements"
            className={`sidebar-link ${
              activeSection === "elements" ? "active" : ""
            } ${hoverSection === "elements" ? "hover" : ""}`}
            onClick={() => handleSectionClick("elements")}
            onMouseEnter={() => setHoverSection("elements")}
            onMouseLeave={() => setHoverSection("")}
          >
            <FontAwesomeIcon icon={faShapes} className="nav-icon" />
            <span className="nav-text">Elements</span>
          </Nav.Link>
        </Nav>
        <div className="sidebar-footer">
          <div className="footer-icon">
            {profile.profilePictureUrl ? (
              <img
                src={profile.profilePictureUrl}
                alt="Profile"
                className="footer-profile-image"
              />
            ) : (
              <div className="footer-image-placeholder">No Image</div>
            )}
          </div>
        </div>
      </div>

      <div className="main-content">
        <div className="left-content">
          {activeSection === "theme" && (
            <div className="theme-content-container">
              <h3>{selectedElementId ? "Theme" : "Theme"}</h3>
              {selectedElementId ? (
                <div>
                  <label>
                    Font Color:
                    <input
                      type="color"
                      value={
                        droppedElements.find(
                          (element) => element.id === selectedElementId
                        ).fontColor
                      }
                      onChange={(e) =>
                        setDroppedElements((prevElements) =>
                          prevElements.map((element) =>
                            element.id === selectedElementId
                              ? { ...element, fontColor: e.target.value }
                              : element
                          )
                        )
                      }
                      style={{
                        border: "0px solid black", // Thicker border to highlight the color
                        padding: "-1px", // Reduce padding to make the white part thinner
                        margin: "10px", // Remove any default margins
                        width: "50px", // Adjust width
                        height: "25px", // Adjust height
                        borderRadius: "5px", // Optional: rounded edges
                        verticalAlign: "middle", // Align the input with the text
                      }}
                    />
                  </label>
                  <label>
                    Text Font:
                    <select
                      value={
                        droppedElements.find(
                          (element) => element.id === selectedElementId
                        ).textFont
                      }
                      onChange={(e) =>
                        setDroppedElements((prevElements) =>
                          prevElements.map((element) =>
                            element.id === selectedElementId
                              ? { ...element, textFont: e.target.value }
                              : element
                          )
                        )
                      }
                    >
                      <option value="Arial">Arial</option>
                      <option value="Times New Roman">Times New Roman</option>
                      <option value="Courier New">Courier New</option>
                      <option value="Georgia">Georgia</option>
                      <option value="Verdana">Verdana</option>
                    </select>
                  </label>
                  <label>
                    Shape Color:
                    <input
                      type="color"
                      value={
                        droppedElements.find(
                          (element) => element.id === selectedElementId
                        ).color
                      }
                      onChange={(e) =>
                        handleShapeColorChange(
                          selectedElementId,
                          e.target.value
                        )
                      }
                      style={{
                        border: "0px solid black", // Thicker border to highlight the color
                        padding: "0px", // Reduce padding to make the white part thinner
                        margin: "10px", // Remove any default margins
                        width: "50px", // Adjust width
                        height: "25px", // Adjust height
                        borderRadius: "5px", // Optional: rounded edges
                        verticalAlign: "middle", // Align the input with the text
                      }}
                    />
                  </label>
                </div>
              ) : (
                <div>
                  <label>
                    Background Color:
                    <input
                      type="color"
                      value={dropAreaColor}
                      onChange={(e) => setDropAreaColor(e.target.value)}
                      style={{
                        border: "0px solid black", // Thicker border to highlight the color
                        padding: "0px", // Reduce padding to make the white part thinner
                        margin: "10px", // Remove any default margins
                        width: "50px", // Adjust width
                        height: "25px", // Adjust height
                        borderRadius: "5px", // Optional: rounded edges
                        verticalAlign: "middle", // Align the input with the text
                      }}
                    />
                  </label>
                </div>
              )}
            </div>
          )}

          {activeSection === "elements" && (
            <div className="elements-section">
              <h3>Elements</h3>
              <button onClick={() => handleCategoryClick("textboxes")}>
                Text Boxes
              </button>
              <button onClick={() => handleCategoryClick("images")}>
                Images
              </button>
              {activeCategory === "textboxes" && (
                <div className="element-row">
                  <div
                    className="element-block square-textbox"
                    draggable
                    onDragStart={(e) => handleDragStart(e, "square-textbox")}
                  ></div>
                  <div
                    className="element-block circle-textbox"
                    draggable
                    onDragStart={(e) => handleDragStart(e, "circle-textbox")}
                  ></div>
                  <div
                    className="element-block rounded-textbox"
                    draggable
                    onDragStart={(e) => handleDragStart(e, "rounded-textbox")}
                  ></div>
                </div>
              )}
              {activeCategory === "images" && (
                <>
              <ImageUpload onImageUpload={handleImageUpload} /> 
                  {uploadedImageUrl && (
                    <div className="uploaded-image">
                      <img
                        src={uploadedImageUrl}
                        alt="Uploaded"
                        style={{ maxWidth: "100%" }}
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          )}
          <button onClick={handleSave} className="save-button">
            Save Portfolio
          </button>
        </div>

        {/* Right-side Drop Area */}
        <div
          className="drop-area"
          style={{ backgroundColor: dropAreaColor }}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={clearSelectedElement} // Add this line to clear selection
        >
          {droppedElements.map((element) => {
            if (element.type === "uploaded-image") {
              return (
                <div
                  key={element.id}
                  style={{
                    position: "absolute",
                    left: element.position.x,
                    top: element.position.y,
                    width: element.size.width,
                    height: element.size.height,
                    cursor: draggingElement ? "grabbing" : "move", // Set cursor when dragging
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleTextBoxClick(element.id);
                  }}
                  onDragStart={(e) => handleElementDragStart(e, element)}
                  draggable={
                    !selectedElementId || selectedElementId !== element.id
                  } // Disable dragging while resizing
                >
                  <img
                    src={element.url}
                    alt="Dropped"
                    style={{
                      width: "100%",
                      height: "100%",
                    }}
                  />
                  <div
                    className="resize-handle"
                    onMouseDown={(e) => startResizing(e, element)} // Function to handle resizing
                    style={{
                      position: "absolute",
                      bottom: 0,
                      right: 0,
                      width: "10px",
                      height: "10px",
                      backgroundColor: "gray",
                      cursor: "nwse-resize",
                    }}
                  />
                </div>
              );
            } else {
              return (
                <div
                  key={element.id}
                  className={`dropped-element ${element.type}`}
                  style={{
                    left: element.position.x,
                    top: element.position.y,
                    position: "absolute",
                    margin: 0,
                    width: element.size.width,
                    height: element.size.height,
                    border: `1em solid ${element.color}`,
                    backgroundColor: element.color,
                    boxSizing: "border-box",
                    cursor: draggingElement ? "grabbing" : "move", // Set cursor when dragging
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleTextBoxClick(element.id);
                  }}
                  onDragStart={(e) => handleElementDragStart(e, element)}
                  draggable={
                    !selectedElementId || selectedElementId !== element.id
                  } // Disable dragging while editing text
                >
                  <div
                    style={{
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                    }}
                    onClick={(e) => e.stopPropagation()} // Prevent parent click event when editing
                  >
                    <textarea
                      value={element.text}
                      onChange={(e) =>
                        handleTextChange(element.id, e.target.value)
                      }
                      onFocus={() => setIsTextFocused(true)}
                      onBlur={() => setIsTextFocused(false)}
                      style={{
                        width: "100%", // Match the width of the shape
                        height: "100%", // Match the height of the shape
                        border: "none",
                        outline: "none",
                        resize: "none", // Disable manual resizing
                        boxSizing: "border-box",
                        fontSize: "16px",
                        color: element.fontColor, // Use individual font color
                        fontFamily: element.textFont, // Use individual font family
                        backgroundColor: "transparent", // Transparent background to match shape
                        overflow: "hidden", // Hide overflow so text wraps inside
                        cursor: "text", // Text cursor when editing
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTextBoxClick(element.id);
                      }}
                      onMouseDown={(e) => e.stopPropagation()} // Prevent dragging when focusing text
                    />
                  </div>
                  <div
                    className="resize-handle"
                    onMouseDown={(e) => startResizing(e, element)}
                  />
                </div>
              );
            }
          })}
        </div>
      </div>
    </div>
  );
};

export default Portfolio;
