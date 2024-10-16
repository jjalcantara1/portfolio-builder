import React, { useState, useEffect } from "react";
import { Nav } from "react-bootstrap";
import "../css/Portfolio.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPalette, faShapes } from "@fortawesome/free-solid-svg-icons";
import Navbar from "../components/Navbar";
import { auth } from "../firebase";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore"; // Import setDoc
import { onAuthStateChanged } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

import Draggable from "react-draggable";
import { Resizable } from "react-resizable";
import "react-resizable/css/styles.css"; // Import styles for resizable element
import { useParams } from 'react-router-dom';
import templates from '../components/templates';
import Sidebar from "../components/Sidebar";

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

const EditPortfolio = () => {
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

  const [isMainContentVisible, setMainContentVisible] = useState(true);

  const toggleMainContent = () => {
    setMainContentVisible(!isMainContentVisible);
  };

  
  const [dropAreaContent, setDropAreaContent] = useState([]);

 
  const [dropAreaHeight, setDropAreaHeight] = useState(400); // Default height

  const [zoomLevel, setZoomLevel] = useState(1);
  const [height, setHeight] = useState(600); // Initial height

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 0.1, 2)); // Max zoom level
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 0.1, 0.8)); // Min zoom level
  const handleHeightChange = (e) => setHeight(e.target.value);
  const increaseHeight = () => setHeight(prev => Math.min(prev + 50, 6000)); // Max height
  const decreaseHeight = () => setHeight(prev => Math.max(prev - 50, 100)); // Min height

  const { templateId } = useParams(); // Get the templateId from the URL
  const [elements, setElements] = useState([]); // State to hold elements from templates
  const [templateStyles, setTemplateStyles] = useState({}); // State to hold template styles


  const [hyperlinks, setHyperlinks] = useState([]);
  const [hyperlinkText, setHyperlinkText] = useState("");
  const [hyperlinkUrl, setHyperlinkUrl] = useState("");
  const [hyperlinkColor, setHyperlinkColor] = useState("#000000"); // Default color for hyperlinks
  const [selectedLogo, setSelectedLogo] = useState("");
  const [editingHyperlinkId, setEditingHyperlinkId] = useState(null); // Track the hyperlink being edited
  const [editingHyperlinkUrl, setEditingHyperlinkUrl] = useState("");
  const [editingHyperlinkColor, setEditingHyperlinkColor] = useState("");

  const addHyperlink = () => {
    if (hyperlinkUrl && selectedLogo) {
      const newHyperlink = {
        id: Date.now(),
        type: "hyperlink",
        url: hyperlinkUrl,
        logo: selectedLogo, // Save the selected logo instead of text
        color: hyperlinkColor, // Save the selected color
        position: { x: 50, y: 50 },
      };
      setDroppedElements((prev) => [...prev, newHyperlink]);
      setSelectedLogo(""); // Clear selected logo after adding
      setHyperlinkUrl(""); // Clear URL input after adding
    }
  };

  const selectHyperlinkForEdit = (id) => {
    const hyperlink = droppedElements.find((element) => element.id === id);
    if (hyperlink) {
      setEditingHyperlinkId(id); // Set the hyperlink for editing
      setSelectedLogo(hyperlink.logo); // Set the current logo
      setEditingHyperlinkUrl(hyperlink.url); // Set the current URL
      setEditingHyperlinkColor(hyperlink.color); // Set the current color
    }
  };


  const saveHyperlinkEdit = () => {
    setDroppedElements((prevElements) =>
      prevElements.map((element) =>
        element.id === editingHyperlinkId
          ? {
              ...element,
              logo: selectedLogo,
              url: editingHyperlinkUrl,
              color: editingHyperlinkColor,
            }
          : element
      )
    );
    // Clear the editing state after saving
    setEditingHyperlinkId(null);
    setSelectedLogo("");
    setEditingHyperlinkUrl("");
    setEditingHyperlinkColor("#000000");
  };


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
    if (templateId) {
      const selectedTemplate = templates.find((t) => t.id === templateId);
      if (selectedTemplate) {
        const adjustedElements = selectedTemplate.elements.map((element) => ({
          ...element,
          position: {
            x: element.position.x / zoomLevel,
            y: element.position.y / zoomLevel,
          },
        }));
  
        setTemplateStyles(selectedTemplate.styles);
  
        // Clear the existing droppedElements and set to template elements
        setDroppedElements(adjustedElements);
  
        console.log("Template elements loaded into droppedElements:", adjustedElements);
      }
    }
  }, [templateId, zoomLevel]);
  
 
  // useEffect(() => {
  //   const unsubscribe = onAuthStateChanged(auth, async (user) => {
  //     if (user) {
  //       const docRef = doc(db, "users", user.uid);
  //       const docSnap = await getDoc(docRef);
  //       if (docSnap.exists()) {
  //         setProfile((prevProfile) => ({
  //           ...prevProfile,
  //           ...docSnap.data(),
  //           links: docSnap.data().links || [""],
  //         }));
  //         // Load existing dropped elements and background color from Firestore
  //         if (docSnap.data().droppedElements) {
  //           setDroppedElements(docSnap.data().droppedElements);
  //         }
  //         if (docSnap.data().dropAreaColor) {
  //           setDropAreaColor(docSnap.data().dropAreaColor); // Load background color
  //         }
  //       } else {
  //         console.log("No such document!");
  //       }
  //     }
  //   });

  //   return () => unsubscribe();
  // }, [db]);

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
  const handleTempTextChange = (id, newText) => {
    setDroppedElements((prevElements) =>
      prevElements.map((element) =>
        element.id === id ? { ...element, content: newText } : element
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

  useEffect(() => {
    const fetchSavedPortfolio = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const userDocRef = doc(db, "users", user.uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            const data = userDoc.data().portfolio;
            setDroppedElements(data.elements || []); // Load saved elements into the state
            setDropAreaColor(data.dropAreaColor || "#ffffff"); // Set the saved drop area color
            setTemplateStyles(data.template.styles || {}); // Set the saved template styles
          } else {
            console.error("No portfolio data found for this user.");
          }
        } catch (error) {
          console.error("Error fetching saved portfolio data:", error);
        }
      }
    };
  
    fetchSavedPortfolio();
  }, []);
  const handleImageClick = (id) => {
    // Trigger file input to upload a new image
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        handleImageUpload(id, file); // Function to upload and replace the image
      }
    };
    input.click();
  };
  
  const handleSave = async () => {
    const user = auth.currentUser;
    if (user) {
      try {
        const userDocRef = doc(db, "users", user.uid);
  
        // Retrieve existing data from the user's document to preserve other information
        const userDoc = await getDoc(userDocRef);
        const existingData = userDoc.exists() ? userDoc.data() : {};
  
        // Ensure the elements are saved in a consistent structure
        await setDoc(
          userDocRef,
          {
            ...existingData,
            portfolio: {
              elements: droppedElements.map((element) => ({
                id: element.id || Date.now(),
                type: element.type || "text",
                position: {
                  x: element.position?.x || 0,
                  y: element.position?.y || 0,
                },
                size: {
                  width: element.size?.width || 100,
                  height: element.size?.height || 100,
                },
                text: element.text || element.content || "", // Use either text or content field
                content: element.content || element.text || "", // Ensure compatibility
                color: element.color || "#ffffff",
                fontColor: element.fontColor || "#000000",
                textFont: element.textFont || "Arial",
                borderRadius: element.borderRadius || "0%",
                url: element.url || "",
                iconClass: element.iconClass || "",
                logo: element.logo || "",
              })),
              dropAreaColor: dropAreaColor || "#ffffff",
              uploadedImageUrl: uploadedImageUrl || "",
              template: {
                templateId: templateId || "default",
                styles: templateStyles || {},
              },
            },
          },
          { merge: true }
        );
        alert("Portfolio saved successfully!");
        console.log("Saved portfolio to Firebase:", droppedElements, "Drop Area Color:", dropAreaColor);
      } catch (error) {
        console.error("Error saving portfolio:", error);
        alert("Failed to save portfolio. Please try again.");
      }
    } else {
      alert("You need to be logged in to save your portfolio.");
    }
  };
  

  return (
    <div className="portfolio-container">
    <Navbar />
    <Sidebar
      activeSection={activeSection}
      hoverSection={hoverSection}
      handleSectionClick={handleSectionClick}
      setHoverSection={setHoverSection}
      toggleMainContent={toggleMainContent}
      isMainContentVisible={isMainContentVisible}
      handleSave={handleSave}
      profile={profile}
    />
    <div className="main-content">
    <div
      className="left-content"
      style={{ display: isMainContentVisible ? "block" : "none" }}
    >
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
            <div
              className="element-block heart"
              draggable
              onDragStart={(e) => handleDragStart(e, "heart")}
            ></div>{" "}
            {/* Heart shape without a block */}
          </div>

          <div className="element-row">
            <div
              className="element-block hexagon"
              draggable
              onDragStart={(e) => handleDragStart(e, "hexagon")}
            ></div>
            <div
              className="element-block triangle"
              draggable
              onDragStart={(e) => handleDragStart(e, "triangle")}
            ></div>
            <div
              className="element-block pentagon"
              draggable
              onDragStart={(e) => handleDragStart(e, "pentagon")}
            ></div>
            <div
              className="element-block star"
              draggable
              onDragStart={(e) => handleDragStart(e, "star")}
            ></div>
          </div>
          {!editingHyperlinkId ? (
            // Show Add Hyperlink form when no hyperlink is selected
            <div>
              <h3>Add Hyperlink</h3>
              <h4>Select Logo:</h4>
              <select
                value={selectedLogo}
                onChange={(e) => setSelectedLogo(e.target.value)}
              >
                <option value="">Select Logo</option>
                <option value="facebook">Facebook</option>
                <option value="instagram">Instagram</option>
                <option value="twitter">Twitter</option>
              </select>
              <h4>URL:</h4>
              <input
                type="url"
                placeholder="URL"
                value={hyperlinkUrl}
                onChange={(e) => setHyperlinkUrl(e.target.value)}
              />
              <h4>Color:</h4>
              <input
                type="color"
                value={hyperlinkColor}
                onChange={(e) => setHyperlinkColor(e.target.value)} // New state for color
              />
              <div>
                <button onClick={addHyperlink}>Add Hyperlink</button>
              </div>
            </div>
          ) : (
            // Show Edit Hyperlink form when a hyperlink is selected
            <div className="edit-form">
              <h3>Edit Hyperlink</h3>
              <h4>Select Logo</h4>
              <select
                value={selectedLogo}
                onChange={(e) => setSelectedLogo(e.target.value)}
              >
                <option value="facebook">Facebook</option>
                <option value="instagram">Instagram</option>
                <option value="twitter">Twitter</option>
              </select>
              <label>
                <h4>URL:</h4>
                <input
                  placeholder="URL"
                  type="url"
                  value={editingHyperlinkUrl}
                  onChange={(e) => setEditingHyperlinkUrl(e.target.value)}
                />
              </label>
              <label>
                <h4>Color:</h4>
                <input
                  type="color"
                  value={editingHyperlinkColor}
                  onChange={(e) => setEditingHyperlinkColor(e.target.value)}
                />
              </label>
              <div>
                <button onClick={saveHyperlinkEdit}>Save Changes</button>
              </div>
            </div>
          )}
          <>
            <h3>Image Upload</h3>
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
        </div>
      )}
    </div>
        <div className="canvas">
        <div className="control-panel">
              {/* Height Control */}
              <div className="height-control">
                <span className="control-label">Height:</span>
                <button className="control-btn" onClick={increaseHeight} title="Increase Height">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                    <path d="M12 5v14m7-7H5" stroke="currentColor" strokeWidth="2" fill="none" />
                  </svg>
                </button>
                <button className="control-btn" onClick={decreaseHeight} title="Decrease Height">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                    <path d="M5 12h14" stroke="currentColor" strokeWidth="2" fill="none" />
                  </svg>
                </button>
              </div>

              {/* Zoom Control */}
              <div className="zoom-control">
                <span className="control-label">Zoom:</span>
                <button className="control-btn" onClick={handleZoomIn} title="Zoom In">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                    <path d="M11 11V5h2v6h6v2h-6v6h-2v-6H5v-2h6z" fill="currentColor" />
                  </svg>
                </button>
                <button className="control-btn" onClick={handleZoomOut} title="Zoom Out">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                    <path d="M5 11h14v2H5v-2z" fill="currentColor" />
                  </svg>
                </button>
              </div>
            </div>
        {/* Right-side Drop Area */}
        <div className={`drop-area ${!isMainContentVisible ? 'full-screen' : ''}`}
            onDrop={handleDrop} 
            onDragOver={handleDragOver} 
            style={{ backgroundColor: dropAreaColor, transformOrigin: 'top-left', height: `${height}px`,  overflowY: 'scroll', position: 'relative' }}
          >
          <div className="zoomable-area" style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'top left', height: `${height}px`, position: 'relative' }}>
          <div className="zoomable-area" style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'top left', height: `${height}px`, position: 'relative' }}>
          {droppedElements.map((element) => {
            const posX = element.position?.x || 0; // Use optional chaining for position
            const posY = element.position?.y || 0; // Use optional chaining for position
        
            // Use optional chaining for size and provide default values
            const width = element.size?.width || 100; // Default width if undefined
            const height = element.size?.height || 100; // Default height if undefined
        
            if (element.type === "uploaded-image") {
              return (
                <div
                  key={element.id}
                  className={`dropped-element ${element.type}`}
                  style={{
                    left: posX,
                    top: posY,
                    position: "absolute",
                    margin: 0,
                    width: width,
                    height: height,
                    border: `1em solid ${element.color}`,
                    backgroundColor: element.color,
                    boxSizing: "border-box",
                    cursor: draggingElement ? "grabbing" : "move",
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleTextBoxClick(element.id);
                  }}
                  onDragStart={(e) => handleElementDragStart(e, element)}
                  draggable={!selectedElementId || selectedElementId !== element.id}
                >
                  <div
                    style={{
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <textarea
                      value={element.text}
                      onChange={(e) => handleTextChange(element.id, e.target.value)}
                      onFocus={() => setIsTextFocused(true)}
                      onBlur={() => setIsTextFocused(false)}
                      style={{
                        width: "100%",
                        height: "100%",
                        border: "none",
                        outline: "none",
                        resize: "none",
                        boxSizing: "border-box",
                        fontSize: "16px",
                        color: element.fontColor,
                        fontFamily: element.textFont,
                        backgroundColor: "transparent",
                        overflow: "hidden",
                        cursor: "text",
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTextBoxClick(element.id);
                      }}
                      onMouseDown={(e) => e.stopPropagation()}
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
          {droppedElements.map((element) => {
            const posX = element.position?.x || 0;
            const posY = element.position?.y || 0;
          
            return (
              <div
                key={element.id}
                className={`dropped-element ${element.type}`}
                style={{
                  left: `${posX}px`,
                  top: `${posY}px`,
                  position: "absolute",
                  width: element.size?.width || "auto",
                  height: element.size?.height || "auto",
                }}
              >
                {element.type === "text" ? (
                  <textarea
                    value={element.content}
                    onChange={(e) => handleTempTextChange(element.id, e.target.value)} // Pass the correct ID here
                    style={{
                      ...templateStyles.text,
                      backgroundColor: "transparent",
                      border: "none",
                      width: "100%",
                      height: "100%",
                      resize: "none",
                      outline: "none",
                      fontSize: templateStyles.text.fontSize || "1rem",
                    }}
                  />
                ) : element.type === "image" ? (
                  <img
                    src={element.content}
                    style={templateStyles.image}
                    alt="Template Image"
                    onClick={() => handleImageClick(element.id)}
                  />
                ) : null}
              </div>
            );
          })}
          
          
          
        </div>
        
        </div>
</div>
        </div>
      </div>
    </div>
  );
};

export default EditPortfolio;