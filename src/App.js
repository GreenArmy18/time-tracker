import React, { useState } from 'react';
import { Box, Button, Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography, MenuItem } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    fontFamily: 'Assistant',
  },
});

function App() {
  const [times, setTimes] = useState([
    { day: 'ראשון', entry: '', exit: '' },
    { day: 'שני', entry: '', exit: '' },
    { day: 'שלישי', entry: '', exit: '' },
    { day: 'רביעי', entry: '', exit: '' },
    { day: 'חמישי', entry: '', exit: '' },
    { day: 'שישי', entry: '', exit: '' },
  ]);
  const [result, setResult] = useState('');
  const [selectedHours, setSelectedHours] = useState(20);

  const handleTimeChange = (index, field, value) => {
    setTimes((prevTimes) => {
      const updatedTimes = [...prevTimes];
      updatedTimes[index][field] = value;
      return updatedTimes;
    });
  };

  const calculateTotalTime = () => {
    let totalMinutes = 0;
    let missingData = false;

    times.forEach(({ entry, exit }) => {
      const entryTime = getTimeInMinutes(entry);
      const exitTime = getTimeInMinutes(exit);

      if (isNaN(entryTime) || isNaN(exitTime)) {
        missingData = true;
        return;
      }

      const timeDiff = exitTime - entryTime;
      totalMinutes += timeDiff;
    });

    if (missingData) {
      setResult('נא למלא את כל הנתונים');
    } else {
      const selectedTime = selectedHours * 60;
      const difference = selectedTime - totalMinutes;
      setResult(`זמן כולל: ${getFormattedTime(totalMinutes)}. ההפרש הוא: ${getFormattedTime(difference)}`);
    }
  };

  const getTimeInMinutes = (timeString) => {
    const [hours, minutes] = timeString.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const getFormattedTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours} שעות ${mins} דקות`;
  };

  return (
    <ThemeProvider theme={theme}>
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      dir="rtl"
      textAlign="right"
    >
      <Container maxWidth="md">
      <Typography variant="h4" align="center" gutterBottom>
        <Box fontFamily="Assistant" fontWeight="bold">
          חישוב זמן כולל
        </Box>
      </Typography>

        <Box mt={2} textAlign="center">
          <Typography variant="body1">בחרי מספר שעות לפני הכניסה הראשונה:</Typography>
          <TextField
            select
            value={selectedHours}
            onChange={(e) => setSelectedHours(Number(e.target.value))}
            variant="outlined"
            style={{ width: '200px' }}
          >
            {Array.from({ length: 11 }, (_, i) => i + 20).map((value) => (
              <MenuItem key={value} value={value}>
                {value}
              </MenuItem>
            ))}
          </TextField>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>יום</TableCell>
                <TableCell>זמן כניסה</TableCell>
                <TableCell>זמן יציאה</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {times.map(({ day, entry, exit }, index) => (
                <TableRow key={index}>
                  <TableCell>{day}</TableCell>
                  <TableCell>
                    <TextField
                      type="time"
                      value={entry}
                      onChange={(e) => handleTimeChange(index, 'entry', e.target.value)}
                      fullWidth
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      type="time"
                      value={exit}
                      onChange={(e) => handleTimeChange(index, 'exit', e.target.value)}
                      fullWidth
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Box mt={3} textAlign="center">
          <Button variant="contained" onClick={calculateTotalTime}>
            חשב זמן כולל
          </Button>
        </Box>

        <Box mt={2} textAlign="center">
          <Typography variant="h6">{result}</Typography>
        </Box>
      </Container>
    </Box>
  </ThemeProvider>
  );
}

export default App