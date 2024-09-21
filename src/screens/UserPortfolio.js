import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useParams } from 'react-router-dom';
import { Container } from 'react-bootstrap';

const UserPortfolio = () => {
  const { username } = useParams();
  const [portfolio, setPortfolio] = useState(null);

  useEffect(() => {
    const fetchPortfolio = async () => {
      const docRef = doc(db, 'portfolios', username);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setPortfolio(docSnap.data());
      }
    };
    fetchPortfolio();
  }, [username]);

  if (!portfolio) return <div>Loading...</div>;

  return (
    <Container>
      <h1>{portfolio.header}</h1>
      {portfolio.sections.map((section) => (
        <div key={section.id}>
          <h2>{section.title}</h2>
          <p>{section.content}</p>
        </div>
      ))}
    </Container>
  );
};

export default UserPortfolio;
