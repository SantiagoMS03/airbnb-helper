// services/textProcessingService.js
function formatDate(dateStr) {
  const dateParts = dateStr.split(' ');
  const monthNames = {
    Jan: '01', Feb: '02', Mar: '03', Apr: '04', May: '05', Jun: '06',
    Jul: '07', Aug: '08', Sep: '09', Oct: '10', Nov: '11', Dec: '12'
  };
  return `${monthNames[dateParts[0]]}/${dateParts[1].replace(',', '')}/${dateParts[2]}`;
}

function parseTextContent(text) {
  const lines = text.split('\n');
  let chunks = [];
  let currentChunk = [];
  const startIndicators = ['Currently hosting', 'Confirmed'];

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

  return chunks.map(chunk => {
    const chunkLines = chunk.split('\n').filter(line => line.trim() !== '');
    if (chunkLines.length > 2) {
      const numbers = chunkLines[2].match(/\d+/g);
      const guest_number = numbers.reduce((acc, num) => acc + parseInt(num), 0);
      const dates = chunkLines[3].split('\t');
      const formattedDates = dates.slice(0, 2).map(date => formatDate(date.trim()));
      const numberAfterHash = chunkLines[chunkLines.length - 2].match(/#(\d+)/)[1];
      const confirmationCode = chunkLines[chunkLines.length - 2].split('\t')[1];

      return {
        guest_number,
        formattedDates,
        numberAfterHash,
        confirmationCode
      };
    }
  }).filter(result => result !== undefined);
}

function generateInsertQuery(parsedData) {
  const values = parsedData.map(({ guest_number, formattedDates, numberAfterHash, confirmationCode }) => {
    const [startDate, endDate] = formattedDates;
    return `('${startDate}', '${endDate}', ${guest_number}, '${numberAfterHash}', '${confirmationCode}')`;
  }).join(', ');

  const query = `
    INSERT INTO bookings (start_date, end_date, guest_number, booking_number, confirmation_code)
    VALUES ${values}
    RETURNING *;
  `;

  return query;
}

module.exports = {
  parseTextContent,
  generateInsertQuery
};
