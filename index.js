const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;
// Middleware
app.use(express.json());
// Basic route'
const apiPath = "/api/users"
app.get(apiPath, (req, res) => {
  res.json({ 
    name: 'Anas',
    email: 'alihasnain@gmail.com',
    age: 20,
    city: 'Karachi',
    country: 'Pakistan'
  });
});

const myChoriApi = "/ali-self-medication";
const url = "https://apidb.dvago.pk/AppAPIV3/GetProductBannersBySlugV1&Slug=AppHomePageProductCarouselOne&BranchCode=48&ProductID=&limit=0,10";

  
app.get(myChoriApi, async (req, res) => {

const response = await axios.get(url);
  
  res.json({
    message: "Chori retrieved successfully",
    myChori: response.data
  });
});

const myJson = "/json-api";
const data = [
  {
    id: 1,
    name: 'Anas',
    email: 'anas@gmail.com',
  },
  {
    id: 2,
    name: 'Ali',
    email: 'ali@gmail.com',
  },
  {
    id: 3,
    name: 'Ahmed',
    email: 'ahmed@gmail.com',
  }
]
app.get(myJson, (req, res) => {
  res.json(
  {
    message: "Users retrieved successfully",
    myUsers: data
  }
  );
});

app.post(myJson, (req, res) => {
  try {
    const { name, email } = req.body;
    
    // Validate required fields
    if (!name || !email) {
      return res.status(400).json({
        message: "Name and email are required",
        error: "Missing required fields"
      });
    }
    
    const newUser = {
      id: data.length + 1,
      name: name,
      email: email
    };
    
    // Add to data array
    data.push(newUser);
    
    res.status(201).json({
      message: "User added successfully",
      newUser: newUser,
      totalUsers: data.length
    });
    
  } catch (error) {
    res.status(500).json({
      message: "Error adding user",
      error: error.message
    });
  }
});

app.put(`${myJson}/:id`, (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const { name, email } = req.body;
    
    // Find user by ID
    const userIndex = data.findIndex(user => user.id === userId);
    
    if (userIndex === -1) {
      return res.status(404).json({
        message: "User not found",
        error: "User with this ID does not exist"
      });
    }
    
    if (!name || !email) {
      return res.status(400).json({
        message: "PUT requires all fields (name and email)",
        error: "Missing required fields for complete resource replacement",
        note: "PUT replaces the entire resource, so all fields are required"
      });
    }
    
    // Replace the entire user object
    const updatedUser = {
      id: userId,
      name: name,
      email: email
    };
    
    data[userIndex] = updatedUser;
    
    res.json({
      message: "User completely replaced (PUT)",
      updatedUser: updatedUser,
      note: "PUT replaced the entire resource with new data"
    });
    
  } catch (error) {
    res.status(500).json({
      message: "Error updating user",
      error: error.message
    });
  }
});

app.patch(`${myJson}/:id`, (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const { name, email } = req.body;
    
    // Find user by ID
    const userIndex = data.findIndex(user => user.id === userId);
    
    if (userIndex === -1) {
      return res.status(404).json({
        message: "User not found",
        error: "User with this ID does not exist"
      });
    }
    
    if (!name && !email) {
      return res.status(400).json({
        message: "PATCH requires at least one field to update",
        error: "No fields provided for update",
        note: "PATCH allows partial updates, so at least one field should be provided"
      });
    }
    
    // Get current user data
    const currentUser = data[userIndex];
    
    const updatedUser = {
      ...currentUser,
      ...(name && { name: name }),
      ...(email && { email: email })
    };
    
    data[userIndex] = updatedUser;
    
    res.json({
      message: "User partially updated (PATCH)",
      updatedUser: updatedUser,
      changes: {
        name: name ? `Changed from "${currentUser.name}" to "${name}"` : "No change",
        email: email ? `Changed from "${currentUser.email}" to "${email}"` : "No change"
      },
      note: "PATCH updated only the provided fields, keeping other fields unchanged"
    });
    
  } catch (error) {
    res.status(500).json({
      message: "Error updating user",
      error: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
module.exports = app; 