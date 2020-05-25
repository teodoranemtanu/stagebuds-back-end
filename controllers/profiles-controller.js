const HttpError = require('../models/http-error');
const usersService = require('../services/users-service');
const profileService = require('../services/profiles-service');

const getAllProfiles = async (req, res, next) => {
    let profiles;
    try {
        profiles = await profileService.getAllProfiles();
    } catch (err) {
        const error = new HttpError(err.message, err.errorCode);
        return next(error);
    }
    await res.json(profiles.map(profile => profile.toObject({getters: true})))
};

const getUserProfile = async (req, res, next) => {
    const uid = req.params.uid;
    let profile;
    try {
        profile = await profileService.findProfileByUserId(uid);
    } catch (err) {
        const error = new HttpError(err.message, err.errorCode);
        return next(error);
    }

    await res.json(profile.toObject({getters: true}));
};

const updateProfile = async (req, res, next) => {
    const uid = req.params.uid;
    let profile;
    const {description, bands, genres, concerts} = req.body;

    console.log(uid, req.userData.userId);
    if(!usersService.isCreator(uid, req.userData.userId)){
        const error = new HttpError("You are not allowed to edit this profile",
            401);
        return next(error);
    }

    try {
        profile = await profileService.updateProfile(uid, description, bands, genres, concerts);
    } catch (err) {
        const error = new HttpError(err.message, err.errorCode);
        return next(error);
    }
    await res.json(profile.toObject({getters: true}));
};

exports.getAllProfiles = getAllProfiles;
exports.getUserProfile = getUserProfile;
exports.updateProfile = updateProfile;
