const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Service = require('../models/Service');
const Booking = require('../models/Booking');
const Review = require('../models/Review'); // Assuming this exists for avgRating
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

console.log('JWT_SECRET in auth.js:', process.env.JWT_SECRET); // Debug log

const JWT_SECRET = process.env.JWT_SECRET;

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user;
    next();
  });
};

// Signup
router.post('/signup', async (req, res) => {
  const { name, email, password, userType, shopName, location, contact, operatingHours, photos, certifications } = req.body;
  try {
    if (!name || !email || !password || !userType) {
      return res.status(400).json({ status: 'FAILED', message: 'Missing required fields' });
    }
    if (userType === 'mechanic' && (!shopName || !location || !contact)) {
      return res.status(400).json({ status: 'FAILED', message: 'Missing mechanic shop details' });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ status: 'FAILED', message: 'Email already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name, 
      email, 
      password: hashedPassword, 
      userType,
      ...(userType === 'mechanic' && { 
        shopName, 
        location, 
        contact, 
        operatingHours, 
        photos: photos || [], 
        certifications: certifications || [] 
      })
    });
    await newUser.save();
    res.status(201).json({ status: 'SUCCESS', message: 'Signup successful. Please sign in.' });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ status: 'FAILED', message: 'Server error' });
  }
});

// Signin
router.post('/signin', async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({ status: 'FAILED', message: 'Missing credentials' });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ status: 'FAILED', message: 'Invalid email or password' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ status: 'FAILED', message: 'Invalid email or password' });
    }
    const token = jwt.sign({ id: user._id, userType: user.userType }, JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({
      status: 'SUCCESS', 
      message: 'Signin successful', 
      token,
      data: { id: user._id, name: user.name, email: user.email, userType: user.userType }
    });
  } catch (error) {
    console.error('Signin error:', error);
    res.status(500).json({ status: 'FAILED', message: 'Server error' });
  }
});

// Get Shop Profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ status: 'FAILED', message: 'User not found' });
    res.status(200).json({ status: 'SUCCESS', data: user });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ status: 'FAILED', message: 'Server error' });
  }
});

// Add Service
router.post('/services', authenticateToken, async (req, res) => {
  const { name, description, image, type, price, offerPrice, duration } = req.body;
  try {
    if (req.user.userType !== 'mechanic') {
      return res.status(403).json({ status: 'FAILED', message: 'Only mechanics can add services' });
    }
    if (!name || !description || !image || !type || !price || !duration) {
      return res.status(400).json({ status: 'FAILED', message: 'Missing required fields' });
    }
    const service = new Service({
      shopId: req.user.id,
      name,
      description,
      image,
      type,
      price: parseFloat(price),
      offerPrice: offerPrice ? parseFloat(offerPrice) : parseFloat(price) * 0.5,
      duration
    });
    await service.save();
    res.status(201).json({ status: 'SUCCESS', message: 'Service added successfully', data: service });
  } catch (error) {
    console.error('Services error:', error);
    res.status(500).json({ status: 'FAILED', message: 'Server error' });
  }
});

// Update Service
router.put('/services/:id', authenticateToken, async (req, res) => {
  const { name, description, image, type, price, offerPrice, duration } = req.body;
  try {
    if (req.user.userType !== 'mechanic') {
      return res.status(403).json({ status: 'FAILED', message: 'Only mechanics can modify services' });
    }
    const service = await Service.findOne({ _id: req.params.id, shopId: req.user.id });
    if (!service) {
      return res.status(404).json({ status: 'FAILED', message: 'Service not found or not owned by you' });
    }

    if (!name || !description || !image || !type || !price || !duration) {
      return res.status(400).json({ 
        status: 'FAILED', 
        message: 'All fields (name, description, image, type, price, duration) are required' 
      });
    }

    service.name = name;
    service.description = description;
    service.image = image;
    service.type = type;
    service.price = parseFloat(price);
    service.offerPrice = offerPrice ? parseFloat(offerPrice) : parseFloat(price) * 0.5;
    service.duration = duration;

    await service.save();
    res.status(200).json({ status: 'SUCCESS', message: 'Service updated successfully', data: service });
  } catch (error) {
    console.error('Update service error:', error);
    res.status(500).json({ status: 'FAILED', message: 'Server error' });
  }
});

// Delete Service
router.delete('/services/:id', authenticateToken, async (req, res) => {
  try {
    if (req.user.userType !== 'mechanic') {
      return res.status(403).json({ status: 'FAILED', message: 'Only mechanics can delete services' });
    }
    const service = await Service.findOneAndDelete({ _id: req.params.id, shopId: req.user.id });
    if (!service) {
      return res.status(404).json({ status: 'FAILED', message: 'Service not found or not owned by you' });
    }
    res.status(200).json({ status: 'SUCCESS', message: 'Service deleted successfully' });
  } catch (error) {
    console.error('Delete service error:', error);
    res.status(500).json({ status: 'FAILED', message: 'Server error' });
  }
});

// Get Services for Shop
router.get('/services', authenticateToken, async (req, res) => {
  try {
    if (req.user.userType !== 'mechanic') {
      return res.status(403).json({ status: 'FAILED', message: 'Only mechanics can view their services' });
    }
    const services = await Service.find({ shopId: req.user.id });
    res.status(200).json({ status: 'SUCCESS', data: services });
  } catch (error) {
    console.error('Services fetch error:', error);
    res.status(500).json({ status: 'FAILED', message: 'Server error' });
  }
});

// Get Bookings for Shop
router.get('/bookings', authenticateToken, async (req, res) => {
  try {
    if (req.user.userType !== 'mechanic') {
      return res.status(403).json({ status: 'FAILED', message: 'Only mechanics can view bookings' });
    }
    const bookings = await Booking.find({ shopId: req.user.id })
      .populate('serviceId', 'name')
      .populate('userId', 'name');
    res.status(200).json({ status: 'SUCCESS', data: bookings });
  } catch (error) {
    console.error('Bookings error:', error);
    res.status(500).json({ status: 'FAILED', message: 'Server error' });
  }
});

// Get All Shops with Location Filter
router.get('/shops', authenticateToken, async (req, res) => {
  const { location } = req.query;
  try {
    if (req.user.userType !== 'user') {
      return res.status(403).json({ status: 'FAILED', message: 'Only users can view shops' });
    }
    let query = { userType: 'mechanic' };
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }
    const shops = await User.find(query).select('name shopName location contact operatingHours photos certifications');
    const shopIds = shops.map(shop => shop._id);
    const services = await Service.find({ shopId: { $in: shopIds } });
    const reviews = await Review.find({ shopId: { $in: shopIds } });

    const shopsWithServices = shops
      .map(shop => {
        const shopServices = services.filter(service => service.shopId.toString() === shop._id.toString());
        if (shopServices.length === 0) return null;
        const shopReviews = reviews.filter(review => review.shopId.toString() === shop._id.toString());
        const avgRating = shopReviews.length > 0 
          ? shopReviews.reduce((sum, review) => sum + review.rating, 0) / shopReviews.length 
          : 0;
        return {
          id: shop._id,
          name: shop.name,
          shopName: shop.shopName,
          location: shop.location,
          contact: shop.contact,
          operatingHours: shop.operatingHours,
          photos: shop.photos,
          certifications: shop.certifications,
          services: shopServices,
          avgRating
        };
      })
      .filter(shop => shop !== null);
    res.status(200).json({ status: 'SUCCESS', data: shopsWithServices });
  } catch (error) {
    console.error('Shops error:', error);
    res.status(500).json({ status: 'FAILED', message: 'Server error' });
  }
});

// Get Shops by Service
router.get('/shops-by-service/:serviceId', authenticateToken, async (req, res) => {
  try {
    if (req.user.userType !== 'user') {
      return res.status(403).json({ status: 'FAILED', message: 'Only users can view shops' });
    }
    const services = await Service.find({ _id: req.params.serviceId });
    if (!services.length) {
      return res.status(404).json({ status: 'FAILED', message: 'Service not found' });
    }
    const shopIds = services.map(service => service.shopId);
    const shops = await User.find({ _id: { $in: shopIds }, userType: 'mechanic' })
      .select('name shopName location contact operatingHours photos certifications');
    const allServices = await Service.find({ shopId: { $in: shopIds } });
    const reviews = await Review.find({ shopId: { $in: shopIds } });

    const shopsWithServices = shops
      .map(shop => {
        const shopServices = allServices.filter(service => service.shopId.toString() === shop._id.toString());
        if (shopServices.length === 0) return null;
        const shopReviews = reviews.filter(review => review.shopId.toString() === shop._id.toString());
        const avgRating = shopReviews.length > 0 
          ? shopReviews.reduce((sum, review) => sum + review.rating, 0) / shopReviews.length 
          : 0;
        return {
          id: shop._id,
          name: shop.name,
          shopName: shop.shopName,
          location: shop.location,
          contact: shop.contact,
          operatingHours: shop.operatingHours,
          photos: shop.photos,
          certifications: shop.certifications,
          services: shopServices,
          avgRating
        };
      })
      .filter(shop => shop !== null);
    res.status(200).json({ status: 'SUCCESS', data: shopsWithServices });
  } catch (error) {
    console.error('Shops by service error:', error);
    res.status(500).json({ status: 'FAILED', message: 'Server error' });
  }
});

// Book a Service with Email Notification and Payment
router.post('/book-service', authenticateToken, async (req, res) => {
  const { serviceId, userLocation, vehicleModel, paymentMethod } = req.body; 
  try {
    if (req.user.userType !== 'user') {
      return res.status(403).json({ status: 'FAILED', message: 'Only users can book services' });
    }
    if (!serviceId || !userLocation || !vehicleModel || !paymentMethod) {
      return res.status(400).json({ status: 'FAILED', message: 'Missing required fields' });
    }
    if (!['Card', 'UPI', 'Cash'].includes(paymentMethod)) {
      return res.status(400).json({ status: 'FAILED', message: 'Invalid payment method' });
    }
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ status: 'FAILED', message: 'Service not found' });
    }

    const user = await User.findById(req.user.id);
    const shop = await User.findById(service.shopId);

    let paymentIntent;
    if (paymentMethod === 'Card') {
      paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(service.offerPrice * 100),
        currency: 'inr',
        description: `Booking for ${service.name} at ${shop.shopName}`,
        metadata: { userId: req.user.id, serviceId }
      });
    }

    const booking = new Booking({
      userId: req.user.id,
      serviceId,
      shopId: service.shopId,
      userLocation,
      vehicleModel,
      paymentMethod,
      paymentIntentId: paymentMethod === 'Card' ? paymentIntent.id : null
    });
    await booking.save();

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Service Booking Confirmation - AutoMob-Mechanic',
      text: `Dear ${user.name},\n\nYou have successfully booked "${service.name}" from ${shop.shopName}.\n\nDetails:\n- Shop Location: ${shop.location}\n- Your Location: ${userLocation}\n- Vehicle Model: ${vehicleModel}\n- Payment Method: ${paymentMethod}\n- Booked on: ${new Date().toLocaleString()}\n\n${
        paymentMethod === 'Card' ? 'Payment of ₹' + service.offerPrice + ' is pending.' : 'Please complete the payment at the shop.'
      }\n\nThank you for choosing AutoMob-Mechanic!`
    };
    await transporter.sendMail(mailOptions);

    if (paymentMethod === 'Card') {
      res.status(201).json({ 
        status: 'SUCCESS', 
        message: 'Service booked successfully. Complete payment to confirm.', 
        clientSecret: paymentIntent.client_secret 
      });
    } else {
      res.status(201).json({ 
        status: 'SUCCESS', 
        message: `Service booked successfully with ${paymentMethod} payment.` 
      });
    }
  } catch (error) {
    console.error('Booking error:', error);
    res.status(500).json({ status: 'FAILED', message: 'Server error' });
  }
});

// Get User Bookings
router.get('/user-bookings', authenticateToken, async (req, res) => {
  try {
    if (req.user.userType !== 'user') {
      return res.status(403).json({ status: 'FAILED', message: 'Only users can view their bookings' });
    }
    const bookings = await Booking.find({ userId: req.user.id })
      .populate('serviceId', 'name')
      .populate('shopId', 'shopName');
    res.status(200).json({ status: 'SUCCESS', data: bookings });
  } catch (error) {
    console.error('User bookings error:', error);
    res.status(500).json({ status: 'FAILED', message: 'Server error' });
  }
});
// Add this after '/book-service' endpoint
router.post('/reviews', authenticateToken, async (req, res) => {
  const { shopId, rating, comment } = req.body;
  try {
    if (req.user.userType !== 'user') {
      return res.status(403).json({ status: 'FAILED', message: 'Only users can submit reviews' });
    }
    if (!shopId || !rating || rating < 1 || rating > 5) {
      return res.status(400).json({ status: 'FAILED', message: 'Missing or invalid fields (shopId and rating 1-5 required)' });
    }
    const review = new Review({
      userId: req.user.id,
      shopId,
      rating,
      comment: comment || ""
    });
    await review.save();
    res.status(201).json({ status: 'SUCCESS', message: 'Review submitted successfully', data: review });
  } catch (error) {
    console.error('Review submission error:', error);
    res.status(500).json({ status: 'FAILED', message: 'Server error' });
  }
});

module.exports = router;