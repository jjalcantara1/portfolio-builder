import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { useAuth } from '../components/AuthContext';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Button, Form, Container, InputGroup } from 'react-bootstrap';

const EditPortfolio = () => {
  const { user } = useAuth();
  const [portfolio, setPortfolio] = useState({ header: 'My Portfolio', sections: [] });
  const [bgColor, setBgColor] = useState('#ffffff');
  const [font, setFont] = useState('Arial');

  useEffect(() => {
    const fetchPortfolio = async () => {
      if (user) {
        const docRef = doc(db, 'portfolios', user.username);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setPortfolio(docSnap.data());
          setBgColor(docSnap.data().bgColor || '#ffffff');
          setFont(docSnap.data().font || 'Arial');
        }
      }
    };
    fetchPortfolio();
  }, [user]);

  const savePortfolio = async () => {
    if (user) {
      await setDoc(doc(db, 'portfolios', user.username), {
        ...portfolio,
        bgColor,
        font,
      });
    }
  };

  const handleOnDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(portfolio.sections);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setPortfolio({ ...portfolio, sections: items });
    savePortfolio();
  };

  const handleContentChange = (id, value) => {
    const updatedSections = portfolio.sections.map(section => 
      section.id === id ? { ...section, title: value } : section
    );
    setPortfolio({ ...portfolio, sections: updatedSections });
  };

  const handleDeleteSection = (id) => {
    const updatedSections = portfolio.sections.filter(section => section.id !== id);
    setPortfolio({ ...portfolio, sections: updatedSections });
    savePortfolio();
  };

  const handleUploadMedia = async (id, file) => {
    // Handle media upload (e.g., using Firebase Storage) and update the section with the media URL
  };

  return (
    <Container style={{ backgroundColor: bgColor, fontFamily: font }}>
      <h1>{portfolio.header}</h1>
      <InputGroup className="mb-3">
        <InputGroup.Text>Background Color</InputGroup.Text>
        <Form.Control 
          type="color" 
          value={bgColor} 
          onChange={(e) => setBgColor(e.target.value)} 
        />
      </InputGroup>
      <InputGroup className="mb-3">
        <InputGroup.Text>Font</InputGroup.Text>
        <Form.Control 
          as="select" 
          value={font} 
          onChange={(e) => setFont(e.target.value)}
        >
          <option value="Arial">Arial</option>
          <option value="Courier New">Courier New</option>
          <option value="Georgia">Georgia</option>
          <option value="Times New Roman">Times New Roman</option>
        </Form.Control>
      </InputGroup>
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Droppable droppableId="sections">
          {(provided) => (
            <ul {...provided.droppableProps} ref={provided.innerRef}>
              {portfolio.sections.map((section, index) => (
                <Draggable key={section.id} draggableId={section.id} index={index}>
                  {(provided) => (
                    <li ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                      <Form.Control
                        type="text"
                        value={section.title}
                        onChange={(e) => handleContentChange(section.id, e.target.value)}
                      />
                      <Button onClick={() => handleDeleteSection(section.id)}>Delete</Button>
                      <input 
                        type="file" 
                        onChange={(e) => handleUploadMedia(section.id, e.target.files[0])} 
                      />
                    </li>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
      <Button onClick={savePortfolio}>Save Portfolio</Button>
    </Container>
  );
};

export default EditPortfolio;
