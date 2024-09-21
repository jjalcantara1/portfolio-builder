import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { useAuth } from '../components/AuthContext';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Button, Container, Form, InputGroup, Col, Row } from 'react-bootstrap';
import { templates } from '../components/templates'; // Import your template data

const EditPortfolio = () => {
  const { user } = useAuth();
  const [portfolio, setPortfolio] = useState({ header: 'My Portfolio', sections: [] });
  const [headerColor, setHeaderColor] = useState('#000');
  const [fontStyle, setFontStyle] = useState('Arial');

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
    if (user) {
      await setDoc(doc(db, 'portfolios', user.username), { ...portfolio, headerColor, fontStyle });
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
    const newSection = { ...template, id: new Date().toISOString() };
    setPortfolio((prev) => ({
      ...prev,
      sections: [...prev.sections, newSection],
    }));
    savePortfolio();
  };

  const handleContentChange = (id, value) => {
    const updatedSections = portfolio.sections.map(section =>
      section.id === id ? { ...section, content: value } : section
    );
    setPortfolio({ ...portfolio, sections: updatedSections });
    savePortfolio();
  };

  const handleDeleteSection = (id) => {
    const updatedSections = portfolio.sections.filter(section => section.id !== id);
    setPortfolio({ ...portfolio, sections: updatedSections });
    savePortfolio();
  };

  const handleImageUpload = async (event, sectionId) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const updatedSections = portfolio.sections.map(section =>
          section.id === sectionId ? { ...section, content: reader.result } : section
        );
        setPortfolio({ ...portfolio, sections: updatedSections });
        savePortfolio();
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Container>
      <h1 style={{ color: headerColor, fontFamily: fontStyle }}>{portfolio.header}</h1>
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
                <div ref={provided.innerRef} {...provided.droppableProps}>
                  <h2>Templates</h2>
                  {templates.map((template, index) => (
                    <Button 
                      key={template.id} 
                      onClick={() => handleAddSection(template)} 
                      className="mb-2"
                    >
                      {template.title}
                    </Button>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </Col>
          <Col md={8}>
            <Droppable droppableId="sections">
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                  <h2>Your Sections</h2>
                  {portfolio.sections.map((section, index) => (
                    <Draggable key={section.id} draggableId={section.id} index={index}>
                      {(provided) => (
                        <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className="mb-3">
                          {section.type === 'text' && (
                            <Form.Control
                              type="text"
                              defaultValue={section.content}
                              onChange={(e) => handleContentChange(section.id, e.target.value)}
                            />
                          )}
                          {section.type === 'image' && (
                            <>
                              <img src={section.content} alt="section" style={{ width: '100%' }} />
                              <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, section.id)} />
                            </>
                          )}
                          {section.type === 'link' && (
                            <Form.Control
                              type="text"
                              defaultValue={section.content}
                              onChange={(e) => handleContentChange(section.id, e.target.value)}
                            />
                          )}
                          <Button variant="danger" onClick={() => handleDeleteSection(section.id)}>Delete</Button>
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
      <Button onClick={savePortfolio}>Save Portfolio</Button>
    </Container>
  );
};

export default EditPortfolio;
