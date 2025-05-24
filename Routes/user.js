const express = require('express');
const router = express.Router();
const { User} = require('../Models/UserModel.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.get('/', async (req, res) => {
   const UserPresent = await User.find().select('-password');
    if (UserPresent) {
        res.status(200).json({
            message: 'Users fetched successfully',
            users: UserPresent,
        });
    } else {
        res.status(500).json({
            message: 'Error fetching users',
            error: error,
        });
    }
}
);

router.post('/', async (req, res) => {
    try {
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.passwordhash,10),
            isAdmin: req.body.isAdmin,
            street: req.body.street,
            apartment: req.body.apartment,
            city: req.body.city,
            zip: req.body.zip,
            country: req.body.country,
            phone: req.body.phone,
        });
        console.log(user);
        const NewUser = await user.save();

        res.status(201).json({
            message: 'User created successfully',
            user: NewUser,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error creating user',
            error: error,
        });
    }
});

router.post('/login', async (req, res) => {
    const user = await User.findOne({
        email: req.body.email,
    });
    if (user) {
        if (user && bcrypt.compareSync(req.body.passwordhash, user.password)) {
            const token = jwt.sign(
                {
                    userId: user._id,
                    isAdmin: user.isAdmin,
                 
                },
                process.env.JWT_SECRET,
                { expiresIn: '30d' }
            );
            res.status(200).json({
                message: 'User logged in successfully',
                user: user.email,
                token: token,
              
            });
        } else {
            res.status(400).json({
                message: 'Invalid email or password',
            });
        }
    } else {
        res.status(400).json({
            message: 'User not found',
        });
    }
})

        


module.exports = router;