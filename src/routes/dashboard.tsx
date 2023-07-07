import { useState, useEffect } from "react";
import Dashboardlayout from "../layout/dashboardlayout"
import axios from "axios";
import { Link } from 'react-router-dom';
import { useAuth } from "./auth/authprovider";


interface Elemento {
    last_access: string;
    link: string;
    name: string;
    status: string;
  }
  

export default function Dashboard(){
    const auth = useAuth();
    const [elementos, setElementos] = useState<Elemento[]>([]);
    const [modalVisible,setModalVisible] = useState(false)
    const [errorResponse, setErrorResponse] = useState("");
    const [newBank,setNewBank] = useState({
        institution:'',
        username:'',
        password:''
    });

    const handleOpenModal = () =>{
        setModalVisible(true);
    };

    const handleCloseModal = () =>{
        setModalVisible(false);
        setNewBank({
            institution:'',
            username:'',
            password:''
        });
    };

    const handleAddBank = async () => {
        try {
          const response = await axios.post('http://3.22.234.34:5000/api/v1/bank/add', newBank, {
            headers: {
              'x-api-key': auth.token
            }
          });
          setErrorResponse(response.data.message)
          // Actualizar la lista de elementos después de agregar el nuevo elemento en el backend
          getElements();
          
          // Cerrar el modal y limpiar los campos
          handleCloseModal();
        } catch (error) {
          console.error(error);
        }
      };


    useEffect(() => {
      getElements();
    }, []);
  
    const getElements = async () => {
      try {
        const respuesta = await axios.get('http://3.22.234.34:5000/api/v1/bank/get/banks', {
            headers: {
              'x-api-key': auth.token
            }
          });
        setElementos(respuesta.data.data);
      } catch (error) {
        console.error(error);
      }
    };

    const handleDeleteBank = async (link: string) => {
        try {
          await axios.delete('http://3.22.234.34:5000/api/v1/bank/delete', {
            data: { link },
            headers: {
              'x-api-key': auth.token
            }
          });
          
          // Actualizar la lista de elementos después de eliminar el elemento en el backend
          const nuevosElementos = elementos.filter(elemento => elemento.link !== link);
          setElementos(nuevosElementos);
        } catch (error) {
          console.error(error);
        }
      };

    return (
        <Dashboardlayout>
<h1>Lista de Elementos</h1>
      <button onClick={handleOpenModal}>Añadir</button>
      {!!errorResponse && <div className="errorMessage">{errorResponse}</div>}
      {/* Modal */}
      {modalVisible && (
        <div className="modal">
          <div className="modal-content">
            <h2>Add Bank</h2>
            <input
              type="text"
              placeholder="Institution"
              value={newBank.institution}
              onChange={e => setNewBank({ ...newBank, institution: e.target.value })}
            />
            <input
              type="text"
              placeholder="Username"
              value={newBank.username}
              onChange={e => setNewBank({ ...newBank, username: e.target.value })}
            />
            <input
              type="password"
              placeholder="password"
              value={newBank.password}
              onChange={e => setNewBank({ ...newBank, password: e.target.value })}
            />
            <button onClick={handleAddBank}>Add</button>
            <button onClick={handleCloseModal}>Cancel</button>
          </div>
        </div>
      )}
      <h1>Bank List</h1>
      <ul>
        {elementos.map(elemento => (
          <li key={elemento.link}>
            <p><strong>Name:</strong> {elemento.name}</p>
            <p><strong>Status:</strong> {elemento.status}</p>
            <p><strong>Last Access:</strong> {elemento.last_access}</p>
            <Link to={`/transactions?elemento=${encodeURIComponent(JSON.stringify(elemento))}`}>
              <button>See Bank</button>
            </Link>
            <button onClick={() => handleDeleteBank(elemento.link)}>Delete</button>
          </li>
        ))}
      </ul>
    </Dashboardlayout>
    )
}