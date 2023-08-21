
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
  const getStatusText = (status) => {
    switch (status) {
      case 0:
        return "Expired";
      case 1:
        return "New Ticket";
      case 2:
        return "Active Ticket";
      case 3:
        return "Validated Ticket";
      default:
        return "Unknown Status";  // This can be adjusted based on your needs
    }
  };
  
  const cards = [
    { name: "Ble card 1", token: "01504799-7e33-4a59-83d2-fcf7389237d6" },
    { name: "Ble card 2", token: "1855e860-c57b-4c2f-9a04-9fc4ad9ba2d0" },
    { name: "Ble card 3", token: "45b4fd0f-546b-4959-8a33-759222852653" }
  ];
  const [selectedCardToken, setSelectedCardToken] = useState(cards[0].token); 
  const fetchData = (token) => {
    setLoading(true);
  
    axios.get(`https://zig-trip.com/ZIGSmartIOS/api/Tickets/GetTickets?token=${token}`)
      .then(response => {
        setTickets(response.data.Tickets);
        setLoading(false);
      })
      .catch(error => {
        console.error("There was an error fetching the data:", error);
        setLoading(false);
      });
  };

  const buyTickets = () => {
    const body = {
      TotalAmount: 1.5,
      TransactionDate: "2023-08-16T06:06:10",
      DestinationAddress: "1257 S 3rd St, Louisville, KY 40203, USA",
      TransactionId: "9225863172407970",
      Token: selectedCardToken,
      PlaceId: "45",
      Message: "Ticket Take in Hardware",
      FromAddress: "Louisville, KY, USA",
      Tickets: [
        {
          FromAddress: "S 6th @ W Liberty",
          DestinationAddress: "4th @ Ormsby",
          Amount: "1.5",
          RouteId: "Single Ride",
          TripId: "4",
          ProfileId: 227345,
          Fareid: 147
        }
      ],
      Agencyid: 37
    };
  
    axios.post('https://zig-trip.com/Zigsmartios/api/Tickets/Add', body)
      .then(response => {
        if (response.data.Message === "Ok") {
          fetchData(selectedCardToken);
        } else {
          console.error("Error buying tickets:", response.data.Message);
        }
      })
      .catch(error => {
        console.error("There was an error buying tickets:", error);
      });
  }
  
  
  useEffect(() => {
    fetchData(selectedCardToken);
  }, []);
  

  return (
    <div className="App">
      <Typography variant="h4" gutterBottom align="center" marginTop= "2%">
        Ble card panel
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
        <Button variant="contained"  onClick={fetchData}>Reload</Button>
        <Button onClick={buyTickets} variant="contained">Buy Tickets</Button>
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
            No tickets are available for this account.
          </Alert>
        ) :(
      <TableContainer style={{ marginTop: '20px', overflow:"auto"}}>
        <Table>
          <TableHead>
            <TableRow>
                <TableCell style={{ fontWeight: 'bold' }}>Agency Name</TableCell>
                <TableCell style={{ fontWeight: 'bold' }}>Ticket ID</TableCell>
                <TableCell style={{ fontWeight: 'bold' }}>Count</TableCell>
                <TableCell style={{ fontWeight: 'bold' }}>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tickets.map(ticket => 
              ticket.Subsets.map(subset => (
                <TableRow key={subset.TicketId}>
                  <TableCell>{subset.AgencyName}</TableCell>
                  <TableCell>{subset.TicketId}</TableCell>
                  <TableCell>{subset.Amount}</TableCell>
                  <TableCell>{getStatusText(subset.status)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      )}
      </div>
    </div>
  );
}

export default App;