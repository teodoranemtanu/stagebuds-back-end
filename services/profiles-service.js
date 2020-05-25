const MODEL_PATH = '../models/' ;
const Profile = require(MODEL_PATH + 'profile');

const createProfile = async (user) => {
  const createdProfile = new Profile({user});
  await createdProfile.save();
  return createdProfile;
};

const getAllProfiles = async () => {
  return await Profile.find();
};

const findProfileByUserId = async (uid) => {
  const profile = await Profile.findOne({user: uid});
  return profile;
};

const updateProfile = async (uid, newDescription, newBands, newGenres, newConcerts) => {
  const profile = await Profile.findOneAndUpdate({user: uid}, {
    description: newDescription,
    bands: newBands,
    genres: newGenres,
    concerts: newConcerts
  }, {
    new: true
  });
  console.log(profile);
  return profile;
};

exports.createProfile = createProfile;
exports.getAllProfiles = getAllProfiles;
exports.findProfileByUserId = findProfileByUserId;
exports.updateProfile = updateProfile;