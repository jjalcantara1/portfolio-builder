import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { useAuth } from '../components/AuthContext';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Button, Container, Form, InputGroup, Col, Row, Card, Alert } from 'react-bootstrap';
import { templates } from '../components/templates';

const EditPortfolio = () => {
  const { user } = useAuth();
  const [portfolio, setPortfolio] = useState({ header: 'My Portfolio', sections: [] });
  const [headerColor, setHeaderColor] = useState('#000');
  const [fontStyle, setFontStyle] = useState('Arial');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchPortfolio = async () => {
      if (user) {
        const docRef = doc(db, 'portfolios', user.username);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setPortfolio(docSnap.data());
          setHeaderColor(docSnap.data().headerColor || '#000');
          setFontStyle(docSnap.data().fontStyle || 'Arial');
        }
      }
    };
    fetchPortfolio();
  }, [user]);

  const savePortfolio = async () => {
    try {
      if (user) {
        await setDoc(doc(db, 'portfolios', user.username), { ...portfolio, headerColor, fontStyle });
      }
    } catch (error) {
      setErrorMessage('Error saving portfolio. Please try again.');
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

  const handleAddSection = (template) => {
    const newSection = { ...template, id: new Date().toISOString() }; // Ensure unique ID
    setPortfolio((prev) => ({
      ...prev,
      sections: [...prev.sections, newSection],
    }));
    savePortfolio();
  };

  // Static sections for testing
  const staticSections = [
    { id: '1', type: 'text', content: 'Sample Text Section' },
    { id: '2', type: 'image', content: 'https://via.placeholder.com/150' },
    { id: '3', type: 'link', content: 'https://example.com' },
  ];

  return (
    <Container className="mt-4">
      <h1 style={{ color: headerColor, fontFamily: fontStyle }}>{portfolio.header}</h1>
      {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
      <InputGroup className="mb-3">
        <InputGroup.Text>Header Color</InputGroup.Text>
        <Form.Control
          type="color"
          value={headerColor}
          onChange={(e) => setHeaderColor(e.target.value)}
        />
      </InputGroup>
      <InputGroup className="mb-3">
        <InputGroup.Text>Font Style</InputGroup.Text>
        <Form.Control
          as="select"
          value={fontStyle}
          onChange={(e) => setFontStyle(e.target.value)}
        >
          <option>Arial</option>
          <option>Courier New</option>
          <option>Georgia</option>
          <option>Times New Roman</option>
          <option>Verdana</option>
        </Form.Control>
      </InputGroup>

      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Row>
          <Col md={4}>
            <Droppable droppableId="templates">
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps} className="border p-2 bg-light">
                  <h4>Templates</h4>
                  {templates.map((template) => (
                    <Card key={template.id} className="mb-2">
                      <Card.Body>
                        <Button 
                          variant="outline-primary"
                          onClick={() => handleAddSection(template)} 
                          className="w-100"
                        >
                          {template.title}
                        </Button>
                      </Card.Body>
                    </Card>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </Col>
          <Col md={8}>
            <Droppable droppableId="sections">
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps} className="border p-2 bg-light">
                  <h4>Your Sections</h4>
                  {staticSections.map((section, index) => (
                    <Draggable key={section.id} draggableId={section.id} index={index}>
                      {(provided) => (
                        <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className="mb-3 p-2 border rounded bg-white">
                          {section.type === 'text' && (
                            <Form.Control
                              type="text"
                              defaultValue={section.content}
                            />
                          )}
                          {section.type === 'image' && (
                            <img src={section.content} alt="section" style={{ width: '100%', borderRadius: '5px' }} />
                          )}
                          {section.type === 'link' && (
                            <Form.Control
                              type="text"
                              defaultValue={section.content}
                            />
                          )}
                          <Button variant="danger" className="mt-2">Delete</Button>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </Col>
        </Row>
      </DragDropContext>
      <Button onClick={savePortfolio} className="mt-3">Save Portfolio</Button>
    </Container>
  );
};

export default EditPortfolio;
