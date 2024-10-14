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
        backgroundColor: '#FFC0CB',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        padding: '.25rem',
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
        width: '20rem',
        height: '20rem',
      },
    },
    elements: [
      { id: 'text1', type: 'text', position: {x: 600, y: 0}, content: 'Title of Website', size: {width: 200, height: 50} },
      { id: 'text2', type: 'text', position: {x: 800, y: 100}, content: 'Input your name!', size: {width: 250, height: 80} },
      { id: 'text3', type: 'text', position: {x: 800, y: 200}, content: 'Place Subheading here', size: {width: 250, height: 80}  },
      { id: 'text4', type: 'text', position: {x: 800, y: 300}, content: 'Write your description here!', size: {width: 250, height: 80}  },
      { id: 'image', type: 'image', position: {x: 300, y: 100}, content: simpleTempImage},
      { id: 'text5', type: 'text', position: {x: 1100, y: 100}, content: 'Additional Info', size: {width: 250, height: 80} },
      { id: 'text6', type: 'text', position: {x: 1100, y: 200}, content: 'Place details here!', size: {width: 250, height: 80}  },
      { id: 'text7', type: 'text', position: {x: 1100, y: 300}, content: 'Subheading!', size: {width: 250, height: 80} },
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
      { id: 'text2', type: 'text', position: {x: 250, y: 150}, content: 'CREATIVE TEMPLATE' },
      { id: 'text2', type: 'text', position: {x: 250, y: 250}, content: 'Input name here!' },
      { id: 'text2', type: 'text', position: {x: 250, y: 350}, content: 'Write your description here!' },
      { id: 'image2', type: 'image', position: {x: 550, y: 100}, content: creativeTempImage },
      { id: 'text2', type: 'text', position: {x: 950, y: 150}, content: 'Input Profile ' },
      { id: 'text2', type: 'text', position: {x: 950, y: 250}, content: 'Additional Info!' },
      { id: 'text2', type: 'text', position: {x: 950, y: 350}, content: 'Write your description here!' },
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
      { id: 'text3', type: 'text', position: {x: 400, y: 100}, content: 'Modern Template' },
      { id: 'text3', type: 'text', position: {x: 400, y: 200}, content: 'Input name here!' },
      { id: 'text3', type: 'text', position: {x: 400, y: 300}, content: 'Write your description here!' },
      { id: 'image3', type: 'image', position: {x: 700, y: 0}, content: modernTempImage },
      { id: 'text3', type: 'text', position: {x: 400, y: 500}, content: 'Input Profile ' },
      { id: 'text3', type: 'text', position: {x: 700, y: 500}, content: 'Additional Info!' },
      { id: 'text3', type: 'text', position: {x: 1000, y: 500}, content: 'Write your description here!' },
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
      { id: 'text4', type: 'text', position: {x: 600, y: 0}, content: 'Professional Template' },
      { id: 'text4', type: 'text', position: {x: 250, y: 550}, content: 'Input name here!' },
      { id: 'text4', type: 'text', position: {x: 250, y: 650}, content: 'Write your description here!' },
      { id: 'image4', type: 'image', position: {x: 500, y: 100}, content: professionalTempImage },
      { id: 'text4', type: 'text', position: {x: 600, y: 550}, content: 'Input Profile ' },
      { id: 'text4', type: 'text', position: {x: 600, y: 650}, content: 'Additional Info!' },
      { id: 'text4', type: 'text', position: {x: 1000, y: 550}, content: 'Write your description here!' },
      { id: 'text4', type: 'text', position: {x: 1000, y: 650}, content: 'Input Profile ' },
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
      { id: 'text5', type: 'text', position: {x: 800, y: 0}, content: 'Elegant Template' },
      { id: 'text5', type: 'text', position: {x: 900, y: 100}, content: 'Input name here!' },
      { id: 'text5', type: 'text', position: {x: 1000, y: 200}, content: 'Write your description here!' },
      { id: 'image5', type: 'image', position: {x: 200, y: 0}, content: elegantTempImage },
      { id: 'text5', type: 'text', position: {x: 1000, y: 300}, content: 'Additional Info!' },
      { id: 'text5', type: 'text', position: {x: 900, y: 400}, content: 'Write your description here!' },
      { id: 'text5', type: 'text', position: {x: 800, y: 500}, content: 'Input Profile Info' },
    ],
  },
];

export default templates;
