const dummyConversations = [
    {
        user1: {
            firstName: 'Robert',
            lastName: 'Avramescu',
            profilePicture: 'http://res.cloudinary.com/teodoranemtanu/image/upload/v1590441431/stage-buds/qcgp5opim2bfkeqwphv8.jpg',
            id: '5ebc5ab8d6b12821eca6e172'
        },
        user2: {
            id: '5ecc0a456924d51c5047161c',
            firstName: 'Teodora',
            lastName: 'Nemtanu',
            profilePicture: 'http://res.cloudinary.com/teodoranemtanu/image/upload/v1590441431/stage-buds/qcgp5opim2bfkeqwphv8.jpg'
        },
        id: 1
    },
    {
        user1: {
            firstName: 'Marina',
            lastName: 'Teianu',
            profilePicture: 'http://res.cloudinary.com/teodoranemtanu/image/upload/v1590441431/stage-buds/qcgp5opim2bfkeqwphv8.jpg',
            id: '5ebc5aced6b12821eca6e174',
        },
        user2: {
            id: '5ecc0a456924d51c5047161c',
            firstName: 'Teodora',
            lastName: 'Nemtanu',
            profilePicture: 'http://res.cloudinary.com/teodoranemtanu/image/upload/v1590441431/stage-buds/qcgp5opim2bfkeqwphv8.jpg'
        },
        id: 2
    }];

const dummyMessages = [
    {
        text: 'Hello there',
        timestamp: Date.now(),
        sender: {
            id: '5ecc0a456924d51c5047161c',
            firstName: 'Teodora',
            lastName: 'Nemtanu',
            profilePicture: 'http://res.cloudinary.com/teodoranemtanu/image/upload/v1590441431/stage-buds/qcgp5opim2bfkeqwphv8.jpg'
        }
    },
    {
        text: 'Buna siua',
        timestamp: Date.now(),
        sender: {
            id: '5ebc5ab8d6b12821eca6e172',
            firstName: 'Robert',
            lastName: 'Avramescu',
            profilePicture: null
        }
    },
    {
        text: 'Ce faci?',
        timestamp: Date.now(),
        sender: {
            id: '5ebc5ab8d6b12821eca6e172',
            firstName: 'Robert',
            lastName: 'Avramescu',
            profilePicture: null
        }
    },
    {
        text: 'Lucrez la licenta, tu?',
        timestamp: Date.now(),
        sender: {
            id: '5ecc0a456924d51c5047161c',
            firstName: 'Teodora',
            lastName: 'Nemtanu',
            profilePicture: 'http://res.cloudinary.com/teodoranemtanu/image/upload/v1590441431/stage-buds/qcgp5opim2bfkeqwphv8.jpg'
        }
    },
    {
        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed eget blandit lectus. ' +
            'In porta, nisi in consequat aliquam, odio purus molestie ex, quis rutrum lacus nulla at quam. ' +
            'Mauris ligula nibh, porttitor eu accumsan in, consequat et libero. Quisque semper, urna et ' +
            'vestibulum faucibus, mauris sem volutpat purus, eu sollicitudin tortor nisl eu velit. Nunc ultricies ' +
            'sed mauris vel mollis. Vivamus at porttitor purus. Integer a quam placerat, condimentum enim non,' +
            ' auctor quam. Aliquam vel efficitur felis. Nulla enim nulla, feugiat sed tincidunt ac, blandit a dolor. ' +
            'Vivamus et tellus lectus. Morbi ultricies fermentum leo non porta.',
        timestamp: Date.now(),
        sender: {
            id: '5ebc5ab8d6b12821eca6e172',
            firstName: 'Robert',
            lastName: 'Avramescu',
            profilePicture: null
        }
    }
];


exports.conversations = dummyConversations;
exports.messages = dummyMessages;