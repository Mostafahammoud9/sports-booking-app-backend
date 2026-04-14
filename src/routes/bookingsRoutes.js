const router = require('express').Router();

const {
  createBooking,
  getBookings,
  getBookingById,
  updateBooking,
  deleteBooking,
} = require('../controllers/bookingsController');

router.post('/', createBooking);
router.get('/', getBookings);
router.get('/:booking_id', getBookingById);
router.put('/:booking_id', updateBooking);
router.delete('/:booking_id', deleteBooking);

module.exports = router;
