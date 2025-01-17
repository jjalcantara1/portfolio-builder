import React, { useEffect, useState } from 'react';
import { Rnd } from 'react-rnd';
import { db } from '../firebase'; // Import your Firebase config
import { doc, setDoc, onSnapshot } from 'firebase/firestore';
import { useAuth } from '../components/AuthContext';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import templates from '../components/templates'; 
import '../css/CardButton.css';
import Navbar from "../components/Navbar";

const Template = () => {
  const { user } = useAuth();
  const [elements, setElements] = useState([]);
  const navigate = useNavigate();

  // Load elements when the user is logged in
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

  // Autosave elements whenever they change
  useEffect(() => {
    const savePortfolio = async () => {
      if (user) {
        await setDoc(doc(db, 'portfolios', user.uid), { elements });
      }
    };
    savePortfolio();
  }, [elements, user]); // Save whenever elements change

  const handleLoadTemplate = (templateId) => {
    navigate(`/edit/${templateId}`);
  };

  // Handle dragging of elements
  const handleDragStop = (id, data) => {
    setElements((prev) =>
      prev.map((el) => (el.id === id ? { ...el, x: data.x, y: data.y } : el))
    );
  };

  // Handle adding new elements (text or image)
  const handleAddElement = (type) => {
    const newElement = {
      id: new Date().toISOString(),
      type,
      x: 100,
      y: 100,
      content: type === 'text' ? 'Sample Text' : '',
    };
    setElements((prev) => [...prev, newElement]);
  };

  // Handle deleting an element by id
  const handleDeleteElement = (id) => {
    setElements((prev) => prev.filter((el) => el.id !== id));
  };

  return (
    <div id="templatebody">
      {/* Implement your new Navbar */}
      <Navbar />

      <div style={{ flex: '1', display: 'flex', flexDirection: 'column' }}>
        <div id="portcon">
          <div id="cardcon">
            <div className="template-card" onClick={() => navigate('/portfolio')}>
              <h2 id="createtemp">Create your Own Template</h2>
            </div>

            {templates.map((template) => (
              <div
                key={template.id}
                className="template-card"
                onClick={() => handleLoadTemplate(template.id)}
              >
                <h2>{template.name}</h2>
              </div>
            ))}
          </div>
        </div>

        {/* Editable elements area */}
        <div className="editable-area" style={{ marginTop: '80px' }}>
          {elements.map((element) => (
            <Rnd
              key={element.id}
              default={{
                x: element.x,
                y: element.y,
                width: 200,
                height: element.type === 'text' ? 50 : 150,
              }}
              onDragStop={(e, d) => handleDragStop(element.id, d)}
            >
              <div className="element-card">
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
                {/* {element.type === 'image' && (
                  <img
                    src={element.content}
                    alt="Element"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                )} */}
                
                <Button variant="danger" onClick={() => handleDeleteElement(element.id)}>
                  Delete
                </Button>
              </div>
            </Rnd>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Template;
