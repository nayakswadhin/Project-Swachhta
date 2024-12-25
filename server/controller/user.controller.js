import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import {PostOffice} from "../models/postOffice.model.js";
import {Area} from "../models/area.model.js";
import {DivisionalOffice} from "../models/DivisionalOffice.js";
import axios from 'axios';
import { fetchGeolocation } from "../utils/geolocation.js";
import { getClientIp, isValidIp } from "../utils/ip.js";


const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user._id,
      email: user.email,
      role: 'user'
    }, 
    `jwt-secret`, 
    { expiresIn: '1d' }
  );
};



// Rest of your existing code remains the same until the signin function

export const signin = async (req, res) => {
  try {
    const { id, password } = req.body;

    if (!id || !password) {
      return res.status(401).json({ 
        message: "Please provide all the fields", 
        success: false 
      });
    }

    const existingUser = await User.findOne({ id: id });

    if (!existingUser) {
      return res.status(401).json({
        message: "User not found",
        success: false
      });
    }

    if (password !== existingUser.password) {
      return res.status(401).json({
        message: "Incorrect password",
        success: false
      });
    }

    // Generate token
    const token = generateToken(existingUser);

    // Get client IP with enhanced detection
    const userIP = getClientIp(req);
    
    // Only attempt geolocation if we have a valid IP
    const geoLocation = isValidIp(userIP) ? 
      await fetchGeolocation(userIP) : 
      { latitude: "0", longitude: "0" };

    console.log('User IP:', userIP);
    console.log('Geolocation:', geoLocation);

    // Update user's location in database
    await User.findByIdAndUpdate(existingUser._id, {
      latitude: geoLocation.latitude,
      longitude: geoLocation.longitude
    });

    // Prepare response data matching the User model structure
    const userData = {
      email: existingUser.email || "",
      area: existingUser.area || "",
      postOffice: existingUser.postOffice || "",
      phoneno: existingUser.phoneno || 0,
      userId: existingUser._id.toString(),
      userName: existingUser.name,
      token: token,
      latitude: geoLocation.latitude,
      longitude: geoLocation.longitude
    };

    return res.status(200).json({
      message: "Successfully logged in!",
      success: true,
      staff: userData,
      token,
      location: geoLocation
    });

  } catch (error) {
    console.error('Signin error:', error);
    return res.status(500).json({
      message: "Internal server error", 
      error: error.message,
      success: false
    });
  }
};

const validateUserData = (userData) => {
  const { name, id, email, password, area, postOffice, phoneno } = userData;
  
  if (!name || !id || !email || !password || !area || !postOffice || !phoneno) {
    return {
      isValid: false,
      error: "Please provide all required fields"
    };
  }
  
  return { isValid: true };
};

const checkExistingUser = async (id, email) => {
  const existingUser = await User.findOne({ $or: [{ id }, { email }] });
  if (existingUser) {
    return {
      exists: true,
      error: "User already exists. Please try logging in."
    };
  }
  return { exists: false };
};

const checkExistingPostOffice = async (postOfficeName) => {
  const postOffice = await PostOffice.findOne({ name: postOfficeName });
  if (postOffice) {
    return {
      exists: true,
      error: "Post Office already exists!"
    };
  }
  return { exists: false };
};

const getOrCreateArea = async (areaName) => {
  let area = await Area.findOne({ name: areaName });
  
  if (!area) {
    area = await Area.create({
      name: areaName,
      postOffices: [],
    });
  }
  return area;
};

const createPostOffice = async ({ name, areaId, userId }) => {
  const currentDate = new Date();
  const nextAuditDate = new Date();
  nextAuditDate.setMonth(nextAuditDate.getMonth() + 1); // Set next audit to 1 month from now

  return await PostOffice.create({
    name,
    areaId,
    userId,
    location: {
      latitude: 0, // These should be provided in the request
      longitude: 0
    },
    photoLinks: [],
    swachhataMetrics: {
      cleanlinessScore: 100,
      wasteManagementScore: 100,
      sanitationScore: 100,
      maintenanceScore: 100,
      lastInspectionDate: currentDate
    },
    lifeMetrics: {
      greenScore: 100,
      energyEfficiencyScore: 100,
      waterConservationScore: 100,
      wasteReductionScore: 100,
      sustainablePracticesScore: 100
    },
    complianceStatus: 'COMPLIANT',
    lastAuditDate: currentDate,
    nextScheduledAudit: nextAuditDate
  });
};

const updateAreaWithPostOffice = async (area, postOfficeId) => {
  area.postOffices.push(postOfficeId);
  await area.save();
  
  if (area.divisionalOfficer) {
    await DivisionalOffice.findByIdAndUpdate(
      area.divisionalOfficer,
      { $push: { postOffices: postOfficeId } },
      { new: true }
    );
  }
};

export const signup = async (req, res) => {
  try {
    const { name, id, email, password, area, postOffice, phoneno } = req.body;

    // Validate user data
    const validation = validateUserData({ name, id, email, password, area, postOffice, phoneno });
    if (!validation.isValid) {
      return res.status(400).json({
        message: validation.error,
        success: false
      });
    }

    // Check existing user
    const userCheck = await checkExistingUser(id, email);
    if (userCheck.exists) {
      return res.status(409).json({
        message: userCheck.error,
        success: false
      });
    }

    // Check existing post office
    const postOfficeCheck = await checkExistingPostOffice(postOffice);
    if (postOfficeCheck.exists) {
      return res.status(409).json({
        message: postOfficeCheck.error,
        success: false
      });
    }

    const userIP = getClientIp(req);
    
    // Only attempt geolocation if we have a valid IP
    const geoLocation = isValidIp(userIP) ? 
      await fetchGeolocation(userIP) : 
      { latitude: "0", longitude: "0" };

    console.log('User IP:', userIP);
    console.log('Geolocation:', geoLocation);

    // Extract coordinates from geolocation
    const latitude = geoLocation?.latitude || "0";
    const longitude = geoLocation?.longitude || "0";

    // Create new user
    const newUser = await User.create({
      name,
      id,
      email,
      password,
      area,
      postOffice,
      phoneno,
      latitude,
      longitude
    });

    // Get or create area first
    const areaDoc = await getOrCreateArea(area);

    // Create post office with the area ID
    const postOfficeDoc = await createPostOffice({
      name: postOffice,
      areaId: areaDoc._id,
      userId: newUser._id,
    });

    // Update area with the new post office
    await updateAreaWithPostOffice(areaDoc, postOfficeDoc._id);

    return res.status(201).json({
      message: "Account created successfully!",
      success: true,
      staff: {
        email: newUser.email,
        area: newUser.area,
        postOffice: newUser.postOffice,
        phoneno: newUser.phoneno,
        userId: newUser._id,
        userName: newUser.name
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({
      message: "An error occurred during registration",
      success: false
    });
  }
};

export const health = (req, res) => {
  res.status(200).json({ message: "Server is healthy", success: true });
};