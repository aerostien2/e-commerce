const bcrypt = require('bcrypt');
const User = require('../models/user');
const auth = require('../auth');
const { errorHandler } = auth;

//User registration

module.exports.registerUser = (req, res) => {
    if (!req.body) {
        return res.status(400).send({ message: 'Request body is missing' });
    }

    const { email, mobileNo, password, firstName, lastName } = req.body;

    if (!email || !email.includes("@")) {
        return res.status(400).send({ message: 'Invalid email format' });
    } else if (!mobileNo || mobileNo.length !== 11) {
        return res.status(400).send({ message: 'Mobile number is invalid' });
    } else if (!password || password.length < 8) {
        return res.status(400).send({ message: 'Password must be at least 8 characters long' });
    } else {
        const newUser = new User({
            firstName,
            lastName,
            email,
            mobileNo,
            password: bcrypt.hashSync(password, 10)
        });

        return newUser.save()
            .then((result) => res.status(201).send({
                message: 'User registered successfully'
            }))
            .catch(error => errorHandler(error, req, res));
    }
};


//User authentication
module.exports.loginUser = (req, res) => {

    if(req.body.email.includes("@")){
        return User.findOne({ email : req.body.email })
        .then(result => {
            if(result == null){
                return res.status(404).send({ message: 'No email found' });
            } else {
                const isPasswordCorrect = bcrypt.compareSync(req.body.password, result.password);
                if (isPasswordCorrect) {
                    return res.status(200).send({ 
                        message: 'User logged in successfully',
                        access : auth.createAccessToken(result)
                        })
                } else {
                    return res.status(401).send({ message: 'Email and password do not match' });
                }
            }
        })
        .catch(error => errorHandler(error, req, res));
    } else{
        return res.status(400).send({ message: 'Invalid email' });
    }
};


//Retrieve user details

module.exports.getProfile = (req, res) => {
    return User.findById(req.user.id)
        .then(user => {
            if (!user) {
                return res.status(404).send({ message: 'User not found' });
            }

            // Convert to plain object and remove password
            const userData = user.toObject();
            delete userData.password;

            return res.status(200).send({ user: userData });
        })
        .catch(error => errorHandler(error, req, res));
};

 

//Set as admin

exports.setAdmin = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found.' });

    user.isAdmin = true;
    await user.save();

    const { _id, firstName, lastName, email, isAdmin, mobileNo} = user;

    res.status(200).json({
      updatedUser: {
        _id,
        firstName,
        lastName,
        email,
        isAdmin,
        mobileNo  
      }
    });
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(500).json({
        error: 'Failed in Find',
        details: {
          stringValue: err.stringValue,
          valueType: typeof err.value,
          kind: err.kind,
          value: err.value,
          path: err.path,
          reason: err.reason,
          name: err.name,
          message: err.message
        }
      });
    }

    res.status(500).json({ error: err.message });
  }
};



//Update password
module.exports.updatePassword = function (req, res) {
  const { currentPassword, newPassword } = req.body;

  User.findById(req.user.id, function (err, user) {
    if (err || !user) {
      return res.status(404).json({ message: 'User not found' });
    }

    bcrypt.compare(currentPassword, user.password, function (err, isMatch) {
      if (err) {
        return res.status(500).json({ message: 'An error occurred' });
      }
      if (!isMatch) {
        return res.status(400).json({ message: 'Current password is incorrect' });
      }

      bcrypt.hash(newPassword, 10, function (err, hash) {
        if (err) {
          return res.status(500).json({ message: 'An error occurred' });
        }

        user.password = hash;
        user.save(function (err) {
          if (err) {
            return res.status(500).json({ message: 'An error occurred' });
          }
          res.status(200).json({ message: 'Password reset successfully' });
        });
      });
    });
  });
};