
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
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Paper from '@mui/material/Paper';


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
  const [selectedTimezone, setSelectedTimezone] = useState('IST'); // Initialize with a default value if needed
  const [deviceStatusLoading, setDeviceStatusLoading] = useState(false);
  const [deviceStatusData, setDeviceStatusData] = useState(null);
  const [searchDeviceIdMode, setSearchDeviceIdMode] = useState('');
  const [searchedDeviceId, setSearchedDeviceId] = useState('');
  const [isSearchingDeviceId, setIsSearchingDeviceId] = useState(false);
  const [searchDeviceIdResponse, setSearchDeviceIdResponse] = useState(null);
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const [ticketlistSelectedTimeZone, ticketlistsetSelectedTimeZone] = useState('IST'); // Define ticketlistSelectedTimeZone and ticketlistsetSelectedTimeZone
  const [ticketlistSelectedTimeFormat, ticketlistsetSelectedTimeFormat] = useState('12hr'); // Updated state variable

  
  const redBackgroundRowStyle = {
    backgroundColor: 'lightcoral',
  };
  const transitionStyle = {
    transition: 'opacity 0.5s ease-in-out',
  };
  function isLastSeenBelow5Minutes(inTime) {
    const currentTime = new Date();
    const inTimeUTC = new Date(new Date(inTime).getTime() + (5 * 60 + 30) * 60 * 1000);
  
    const timeDifferenceInSeconds = Math.floor((currentTime - inTimeUTC) / 1000);
  
    return timeDifferenceInSeconds < 300; // 300 seconds = 5 minutes
  }
  
  function calculateTimeDifference(inTime) {
    const currentTime = new Date();
    const inTimeUTC = new Date(new Date(inTime).getTime() + (5 * 60 + 30) * 60 * 1000);
  
    const timeDifferenceInSeconds = Math.floor((currentTime - inTimeUTC) / 1000);
  
    if (timeDifferenceInSeconds < 60) {
      return `${timeDifferenceInSeconds} secs`;
    } else if (timeDifferenceInSeconds < 3600) {
      const minutes = Math.floor(timeDifferenceInSeconds / 60);
      return `${minutes} mins`;
    } else {
      const hours = Math.floor(timeDifferenceInSeconds / 3600);
      return `${hours} hrs`;
    }
  }
  
  const handleButtonClick = (buttonText) => {
    if (selectedButton !== buttonText) {
      setSelectedButton(buttonText);
      if (buttonText === 'Search Ticket') {
        // Clear the Search Ticket table when the button is selected
        setTickets([]);
      }
      if (buttonText === 'Validator Registered'){
        handleGetDetailsClick()
      }
      
    }
  };
  const cards = [
    { name: "24-device", token: "98:CD:AC:51:4A:BC" },
    { name: "35-device", token: "98:CD:AC:51:4A:E8" },
    { name: "48-device", token: "98:CD:AC:A0:01:48" },
    { name: "49-device", token: "98:CD:AC:A0:01:49" },
    { name: "201-device", token: "04:e9:e5:15:70:91" }
  ];
  const [selectedCardToken, setSelectedCardToken] = useState(cards[0].token); 

    // Function to make the API call for device status
    const fetchDeviceStatusData = () => {
      // Check if the "Validator Status" button is selected
      if (selectedButton === 'Validator Status') {
        setDeviceStatusLoading(true);
  
        // Construct the API URL based on the selected timezone
        const apiUrl = `http://mqtt.zusan.in:8080/device_log_data`;
  
        // Make the API request
        fetch(apiUrl)
          .then((response) => response.json())
          .then((data) => {
            setDeviceStatusData(data);
            setDeviceStatusLoading(false);
            // Log the apiResponse and loading status
            console.log('API Response:', data);
            console.log('Loading Status:', deviceStatusLoading);
            console.log(`User's time zone: ${userTimeZone}`);
          })
          .catch((error) => {
            console.error('Error fetching device status data:', error);
            setDeviceStatusLoading(false);
          });
      }
    };
    const searchDeviceId = () => {
      if (searchedDeviceId) {
        // Make the API request using the entered device ID
        setIsSearchingDeviceId(true);
        fetch(`https://mdot.zed-admin.com/api/GetDeviceConfig/${searchedDeviceId}`)
          .then((response) => response.json())
          .then((data) => {
            setIsSearchingDeviceId(false);
            // Handle the API response, e.g., print it to the console
            console.log(data);
            setSearchDeviceIdResponse(data);
          })
          .catch((error) => {
            console.error('API request error:', error);
            setIsSearchingDeviceId(false);
          });
      }
    };
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
    setTickets([]);

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
    

  const ticketlistFormatTime = (timeString) => {
    // Split the date and time parts
    const [datePart, timePart, timeZone] = timeString.split(' ');
  
    // Parse the date and time parts
    const [year, month, day] = datePart.split('-');
    const [hour, minute, second] = timePart.split(':');
  
    // Create a new Date object with the parsed values
    const date = new Date(year, month - 1, day, hour, minute, second);
  
    // Handle timezone differences
  if (ticketlistSelectedTimeZone === 'EST') {
    // IST is 9 hours and 30 minutes ahead of EST
    date.setHours(date.getHours() - 9);
    date.setMinutes(date.getMinutes() - 30);
  } else if (ticketlistSelectedTimeZone === 'PST') {
    // IST is 12 hours and 30 minutes ahead of PST
    date.setHours(date.getHours() - 12);
    date.setMinutes(date.getMinutes() - 30);
  } else if (ticketlistSelectedTimeZone === 'CST') {
    // IST is 10 hours and 30 minutes ahead of CST
    date.setHours(date.getHours() - 10);
    date.setMinutes(date.getMinutes() - 30);
  } else if (ticketlistSelectedTimeZone === 'MST') {
    // IST is 11 hours and 30 minutes ahead of MST
    date.setHours(date.getHours() - 11);
    date.setMinutes(date.getMinutes() - 30);
  }
  
    // Check if the date has gone to the previous day
    if (date.getDate() !== parseInt(day, 10)) {
      date.setDate(date.getDate() - 1); // Increment the date by one day
    }
  
    // Format the date and time based on the selected time format
    const options = {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour12: ticketlistSelectedTimeFormat === '12hr',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    };
  
    const formattedTime = date.toLocaleString('en-US', options);

  if (ticketlistSelectedTimeFormat === '24hr') {
    return formattedTime + ' hrs';
  }

  return formattedTime;
  };
  
  
  
  

  
  
  

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
    if (selectedButton === 'Validator Status') {
      // When switching back to "Ticket List" button, load data
      fetchDeviceStatusData()
    }
  }, [selectedButton, selectedCardToken]);
  

  return (
    <div className="App">
    <Typography variant="h4" gutterBottom align="center" marginTop="2%">
      Device log panel
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
        <Button
          onClick={() => handleButtonClick('Validator Status')}
          variant={selectedButton === 'Validator Status' ? 'contained' : 'outlined'}
          style={{ fontWeight: selectedButton === 'Validator Status' ? 'bold' : 'normal' }}
        >
          Validator Status
        </Button>
        <Button
          onClick={() => handleButtonClick('Validator Settings')}
          variant={selectedButton === 'Validator Settings' ? 'contained' : 'outlined'}
          style={{ fontWeight: selectedButton === 'Validator Settings' ? 'bold' : 'normal' }}
        >
          Validator Settings
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
          <FormControl variant="outlined" size="small">
          <Select
            labelId="timezone-label"
            value={ticketlistSelectedTimeZone}
            onChange={(e) => {
              ticketlistsetSelectedTimeZone(e.target.value);
              // Handle timezone change here
            }}
            style={{ marginLeft: '10px', width: '100px' }}
          >
            <MenuItem value="IST">IST</MenuItem>
            <MenuItem value="EST">EST</MenuItem>
            <MenuItem value="PST">PST</MenuItem>
            <MenuItem value="CST">CST</MenuItem>
            <MenuItem value="MST">MST</MenuItem>
          </Select>

        </FormControl>
        <RadioGroup
          row
          aria-labelledby="demo-row-radio-buttons-group-label"
          name="row-radio-buttons-group"
          style={{ marginLeft: '30px', width: '190px' }}
          value={ticketlistSelectedTimeFormat}
          onChange={(e) => {
            ticketlistsetSelectedTimeFormat(e.target.value);
          }}
        >
          <FormControlLabel value="12hr" control={<Radio />} label="12 hrs" />
          <FormControlLabel value="24hr" control={<Radio />} label="24 hrs" />
        </RadioGroup>
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
                      <TableCell style={{ fontSize: '1.0em', textAlign: 'center' }}>
                        {ticketlistFormatTime(ticket.now_time)}
                      </TableCell>
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
            <FormControl variant="outlined" size="small">
          <Select
            labelId="timezone-label"
            value={ticketlistSelectedTimeZone}
            onChange={(e) => {
              ticketlistsetSelectedTimeZone(e.target.value);
              // Handle timezone change here
            }}
            style={{ marginLeft: '10px', width: '100px' }}
          >
            <MenuItem value="IST">IST</MenuItem>
            <MenuItem value="EST">EST</MenuItem>
            <MenuItem value="PST">PST</MenuItem>
            <MenuItem value="CST">CST</MenuItem>
            <MenuItem value="MST">MST</MenuItem>
          </Select>

        </FormControl>
        <RadioGroup
          row
          aria-labelledby="demo-row-radio-buttons-group-label"
          name="row-radio-buttons-group"
          style={{ marginLeft: '30px', width: '190px' }}
          value={ticketlistSelectedTimeFormat}
          onChange={(e) => {
            ticketlistsetSelectedTimeFormat(e.target.value);
          }}
        >
          <FormControlLabel value="12hr" control={<Radio />} label="12 hrs" />
          <FormControlLabel value="24hr" control={<Radio />} label="24 hrs" />
        </RadioGroup>
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
                <TableCell style={{ fontWeight: 'bold', fontSize: '1.5em', width: '550px', textAlign: 'center' }}>Device ID</TableCell>
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
                  <TableCell style={{ fontSize: '1.0em', textAlign: 'center' }}>{ticket.device_id}</TableCell>
                  <TableCell style={{ fontSize: '1.0em', textAlign: 'center' }}>
                      {ticketlistFormatTime(ticket.now_time)}
                  </TableCell>
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
<TableContainer style={{ marginTop: '20px', overflow: "auto", justifyContent: 'center', alignItems: 'center' }}>
  <Table>
    <TableHead>
      <TableRow>
        <TableCell style={{ fontWeight: 'bold', fontSize: '1.5em', width: '300px', textAlign: 'center' }}>Macaddress</TableCell>
        <TableCell style={{ fontWeight: 'bold', fontSize: '1.5em', width: '300px', textAlign: 'center' }}>Major</TableCell>
        <TableCell style={{ fontWeight: 'bold', fontSize: '1.5em', width: '300px', textAlign: 'center' }}>Minor</TableCell>
        <TableCell style={{ fontWeight: 'bold', fontSize: '1.5em', width: '700px', textAlign: 'center' }}>Client Names</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {!loading && apiResponse && (
        apiResponse.reduce((uniqueDevices, client) => {
          client.Macaddresslist.forEach(macAddressItem => {
            const existingDevice = uniqueDevices.find(
              device => device.Macaddress === macAddressItem.Macaddress
            );
            if (existingDevice) {
              if (!existingDevice.ClientNames.includes(client.Clientname)) {
                existingDevice.ClientNames.push(client.Clientname);
              }
            } else {
              uniqueDevices.push({
                Macaddress: macAddressItem.Macaddress,
                Major: macAddressItem.Major,
                Minor: macAddressItem.Minor,
                ClientNames: [client.Clientname],
              });
            }
          });
          return uniqueDevices;
        }, []).map(device => (
          <TableRow key={device.Macaddress}>
            <TableCell style={{ fontSize: '1.0em', textAlign: 'center' }}>{device.Macaddress}</TableCell>
            <TableCell style={{ fontSize: '1.0em', textAlign: 'center' }}>{device.Major}</TableCell>
            <TableCell style={{ fontSize: '1.0em', textAlign: 'center' }}>{device.Minor}</TableCell>
            <TableCell style={{ fontSize: '1.0em', textAlign: 'center' }}>{device.ClientNames.join(', ')}</TableCell>
          </TableRow>
        ))
      )}
    </TableBody>
  </Table>
</TableContainer>
  </div>
)}
          </>
        )}
  {selectedButton === 'Validator Status' && (
  <>
    {/* Dropdown for Timezone selection */}
    <Stack direction="row" spacing={2} alignItems="center" justifyContent="center" marginTop="2%">
    <FormControl variant="outlined" size="small" style={{ marginRight: '10px' }}>
      {/* <Select
        value={selectedTimezone}
        onChange={(e) => setSelectedTimezone(e.target.value)}
        style={{ width: '250px' }}
      >
        <MenuItem value="IST">Indian Standard Time</MenuItem>
        <MenuItem value="EST">Eastern Standard Time</MenuItem>
      </Select> */}
    </FormControl>
    {/* Reload button */}
    <Button variant="contained" onClick = {fetchDeviceStatusData}>
      Reload
    </Button>
    </Stack>
    
    {/* Rest of the code related to loading and displaying data */}
      {deviceStatusLoading && (
    <div style={{ marginTop: '20px', textAlign: 'center' }}>
      <CircularProgress style={{ marginTop: '20px' }} />
    </div>
  )}

  {!deviceStatusLoading && deviceStatusData && (
    <div style={{ marginTop: '20px', textAlign: 'center' }}>
      <TableContainer style={{ marginTop: '20px', overflow: 'auto', justifyContent: 'center', alignItems: 'center' }}>
  <Table>
    <TableHead>
      <TableRow>
        <TableCell style={{ fontWeight: 'bold', fontSize: '1.2em', textAlign: 'center' }}>Device ID</TableCell>
        <TableCell style={{ fontWeight: 'bold', fontSize: '1.2em', textAlign: 'center' }}>Device version</TableCell>
        <TableCell style={{ fontWeight: 'bold', fontSize: '1.2em', textAlign: 'center' }}>Ble power</TableCell>
        <TableCell style={{ fontWeight: 'bold', fontSize: '1.2em', textAlign: 'center' }}>Ble minor</TableCell>
        <TableCell style={{ fontWeight: 'bold', fontSize: '1.2em', textAlign: 'center' }}>Last seen(IST)</TableCell>
        <TableCell style={{ fontWeight: 'bold', fontSize: '1.2em', textAlign: 'center' }}>Start time</TableCell>
        <TableCell style={{ fontWeight: 'bold', fontSize: '1.2em', textAlign: 'center' }}>Last in time</TableCell>
        <TableCell style={{ fontWeight: 'bold', fontSize: '1.2em', textAlign: 'center' }}>Running status</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {!deviceStatusLoading &&
        deviceStatusData &&
        deviceStatusData.map((item, index) => {
          // Parse the "Starting Time" and "Last In Time" as Date objects
          const startingTime = new Date(item.StartingTime);
          const lastInTime = new Date(item.timestamp);

          // Calculate the time difference in milliseconds
          const timeDifference = lastInTime - startingTime;

          // Convert milliseconds to hours, minutes, and seconds
          const hours = Math.floor(timeDifference / (60 * 60 * 1000));
          const minutes = Math.floor((timeDifference % (60 * 60 * 1000)) / (60 * 1000));
          const seconds = Math.floor((timeDifference % (60 * 1000)) / 1000);

          return (
            <TableRow key={index}>
              <TableCell style={{ fontSize: '1.0em', textAlign: 'center' }}>{item.deviceId}</TableCell>
              <TableCell style={{ fontSize: '1.0em', textAlign: 'center' }}>{item.firmwareVersion}</TableCell>
              <TableCell style={{ fontSize: '1.0em', textAlign: 'center' }}>{item.bleTxpower}</TableCell>
              <TableCell style={{ fontSize: '1.0em', textAlign: 'center' }}>{item.bleMinor}</TableCell>
              <TableCell style={{ fontSize: '1.0em', textAlign: 'center', color: isLastSeenBelow5Minutes(item.timestamp) ? 'green' : 'inherit', fontWeight: isLastSeenBelow5Minutes(item.timestamp) ? 'bold' : 'normal' }}>
                {calculateTimeDifference(item.timestamp)} ago
              </TableCell>
              <TableCell style={{ fontSize: '1.0em', textAlign: 'center' }}>
                {new Date(startingTime.getTime() + (5 * 60 + 30) * 60 * 1000).toLocaleString('en-US', {
                  year: 'numeric',
                  month: 'numeric',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: 'numeric',
                  second: 'numeric',
                  hour12: true,
                })}
              </TableCell>
              <TableCell style={{ fontSize: '1.0em', textAlign: 'center' }}>
                {new Date(lastInTime.getTime() + (5 * 60 + 30) * 60 * 1000).toLocaleString('en-US', {
                  year: 'numeric',
                  month: 'numeric',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: 'numeric',
                  second: 'numeric',
                  hour12: true,
                })}
              </TableCell>
              <TableCell style={{ fontSize: '1.0em', textAlign: 'center', color: 'inherit', fontWeight: 'normal' }}>
              {isNaN(hours) || isNaN(minutes) || isNaN(seconds) || (hours === 0 && minutes === 0 && seconds === 0)
              ? 'N/A'
              : `${hours}h ${minutes}m ${seconds}s`}
              </TableCell>
            </TableRow>
          );
        })}
    </TableBody>
  </Table>
</TableContainer>
    </div>
  )}
  </>
)}{selectedButton === 'Validator Settings' && (
  <>
    {/* Dropdown for Timezone selection */}
    <Stack direction="row" spacing={2} alignItems="center" justifyContent="center" marginTop="2%">
            <TextField
              label="Device ID"
              variant="outlined"
              size="small"
              style={{ width: '200px' }}
              value={searchedDeviceId}
              onChange={(e) => setSearchedDeviceId(e.target.value)}
            />
            <Button variant="contained" onClick={searchDeviceId}>
              <SearchIcon />
            </Button>
          </Stack>
          {isSearchingDeviceId ? (
            <div style={{ marginTop: '20px', textAlign: 'center' }}>
              <CircularProgress style={{ marginTop: '20px' }} />
            </div>
          ) : searchDeviceIdResponse && searchDeviceIdResponse.message === "Not device found" ? (
            <Alert severity="info">
              <AlertTitle>Info</AlertTitle>
              No data found for this device. Check your device id or it might be a new device.
            </Alert>
          ) : searchDeviceIdResponse && (
            <div style={{ textAlign: 'center', fontWeight: 'bold', color: 'blue' }}>
            BLE Configurations
          </div>
          )}
  </>
)}
        
  </div>
  );
}

export default App;