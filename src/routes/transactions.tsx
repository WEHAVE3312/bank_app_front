import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios'
import Dashboardlayout from "../layout/dashboardlayout"
import { useAuth } from "./auth/authprovider";

interface Transaction {
  currency: string;
  amount: string;
  name: string;
  reference: string;
  status: string;
  category: string;
  type: string
}

export default function Transactions(){
  const auth = useAuth();


    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const elemento = searchParams.get('elemento');
    const elementoObjeto = elemento ? JSON.parse(decodeURIComponent(elemento)):null;
    const [transactions, setTransactions] = useState<Transaction[]>([]);


    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
  

    const handleSearch = async () => {
        try {
          const requestData = {
            link: elementoObjeto.link,
            date_from: dateFrom,
            date_to: dateTo
          };
          console.log(requestData)
          const response = await axios.post('http://3.22.234.34:5000/api/v1/bank/get/transactions', requestData,{
            headers:{
                'x-api-key': auth.token
            }
          });
          setTransactions(response.data.data);
        } catch (error) {
          console.error(error);
        }
      };

    useEffect(() => {
        if (dateFrom && dateTo) {
          handleSearch();
        }
      }, [dateFrom, dateTo]);

    return  (
      <Dashboardlayout>
        <div>
        <h1>Your Transactions</h1>
        {elementoObjeto ? (
          <div>
            <h2>Details</h2>
            <p><strong>Name:</strong> {elementoObjeto.name}</p>
            <p><strong>Status:</strong> {elementoObjeto.status}</p>
            <p><strong>Last Access:</strong> {elementoObjeto.last_access}</p>
          </div>
        ) : (
          <p>No transactions.</p>
        )}
  
        <div>
          <h2>Search Transactions</h2>
          <label htmlFor="dateFrom">Date from:</label>
          <input
            type="date"
            id="dateFrom"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
          />
  
          <label htmlFor="dateTo">Date to:</label>
          <input
            type="date"
            id="dateTo"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
          />
  
          <button onClick={handleSearch}>Buscar</button>
        </div>
  
        <div>
          <h2>Transactions</h2>
          {transactions.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Reference</th>
                  <th>amount</th>
                  <th>Currency</th>
                  <th>Status</th>
                  <th>Category</th>
                  <th>Type</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction, index) => (
                  <tr key={index}>
                    <td>{transaction.name}</td>
                    <td>{transaction.reference}</td>
                    <td>{transaction.amount}</td>
                    <td>{transaction.currency}</td>
                    <td>{transaction.status}</td>
                    <td>{transaction.category}</td>
                    <td>{transaction.type}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No transactions.</p>
          )}
        </div>
      </div>
      </Dashboardlayout>
      );
}