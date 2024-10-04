import simpleTempImage from '../images/template/simple_temp_image.jpg';
import creativeTempImage from '../images/template/creative_temp_image.jpg';

const templates = [
  {
    id: 'template1',
    name: 'Simple Template',
    styles: {
      card: {
        backgroundColor: '#ffa500',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        padding: '1rem',
        margin: '15px',
        width: '10rem',
        textAlign: 'center',
        cursor: 'cursor',
      },
      title: {
        fontSize: '1.4rem',
        fontWeight: 'bold',
        marginBottom: '10px',
        color: '#333',
      },
      text: {
        fontSize: '1rem',
        color: '#555',
        marginBottom: '8px',
      },
      image: {
        width: '100%',
        height: 'auto',
        borderRadius: '5px',
        marginBottom: '10px',
      },
    },
    elements: [
      { id: 'text1', type: 'text', x: 300, y: 400, content: 'Simple Template' },
      { id: 'text1', type: 'text', x: 600, y: 400, content: 'Input name here!' },
      { id: 'text1', type: 'text', x: 900, y: 400, content: 'Write your description here!' },
      { id: 'image1', type: 'image', x: 600, y: 0, content: simpleTempImage },
    ],
  },
  {
    id: 'template2',
    name: 'Creative Template',
    styles: {
      card: {
        backgroundColor: '#f9f9f9',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        padding: '20px',
        margin: '15px',
        width: '10rem',
        textAlign: 'center',
        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
        cursor: 'pointer',
      },
      title: {
        fontSize: '1.4rem',
        fontWeight: 'bold',
        marginBottom: '10px',
        color: '#333',
      },
      text: {
        fontSize: '1rem',
        color: '#555',
        marginBottom: '8px',
      },
      image: {
        width: '100%',
        height: 'auto',
        borderRadius: '5px',
        marginBottom: '10px',
      },
    },
    elements: [
      { id: 'text2', type: 'text', x: 800, y: 100, content: 'CREATIVE TEMPLATE' },
      { id: 'text2', type: 'text', x: 800, y: 200, content: 'Input name here!' },
      { id: 'text2', type: 'text', x: 800, y: 300, content: 'Write your description here!' },
      { id: 'image2', type: 'image', x: 300, y: 100, content: creativeTempImage },
    ],
  },
];

export default templates;
