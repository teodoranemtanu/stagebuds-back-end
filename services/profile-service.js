const MODEL_PATH = '../models/' ;
const Profile = require(MODEL_PATH + 'profile');

const createProfile = async (user) => {
  const createdProfile = new Profile({user});
  await createdProfile.save();
  return createdProfile;
};

exports.createProfile = createProfile;