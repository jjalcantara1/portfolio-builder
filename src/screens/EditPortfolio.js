import React, { useEffect, useState } from 'react';
import { Rnd } from 'react-rnd';
import { db } from '../firebase'; // Import your Firebase config
import { doc, setDoc, onSnapshot } from 'firebase/firestore';
import { useAuth } from '../components/AuthContext';
import { Button, Container } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom'; // Import useParams to get the templateId from the URL
import templates from '../components/templates'; // Import your template list
import logo from '../images/porthub_logo.png';

const EditPortfolio = () => {
  const { user } = useAuth();
  const { templateId } = useParams(); // Get the templateId from the URL
  const [elements, setElements] = useState([]);
  const [templateStyles, setTemplateStyles] = useState({}); // State to hold template styles
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      const docRef = doc(db, 'portfolios', user.uid);
      const unsubscribe = onSnapshot(docRef, (doc) => {
        if (doc.exists()) {
          setElements(doc.data().elements || []);
        }
      });

      return () => unsubscribe();
    }
  }, [user]);

  // Load selected template elements and styles based on templateId
  useEffect(() => {
    if (templateId) {
      const selectedTemplate = templates.find((t) => t.id === templateId);
      if (selectedTemplate) {
        setElements(selectedTemplate.elements);
        setTemplateStyles(selectedTemplate.styles); // Set template styles
      }
    }
  }, [templateId]);

  // Save the portfolio automatically when elements change
  useEffect(() => {
    const savePortfolio = async () => {
      if (user) {
        await setDoc(doc(db, 'portfolios', user.uid), { elements });
      }
    };
    savePortfolio();
  }, [elements, user]);

  // Handle drag and drop of elements
  const handleDragStop = (id, data) => {
    setElements((prev) =>
      prev.map((el) => (el.id === id ? { ...el, x: data.x, y: data.y } : el))
    );
  };

  // Handle resize stop
  const handleResizeStop = (id, width, height, position) => {
    setElements((prev) =>
      prev.map((el) =>
        el.id === id ? { ...el, width, height, x: position.x, y: position.y } : el
      )
    );
  };

  // Add new elements
  const handleAddElement = (type) => {
    const newElement = {
      id: new Date().toISOString(),
      type,
      x: 100,
      y: 100,
      width: 200, // Set default width
      height: type === 'text' ? 50 : 150, // Set default height based on type
      content: type === 'text' ? 'Sample Text' : '',
    };
    setElements((prev) => [...prev, newElement]);
  };

  // Delete an element
  const handleDeleteElement = (id) => {
    setElements((prev) => prev.filter((el) => el.id !== id));
  };

  return (
    <Container className="mt-4">
      <div id="nav">
        <img src={logo} alt="Logo" id="logo" />
        <div id="topcontainer">
          <div id="innercon">
            <h1>Templates</h1>
            <h1 id="highlight">Portfolio</h1>
          </div>
        </div>
        <div id="signoutcon">
          <button id="signoutbutton" onClick={() => navigate('/logout')}>
            Sign out
          </button>
        </div>
      </div>

      <h1>Edit Your Portfolio</h1>
      <Button onClick={() => handleAddElement('text')}>Add Text</Button>
      <Button onClick={() => handleAddElement('image')}>Add Image</Button>

      <div
        style={{
          border: '1px solid #ccc',
          height: '600px',
          position: 'relative',
          marginTop: '20px',
          overflow: 'hidden', // Ensure overflow is hidden
        }}
      >
        {elements.map((element) => (
          <Rnd
            key={element.id}
            default={{
              x: element.x,
              y: element.y,
              width: element.width,
              height: element.height,
            }}
            onDragStop={(e, d) => handleDragStop(element.id, d)}
            onResizeStop={(e, direction, ref, delta, position) => {
              handleResizeStop(element.id, ref.offsetWidth, ref.offsetHeight, position);
            }}
            enableResizing={{
              bottomRight: true,
              bottomLeft: true,
              topRight: true,
              topLeft: true,
              top: true,
              right: true,
              bottom: true,
              left: true,
            }}
            bounds="parent" // Ensure it can be dragged within the parent
          >
            <div
              style={{
                ...templateStyles.card,
                padding: '10px',
                textAlign: 'center',
                position: 'relative',
                height: '100%', // Allow full height
                width: '100%', // Allow full width
              }}
            >
              {element.type === 'text' && (
                <input
                  type="text"
                  value={element.content}
                  onChange={(e) => {
                    const updatedElements = elements.map((el) =>
                      el.id === element.id ? { ...el, content: e.target.value } : el
                    );
                    setElements(updatedElements); // Trigger autosave
                  }}
                />
              )}
              {element.type === 'image' && (
                <img
                  src={element.content}
                  alt="Element"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    ...templateStyles.image, // Apply image styles
                  }}
                />
              )}

              {/* Delete Button */}
              <Button
                variant="danger"
                size="sm"
                style={{ position: 'absolute', top: 0, right: 0 }}
                onClick={() => handleDeleteElement(element.id)}
              >
                Delete
              </Button>
            </div>
          </Rnd>
        ))}
      </div>
    </Container>
  );
};

export default EditPortfolio;
