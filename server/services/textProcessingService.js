const pool = require("../db"); // Assuming you are using a connection pool from pg

// services/textProcessingService.js
function formatDate(dateStr) {
  const dateParts = dateStr.split(" ");
  const monthNames = {
    Jan: "01",
    Feb: "02",
    Mar: "03",
    Apr: "04",
    May: "05",
    Jun: "06",
    Jul: "07",
    Aug: "08",
    Sep: "09",
    Oct: "10",
    Nov: "11",
    Dec: "12",
  };
  return `${monthNames[dateParts[0]]}-${dateParts[1].replace(",", "")}-${
    dateParts[2]
  }`;
}

// const parseTextContent = async function(text) {
const parseTextContent = async function (text, alt) {
  const lines = text.split("\n");
  let chunks = [];
  let currentChunk = [];
  let bookings = [];
  let parsedBookings = [];
  const startIndicators = ["Currently hosting", "Confirmed"];

  // Trimming
  for (let line of lines) {
    let trimmedLine = line.trim();
    if (
      startIndicators.some((indicator) => trimmedLine.startsWith(indicator))
    ) {
      if (currentChunk.length > 0) {
        chunks.push(currentChunk.join("\n"));
      }
      currentChunk = [trimmedLine];
    } else {
      currentChunk.push(trimmedLine);
    }

    if (line === "") {
      if (currentChunk.length > 0) {
        chunks.push(currentChunk.join("\n"));
        currentChunk = [];
      }
    }
  }

  if (currentChunk.length > 0) {
    chunks.push(currentChunk.join("\n"));
  }

  for (let i = 0; i < chunks.length; i++) {
    if (isBooking(chunks[i])) bookings.push(chunks[i]);
  }

  bookings = bookings.splice(1, bookings.length - 2);

  for (let i = 0; i < bookings.length; i++) {
    // parsedBookings.push(await parseBookingString(bookings[i]));
    alt.push(await parseBookingString(bookings[i]));
  }
  // return parsedBookings;
};

function isBooking(booking) {
  newLines = 0;
  for (let i = 0; i < booking.length; i++) {
    if (booking.charAt(i) == "\n") newLines++;
  }
  return newLines == 7;
}

const getPropertyIdByPropertyNumber = async (propertyNumber) => {
  console.log("here!");
  try {
    const properties = await pool.query("SELECT * FROM Property");
    for (let i = 0; i < properties.rows.length; i++) {
      let property = properties.rows[i];
      // console.log(property)
      if (property.address.includes(propertyNumber)) {
        console.log("property number " + propertyNumber + ".");
        return property.property_id;
      }
    }
    console.log("id not found in " + property.address);
  } catch (err) {
    console.error(err.message);
  }
};

function generateInsertQuery(parsedData) {
  const values = parsedData
    .map(
      ({
        start_date,
        end_date,
        guest_number,
        property_id,
        confirmation_code,
      }) => {
        return `('${start_date}', '${end_date}', ${guest_number}, '${property_id}', '${confirmation_code}')`;
      }
    )
    .join(", ");

  const query = `
    INSERT INTO temp_bookings (start_date, end_date, guest_number, property_id, confirmation_code)
    VALUES ${values}
    RETURNING *;
    DELETE FROM temp_bookings
    USING temp_bookings t2
    WHERE temp_bookings.ctid < t2.ctid
    AND temp_bookings.confirmation_code = t2.confirmation_code;
  `;
  return query;
}

function parsePropertyNumber(propertyStrs) {
  let res = "";
  // console.log("propertystrs is " + propertyStrs);
  // for (let subStr in propertyStrs) {
  for (let i = 0; i < propertyStrs.length; i++) {
    let subStr = propertyStrs[i];
    console.log("substr" + subStr);
    console.log(subStr.includes("#"));
    if (subStr.includes("#940") || subStr.includes("#LB940")) res = "940";
    else if (subStr.includes("#"))
      res = subStr.replace("#", "").replace(/[a-zA-Z]/g, "");
    else if (subStr.includes("2613")) res = "2613";
    else if (subStr.includes("409")) res = "409";
  }
  console.log("\n\n\n" + res + "\n" + propertyStrs);
  return res;
}

const parseBookingString = async function (bookingString) {
  const lines = bookingString.split("\n");

  const guestInfo = lines[2].split(" ");
  const adults = parseInt(guestInfo[0]);
  let children = parseInt(guestInfo[1].replace("adults", ""));
  if (!children) children = 0;
  const guest_number = adults + children;

  const dates = lines[3].split("\t");
  const start_date = formatDate(dates[0]);
  const end_date = formatDate(dates[1]);

  const confirmation_code = lines[5].split("\t")[1];

  const property_number = parsePropertyNumber(lines[5].split(" "));

  const property_id = await getPropertyIdByPropertyNumber(property_number);

  return {
    property_id,
    guest_number,
    start_date,
    end_date,
    confirmation_code,
  };
};

module.exports = {
  parseTextContent,
  generateInsertQuery,
};
