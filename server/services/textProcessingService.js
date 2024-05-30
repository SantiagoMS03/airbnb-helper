const pool = require('../db'); // Assuming you are using a connection pool from pg

// services/textProcessingService.js
function formatDate(dateStr) {
  const dateParts = dateStr.split(' ');
  const monthNames = {
    Jan: '01', Feb: '02', Mar: '03', Apr: '04', May: '05', Jun: '06',
    Jul: '07', Aug: '08', Sep: '09', Oct: '10', Nov: '11', Dec: '12'
  };
  return `${monthNames[dateParts[0]]}-${dateParts[1].replace(',', '')}-${dateParts[2]}`;
}

const parseTextContent = async function(text) {
  const lines = text.split('\n');
  let chunks = [];
  let currentChunk = [];
  let bookings = [];
  let parsedBookings = [];
  const startIndicators = ['Currently hosting', 'Confirmed'];

  // Trimming
  for (let line of lines) {
    let trimmedLine = line.trim();
    if (startIndicators.some(indicator => trimmedLine.startsWith(indicator))) {
      if (currentChunk.length > 0) {
        chunks.push(currentChunk.join('\n'));
      }
      currentChunk = [trimmedLine];
    } else {
      currentChunk.push(trimmedLine);
    }

    if (line === '') {
      if (currentChunk.length > 0) {
        chunks.push(currentChunk.join('\n'));
        currentChunk = [];
      }
    }
  }

  if (currentChunk.length > 0) {
    chunks.push(currentChunk.join('\n'));
  }

  for (let i = 0; i < chunks.length; i++) {
    if (isBooking(chunks[i])) bookings.push(chunks[i]);
  }

  bookings = bookings.splice(1,bookings.length-2);

  for (let i = 0; i < bookings.length; i++) {
    parsedBookings.push(await parseBookingString(bookings[i]));
  }

  return parsedBookings;
}

function isBooking(booking) {
  newLines = 0
  for (let i = 0; i < booking.length; i++) {
    if (booking.charAt(i) == '\n') newLines++;
  } 
  return (newLines == 7)
}

const getPropertyIdByPropertyNumber = async(propertyNumber) => {
  try {
    const properties = await pool.query('SELECT * FROM Property');
    for (let property of properties.rows) {
      if (property.address.includes(propertyNumber)) {
        return property.property_id;
      }
    }
  } catch (err) {
    console.error(err.message);
  }
}

function generateInsertQuery(parsedData) {
  const values = parsedData.map(({ start_date, end_date, guest_number, property_id, confirmation_code }) => {
    return `('${start_date}', '${end_date}', ${guest_number}, '${property_id}', '${confirmation_code}')`;
  }).join(', ');

  const query = `
    INSERT INTO Booking (start_date, end_date, guest_number, property_id, confirmation_code)
    VALUES ${values}
    RETURNING *;
  `;

  return query;
}

function parsePropertyNumber(propertyStrs) {
  for (let subStr in propertyStrs) {
    if (subStr.includes('#')) return subStr.replace('#', '').replace(/[a-zA-Z]/g, '')
  }
  return '';
}

const parseBookingString = async function (bookingString) {
  const lines = bookingString.split('\n');

  const guestInfo = lines[2].split(' ');
  const adults = parseInt(guestInfo[0]);
  let children = parseInt(guestInfo[1].replace('adults', ''));
  if (!children) children = 0;
  const guest_number = adults + children;

  const dates = lines[3].split('\t');
  const start_date = formatDate(dates[0]);
  const end_date = formatDate(dates[1]);

  const confirmation_code = lines[5].split('\t')[1];

  const property_number = parsePropertyNumber(lines[5].split(' '));

  const property_id = await getPropertyIdByPropertyNumber(property_number);

  return {
    property_id,
    guest_number,
    start_date,
    end_date,
    confirmation_code
  };
}

module.exports = {
  parseTextContent,
  generateInsertQuery
};
