import React, { useEffect, useState } from 'react';
import { db } from '../firebase'; // Import your Firebase config
import { doc, onSnapshot } from 'firebase/firestore';
import { useAuth } from '../components/AuthContext';
import { Container } from 'react-bootstrap';

const UserPortfolio = () => {
  const { user } = useAuth();
  const [elements, setElements] = useState([]);

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

  return (
    <Container className="mt-4">
      <h1>Your Portfolio</h1>
      <div
        style={{
          border: '1px solid #ccc',
          height: '600px',
          position: 'relative',
          marginTop: '20px',
        }}
      >
        {elements.map((element) => (
          <div
            key={element.id}
            style={{
              position: 'absolute',
              left: element.x,
              top: element.y,
              width: element.type === 'text' ? 200 : 150,
              height: element.type === 'text' ? 50 : 150,
              border: '1px solid #000',
              backgroundColor: '#fff',
              padding: '10px',
              textAlign: 'center',
            }}
          >
            {element.type === 'text' && <input type="text" value={element.content} readOnly />}
            {element.type === 'image' && (
              <img
                src={element.content}
                alt="Element"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            )}
          </div>
        ))}
      </div>
    </Container>
  );
};

export default UserPortfolio;
