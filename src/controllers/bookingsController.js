const db = require('../config/db');

const createBooking = (req,res) => {
    const {
    customer_name,
    customer_phone, 
    sport_type,
    booking_date, 
    start_time,
    end_time, 
    payment_status,
    booking_status,
    notes,
    price,
    user_id, 
    } = req.body;

    if(
        !customer_name || 
        !customer_phone || 
        !sport_type || 
        !booking_date || 
        !start_time || 
        !end_time || 
        !price || 
        !user_id
    ){
        return res.status(400).json({
            success: false,
            message: 'ALL fields are required',
        });
    }
    const insertBookingQuery =
    'INSERT INTO bookings (customer_name, customer_phone, sport_type, booking_date, start_time, end_time, price, payment_status, booking_status, notes, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';

    db.query(insertBookingQuery,
        [
        customer_name, 
        customer_phone, 
        sport_type, 
        booking_date, 
        start_time, 
        end_time, 
        price, 
        payment_status || 'unpaid', 
        booking_status || 'confirmed', 
        notes || null,
        user_id, 
        ],
        (err, results) => {
            if(err){
                console.error('Error inserting booking:', err);
                return res.status(500).json({
                    success: false,
                    message: 'Database error',
                });
            }
            return res.status(201).json({
                success: true,
                message: 'Booking created successfully',
                booking: {
                    id: results.insertId,
                    customer_name,
                    customer_phone,
                    sport_type,
                    booking_date,
                    start_time,
                    end_time,
                    price,
                    payment_status: payment_status || 'unpaid',
                    booking_status: booking_status || 'confirmed',
                    notes: notes || null ,
                    user_id,
                },
            });
        }
    );
};

const getBookings = (req, res) => {
  const getBookingsQuery = 'SELECT * FROM bookings';

  db.query(getBookingsQuery, (err, results) => {
    if (err) {
      console.error('Error fetching bookings:', err);
      return res.status(500).json({
        success: false,
        message: 'Database error',
      });
    }

    return res.status(200).json({
      success: true,
      count: results.length,
      bookings: results,
    });
  });
};

const getBookingById = (req, res) => {
    const bookingId = req.params.booking_id;
    const getBookingQuery = 'SELECT * FROM bookings WHERE booking_id = ?';
    db.query(getBookingQuery , [bookingId], (err, results) => {
        if(err){
            console.error('Error fetching booking:', err);
            return res.status(500).json({
                success: false,
                message: 'Database error',
            });
        };
        if(results.length === 0){
            return res.status(404).json({
                success: false,
                message: 'Booking not found',
            });
        };
        return res.status(200).json({
            success: true,
            booking: results[0],
        });
    });

};

const updateBooking = (req, res) => {
  const bookingId = req.params.booking_id;

  const {
    customer_name,
    customer_phone,
    sport_type,
    booking_date,
    start_time,
    end_time,
    price,
    payment_status,
    booking_status,
    notes,
    user_id,
  } = req.body;

  if (
    !customer_name ||
    !customer_phone ||
    !sport_type ||
    !booking_date ||
    !start_time ||
    !end_time ||
    !price ||
    !user_id
  ) {
    return res.status(400).json({
      success: false,
      message: 'All required fields are required',
    });
  }

  const updatedBookingQuery =
    'UPDATE bookings SET customer_name = ?, customer_phone = ?, sport_type = ?, booking_date = ?, start_time = ?, end_time = ?, price = ?, payment_status = ?, booking_status = ?, notes = ?, user_id = ? WHERE booking_id = ?';

  db.query(
    updatedBookingQuery,
    [
      customer_name,
      customer_phone,
      sport_type,
      booking_date,
      start_time,
      end_time,
      price,
      payment_status || 'unpaid',
      booking_status || 'confirmed',
      notes || null,
      user_id,
      bookingId,
    ],
    (err, results) => {
      if (err) {
        console.error('Error updating booking:', err);
        return res.status(500).json({
          success: false,
          message: 'Database error',
        });
      }

      if (results.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: 'Booking not found',
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Booking updated successfully',
      });
    }
  );
};

const deleteBooking = (req, res) => {
    const bookingId = req.params.booking_id;
    const deleteBookingQuery = 'DELETE FROM bookings WHERE booking_id = ?';
    db.query(deleteBookingQuery, [bookingId], (err, results) => {
        if(err){
            console.error('Error deleting booking:', err);
            return res.status(500).json({
                success: false,
                message: 'Database error',
            });
        };
        if(results.affectedRows === 0){
            return res.status(404).json({
                success: false,
                message: 'Booking not found',
            });
        };
        return res.status(200).json({
            success: true,
            message: 'Booking deleted successfully',
        });
    });
};

module.exports = {
    createBooking,
    getBookings,
    getBookingById,
    updateBooking,
    deleteBooking,
};