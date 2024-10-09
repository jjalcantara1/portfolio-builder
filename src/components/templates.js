import simpleTempImage from '../images/template/simple_temp_image.jpg';
import creativeTempImage from '../images/template/creative_temp_image.jpg';
import modernTempImage from '../images/template/modern_temp_image.jpg';
import professionalTempImage from '../images/template/professional_temp_image.jpg';
import elegantTempImage from '../images/template/elegant_temp_image.jpg';

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
  {
    id: 'template3',
    name: 'Modern Template',
    styles: {
      card: {
        backgroundColor: '#1e90ff',
        borderRadius: '10px',
        boxShadow: '0 5px 8px rgba(0, 0, 0, 0.2)',
        padding: '20px',
        margin: '15px',
        width: '10rem',
        textAlign: 'center',
        transition: 'all 0.3s ease-in-out',
        cursor: 'pointer',
      },
      title: {
        fontSize: '1.5rem',
        fontWeight: 'bold',
        marginBottom: '10px',
        color: '#fff',
      },
      text: {
        fontSize: '1rem',
        color: '#f0f0f0',
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
      { id: 'text3', type: 'text', x: 400, y: 100, content: 'Modern Template' },
      { id: 'text3', type: 'text', x: 400, y: 200, content: 'Input name here!' },
      { id: 'text3', type: 'text', x: 400, y: 300, content: 'Write your description here!' },
      { id: 'image3', type: 'image', x: 700, y: 0, content: modernTempImage },
    ],
  },
  {
    id: 'template4',
    name: 'Professional Template',
    styles: {
      card: {
        backgroundColor: '#2c3e50',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)',
        padding: '1rem',
        margin: '15px',
        width: '10rem',
        textAlign: 'center',
        cursor: 'pointer',
      },
      title: {
        fontSize: '1.4rem',
        fontWeight: 'bold',
        marginBottom: '10px',
        color: '#ecf0f1',
      },
      text: {
        fontSize: '1rem',
        color: '#bdc3c7',
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
      { id: 'text4', type: 'text', x: 600, y: 0, content: 'Professional Template' },
      { id: 'text4', type: 'text', x: 600, y: 550, content: 'Input name here!' },
      { id: 'text4', type: 'text', x: 600, y: 650, content: 'Write your description here!' },
      { id: 'image4', type: 'image', x: 500, y: 100, content: professionalTempImage },
    ],
  },
  {
    id: 'template5',
    name: 'Elegant Template',
    styles: {
      card: {
        backgroundColor: '#f5f5f5',
        borderRadius: '12px',
        boxShadow: '0 6px 10px rgba(0, 0, 0, 0.15)',
        padding: '25px',
        margin: '15px',
        width: '10rem',
        textAlign: 'center',
        cursor: 'pointer',
      },
      title: {
        fontSize: '1.6rem',
        fontWeight: 'bold',
        marginBottom: '10px',
        color: '#2c3e50',
      },
      text: {
        fontSize: '1rem',
        color: '#7f8c8d',
        marginBottom: '8px',
      },
      image: {
        width: '100%',
        height: 'auto',
        borderRadius: '8px',
        marginBottom: '10px',
      },
    },
    elements: [
      { id: 'text5', type: 'text', x: 800, y: 200, content: 'Elegant Template' },
      { id: 'text5', type: 'text', x: 900, y: 300, content: 'Input name here!' },
      { id: 'text5', type: 'text', x: 1000, y: 400, content: 'Write your description here!' },
      { id: 'image5', type: 'image', x: 200, y: 100, content: elegantTempImage },
    ],
  },
];

export default templates;
