
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
import ReplayIcon from '@mui/icons-material/Replay';
import { Alert, AlertTitle } from '@mui/material';


function App() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);   
  const redBackgroundRowStyle = {
    backgroundColor: 'lightcoral',
  };
  
  const cards = [
    { name: "35-device", token: "98:CD:AC:51:4A:E8" },
    { name: "37-device", token: "98:CD:AC:51:4A:BC" },
    { name: "20-device", token: "DC:4F:22:5F:04:6C" },
    { name: "70-device", token: "04:E9:E5:15:70:AC" },
    { name: "75-device", token: "04:E9:E5:15:70:8B" }
  ];
  const [selectedCardToken, setSelectedCardToken] = useState(cards[0].token); 

  const fetchData = (token) => {
    setLoading(true);
  
    axios.get(`http://mqtt.zusan.in:8080/today_data_device_id/${token}`)
      .then(response => {
        setTickets(response.data);
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
        Ticket log panel
      </Typography>
      <Stack direction="row" spacing={2} alignItems="center" justifyContent="center" marginTop="2%">
        <FormControl variant="outlined" size="small">
          <Select
            value={selectedCardToken}
            onChange={(e) => {
              setSelectedCardToken(e.target.value);
              fetchData(e.target.value); // This line ensures proper fetching when a new card is selected
            }}
            style={{ marginRight: '10px', width: '200px' }}
          >
            {cards.map(card => (
              <MenuItem key={card.token} value={card.token}>{card.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button variant="contained" onClick={() => fetchData(selectedCardToken)}>
          <ReplayIcon />
        </Button>
        {/* <Button variant="contained">Buy Tickets</Button> */}
      </Stack>
      {/* Table Component */}
      <div style={{ marginTop: '20px' }}>
        {loading ? (
          <Stack direction="row" spacing={2} alignItems="center" justifyContent="center" marginTop="2%">
          <CircularProgress style={{ marginTop: '20px' }}/>
          </Stack>
        ) : tickets.length === 0 ? (
          <Alert severity="info">
            <AlertTitle>Info</AlertTitle>
            No tickets ticket is validated on this device.
          </Alert>
        ) :(
          <TableContainer style={{ marginTop: '20px', overflow: "auto", justifyContent: 'center', alignItems: 'center' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell style={{ fontWeight: 'bold', fontSize: '1.5em', width: '550px', textAlign: 'center' }}>User Name</TableCell>
                  <TableCell style={{ fontWeight: 'bold', fontSize: '1.5em', width: '550px', textAlign: 'center' }}>Ticket ID</TableCell>
                  <TableCell style={{ fontWeight: 'bold', fontSize: '1.5em', width: '550px', textAlign: 'center' }}>Count</TableCell>
                  <TableCell style={{ fontWeight: 'bold', fontSize: '1.5em', width: '550px', textAlign: 'center' }}>Validated time</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tickets.map((ticket, index) => (
                  <TableRow
                    key={ticket.ticket_id}
                    style={index > 0 && ticket.ticket_id === tickets[index - 1].ticket_id ? redBackgroundRowStyle : {}}
                  >
                    <TableCell style={{ fontSize: '1.0em', textAlign: 'center' }}>{ticket.username}</TableCell>
                    <TableCell style={{ fontSize: '1.0em', textAlign: 'center' }}>{ticket.ticket_id}</TableCell>
                    <TableCell style={{ fontSize: '1.0em', textAlign: 'center' }}>{ticket.count}</TableCell>
                    <TableCell style={{ fontSize: '1.0em', textAlign: 'center' }}>{ticket.now_time}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
      )}
      </div>
    </div>
  );
}

export default App;