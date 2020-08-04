const setlistfm = require('setlistfm-js');
const HashMap  = require('hashmap');
let setlistfmClient = new setlistfm({
    key: "-UKeya9hzRt2EFRXpTCH7PV-Xg71lx7y4-6Z",
    format: "json",
    language: "en",
});

const getSetlists = (setlistObject) => {
    let setlists = [];
    for(setlist of setlistObject) {
        if (setlist.sets.set[0]) {
            setlists = [...setlists, setlist.sets.set[0].song];
        }
    }
    return setlists;
};

const createProbabilitySetlist = (setlists) => {
    const hashedSetlist = new HashMap();
    for(const setlist of setlists) {
        for(const song of setlist) {
            const frequency = hashedSetlist.get(song.name);
            if(frequency){
                hashedSetlist.set(song.name, frequency + 1);
            }else {
                hashedSetlist.set(song.name, 1);
            }
        }
    }
    let sortedSetlistWithProbability = [];
    const setlistLength = setlists.length;
    for(const pair of hashedSetlist) {
        sortedSetlistWithProbability = [...sortedSetlistWithProbability, {
            title: pair.key,
            frequency: pair.value / setlistLength
        }];
    }
    sortedSetlistWithProbability.sort((a, b) => (a.frequency > b.frequency) ? -1 : +1);
    return sortedSetlistWithProbability;
};

const checkEmptySetlists = (setlists) => {
    for(let setlist of setlists)
        if(setlist.sets.set.length > 0)
            return true;
    return false;
};

const getFutureSetlist = async (mbIdentifiers) => {
    let setlistResponse;
    for(const identifier of mbIdentifiers) {
        setlistResponse = await setlistfmClient.getArtistSetlists(identifier.mbid, {
            p: 1
        });
        // console.log('--------------',setlistResponse.status);
        if(setlistResponse.status !== 'Not Found'){
            break;
        }
    }
    if(setlistResponse.status === 'Not Found') {
        return "No playlist found";
    }
    // console.log('______', setlistResponse.setlist iterate sets set);
    const setlists = getSetlists(setlistResponse.setlist);
    const songsWithProbability = createProbabilitySetlist(setlists);
    return songsWithProbability.slice(0, 10);
};

exports.getFutureSetlist = getFutureSetlist;
