
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
import ButtonGroup from '@mui/material/ButtonGroup';
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';


function App() {
  
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);   
  const [ticketId, setTicketId] = useState('');
  const [selectedButton, setSelectedButton] = useState('Ticket List'); // Initialize with the default selected button
  const [scratchTicketLoading, setScratchTicketLoading] = useState(false);
  const [noDataFound, setNoDataFound] = useState(false);
  const [androidOrIOS, setAndroidOrIOS] = useState('Android'); // State for Android or iOS select
  const [validator, setValidator] = useState('Ecolane'); // State for the Validator select
  const [apiResponse, setApiResponse] = useState('');
  const redBackgroundRowStyle = {
    backgroundColor: 'lightcoral',
  };
  const transitionStyle = {
    transition: 'opacity 0.5s ease-in-out',
  };
  const handleButtonClick = (buttonText) => {
    if (selectedButton !== buttonText) {
      setSelectedButton(buttonText);
      if (buttonText === 'Search Ticket') {
        // Clear the Search Ticket table when the button is selected
        setTickets([]);
      }
      
    }
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
  const fetchTicketData = () => {
    if (!/^\d+$/.test(ticketId)) {
      // Input is not a valid number
      return;
    }
    setScratchTicketLoading(true);

    axios.get(`http://mqtt.zusan.in:8080/today_data_ticket_id/${ticketId}`)
      .then(response => {
        if (Array.isArray(response.data) && response.data.length > 0) {
          setTickets(response.data);
          setScratchTicketLoading(false);
          setNoDataFound(false);
        } else {
          setTickets([]);
          setScratchTicketLoading(false);
          // alert('No valid response found.');
          setNoDataFound(true);
        }
      })
      .catch(error => {
        console.error("There was an error fetching the data:", error);
        setScratchTicketLoading(false);
        setTickets([]);
      });
  };
  useEffect(() => {
    fetchData(selectedCardToken);
  }, []);
  const handleGetDetailsClick = () => {
    let apiUrl = '';
    setLoading(true); // Set loading state
    if (androidOrIOS === 'Android' && validator === 'Ecolane') {
      apiUrl = 'https://zig-app.com/ConfigAPIV2/Getclientconfig?Pin=ZIG19';
    } else if (androidOrIOS === 'IOS' && validator === 'Ecolane') {
      apiUrl = 'https://zig-app.com/ConfigAPIV2IOS/Getclientconfig?Pin=ZIG19';
    } else if (androidOrIOS === 'Android' && validator === 'MODOT') {
      apiUrl = 'https://zig-trip.com/ConfigAPIV2/Getclientconfig?Pin=ZIG19';
    } else if (androidOrIOS === 'IOS' && validator === 'MODOT') {
      apiUrl = 'https://zig-trip.com/ConfigAPIV2IOS/Getclientconfig?Pin=ZIG19';
    }

    if (apiUrl) {
      axios.get(apiUrl)
        .then(response => {
          console.log("API Response:", response.data);
          setApiResponse(response.data);
          setLoading(false);
        })
        .catch(error => {
          console.error("There was an error fetching the data:", error);
          setApiResponse('');
          setLoading(false);
        });
    }
  };
  useEffect(() => {
    if (selectedButton === 'Ticket List') {
      // When switching back to "Ticket List" button, load data
      fetchData(selectedCardToken);
    }
  }, [selectedButton, selectedCardToken]);
  

  return (
    <div className="App">
    <Typography variant="h4" gutterBottom align="center" marginTop="2%">
      Ticket log panel
    </Typography>

    {/* Center-align the ButtonGroup */}
    <div style={{ textAlign: 'center' , marginTop: "2%" }}>
      <ButtonGroup variant="outlined" aria-label="outlined button group">
        <Button
          onClick={() => handleButtonClick('Ticket List')}
          variant={selectedButton === 'Ticket List' ? 'contained' : 'outlined'}
          style={{ fontWeight: selectedButton === 'Ticket List' ? 'bold' : 'normal' }}
        >
          Ticket List
        </Button>
        <Button
          onClick={() => handleButtonClick('Search Ticket')}
          variant={selectedButton === 'Search Ticket' ? 'contained' : 'outlined'}
          style={{ fontWeight: selectedButton === 'Search Ticket' ? 'bold' : 'normal' }}
        >
          Search Ticket
        </Button>
        <Button
          onClick={() => handleButtonClick('Validator Registered')}
          variant={selectedButton === 'Validator Registered' ? 'contained' : 'outlined'}
          style={{ fontWeight: selectedButton === 'Validator Registered' ? 'bold' : 'normal' }}
        >
          Validator Registered
        </Button>
      </ButtonGroup>
    </div>

    {/* Conditional rendering of Stack and Table */}
    {selectedButton === 'Ticket List' && (
      <>
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
        </Stack>
        {/* Table Component */}
        <div style={{ marginTop: '20px' }}>
          {loading ? (
            <Stack direction="row" spacing={2} alignItems="center" justifyContent="center" marginTop="2%">
              <CircularProgress style={{ marginTop: '20px' }} />
            </Stack>
          ) : tickets.length === 0 ? (
            <Alert severity="info">
              <AlertTitle>Info</AlertTitle>
              No tickets ticket is validated on this device.
            </Alert>
          ) : (
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
      </>
    )}
    {selectedButton === 'Search Ticket' && (
          <Stack direction="row" spacing={2} alignItems="center" justifyContent="center" marginTop="2%">
            <TextField
              label="Ticket ID"
              variant="outlined"
              size="small"
              value={ticketId}
              onChange={(e) => setTicketId(e.target.value)}
              style={{ width: '200px' }} // Adjust width as needed
              inputProps={{ pattern: '[0-9]*' }} // Only allow numeric input
            />
            <Button variant="contained" onClick={fetchTicketData}>
              <SearchIcon />
            </Button>
          </Stack>
        )}
         {scratchTicketLoading && (
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <CircularProgress style={{ marginTop: '20px' }} />
        </div>
      )}
      {noDataFound && selectedButton === 'Search Ticket' && !scratchTicketLoading && (
        <Alert severity="info" style={{ marginTop: '20px' }}>
          <AlertTitle>Info</AlertTitle>
          No data found for this ticket id
        </Alert>
      )}
        {tickets.length > 0 && selectedButton === 'Search Ticket' && (
        <TableContainer style={{ marginTop: '20px', overflow: 'auto', justifyContent: 'center', alignItems: 'center' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell style={{ fontWeight: 'bold', fontSize: '1.5em', width: '550px', textAlign: 'center' }}>User Name</TableCell>
                <TableCell style={{ fontWeight: 'bold', fontSize: '1.5em', width: '550px', textAlign: 'center' }}>Ticket Type</TableCell>
                <TableCell style={{ fontWeight: 'bold', fontSize: '1.5em', width: '550px', textAlign: 'center' }}>Ticket ID</TableCell>
                <TableCell style={{ fontWeight: 'bold', fontSize: '1.5em', width: '550px', textAlign: 'center' }}>Validated Time</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tickets.map((ticket, index) => (
                <TableRow
                  key={ticket.ticket_id}
                  style={index > 0 && ticket.ticket_id === tickets[index - 1].ticket_id ? redBackgroundRowStyle : {}}
                >
                  <TableCell style={{ fontSize: '1.0em', textAlign: 'center' }}>{ticket.username}</TableCell>
                  <TableCell style={{ fontSize: '1.0em', textAlign: 'center' }}>{ticket.ticket_type}</TableCell>
                  <TableCell style={{ fontSize: '1.0em', textAlign: 'center' }}>{ticket.ticket_id}</TableCell>
                  <TableCell style={{ fontSize: '1.0em', textAlign: 'center' }}>{ticket.now_time}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
  {selectedButton === 'Validator Registered' && (
          <>
            <Stack direction="row" spacing={2} alignItems="center" justifyContent="center" marginTop="2%">
              <FormControl variant="outlined" size="small" style={{ marginRight: '10px' }}>
                <Select
                  value={androidOrIOS}
                  onChange={(e) => setAndroidOrIOS(e.target.value)}
                  style={{ width: '150px' }}
                >
                  <MenuItem value="Android">Android</MenuItem>
                  <MenuItem value="IOS">IOS</MenuItem>
                </Select>
              </FormControl>
              <FormControl variant="outlined" size="small" style={{ marginRight: '10px' }}>
                <Select
                  value={validator}
                  onChange={(e) => setValidator(e.target.value)}
                  style={{ width: '150px' }}
                >
                  <MenuItem value="Ecolane">Ecolane</MenuItem>
                  <MenuItem value="MODOT">MODOT</MenuItem>
                </Select>
              </FormControl>
              <Button variant="contained" onClick={handleGetDetailsClick}>
                Get Details
              </Button>
            </Stack>

            {loading && (
              <div style={{ marginTop: '20px', textAlign: 'center' }}>
                <CircularProgress style={{ marginTop: '20px' }} />
              </div>
            )}

            {!loading && apiResponse && (
              <div style={{ marginTop: '20px', textAlign: 'center' }}>
                {apiResponse.map(item => (
               <div key={item.id}>
                 {item.Id && <p>ID: {item.Id}</p>}
                {item.Clientname && <p>Client Name: {item.Clientname}</p>}  
             </div>
              ))}
              </div>
            )}
          </>
        )}
  </div>
  );
}

export default App;