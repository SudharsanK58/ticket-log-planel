
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import axios from 'axios';
import React, { useState, useEffect, useContext } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { Alert, AlertTitle } from '@mui/material';
import Chip from '@mui/material/Chip';


function App() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true); 
  
  const cards = [
    { name: "Device 1", token: "04:e9:e5:14:90:26" },
    { name: "Device 2", token: "1855e860-c57b-4c2f-9a04-9fc4ad9ba2d0" }
  ];
  const [selectedCardToken, setSelectedCardToken] = useState(cards[0].token); 
  const fetchData = (token) => {
    setLoading(true);
  
    axios.get(`http://mqtt.zusan.in:8081/getDeviceData?deviceId=${token}`)
      .then(response => {
        setTickets(response.data.Tickets);
        console.log(`http://mqtt.zusan.in:8081/getDeviceData?deviceId=${token}`);
        console.log(response);
        setLoading(false);
      })
      .catch(error => {
        console.error("There was an error fetching the data:", error);
        setLoading(false);
      });
  };
  
  useEffect(() => {
    fetchData(selectedCardToken);
  }, []);
  

  return (
    <div className="App">
      <Typography variant="h4" gutterBottom align="center" marginTop= "2%">
        Device config panel
      </Typography>
      <Stack direction="row" spacing={2} alignItems="center" justifyContent="center" marginTop="2%">
      <FormControl variant="outlined"size="small">
      <Select 
        value={selectedCardToken} 
        onChange={(e) => {
          setSelectedCardToken(e.target.value);
          fetchData(e.target.value);
        }}
        style={{ marginRight: '10px', width: '200px' }}
      >
        {cards.map(card => (
          <MenuItem key={card.token} value={card.token}>{card.name}</MenuItem>
        ))}
      </Select>
        </FormControl>
        <Button variant="contained" onClick={fetchData}>Reload</Button>
        <Button variant="contained">Update device</Button>
      </Stack>
      {/* Table Component */}
      <TableContainer style={{ marginTop: '20px', overflow:"auto"}}>
      </TableContainer>
      </div>
  );
}

export default App;
