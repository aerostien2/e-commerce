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
        return res.status(400).send({ message: 'Email invalid' });
    } else if (!mobileNo || mobileNo.length !== 11) {
        return res.status(400).send({ message: 'Mobile number invalid' });
    } else if (!password || password.length < 8) {
        return res.status(400).send({ message: 'Password must be at least 8 characters' });
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
                message: 'Registered successfully'
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
                        access : auth.createAccessToken(result)
                        })
                } else {
                    return res.status(401).send({ message: 'Email and password do not match' });
                }
            }
        })
        .catch(error => errorHandler(error, req, res));
    } else{
        return res.status(400).send({ message: 'Invalid Email' });
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

    const { _id, firstName, lastName, email, password, isAdmin, mobileNo} = user;

    res.status(200).json({
      updatedUser: {
        _id,
        firstName,
        lastName,
        email,
        password,
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
module.exports.updatePassword = async (req, res) => {
  const { newPassword } = req.body; 

  try {
    const user = await User.findById(req.user.id);  

    if (!user) return res.status(404).json({ message: 'User not found' });  

    user.password = await bcrypt.hash(newPassword, 10);

    await user.save();  // Save updated user

    // Send success response
    res.status(200).json({ message: 'Password reset successfully' });

  } catch (err) {
    errorHandler(err, req, res);
  }
};

