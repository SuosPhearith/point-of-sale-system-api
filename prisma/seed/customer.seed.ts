// Define the Gender enum
enum Gender {
  Male = 'male',
  Female = 'female',
}

// Define your users array with the Gender enum
export const customers = [
  {
    id: 1,
    name: 'General Customer',
    email: 'general@gmail.com',
    gender: Gender.Male,
    createdBy: 1,
  },
  {
    id: 2,
    name: 'Suos Phearith',
    email: 'suosphearith@gmail.com',
    gender: Gender.Male,
    createdBy: 1,
  },
  {
    id: 3,
    name: 'Vann Chansethy',
    email: 'vannchansethy@gmail.com',
    gender: Gender.Male,
    createdBy: 2,
  },
  {
    id: 4,
    name: 'Tom Tito',
    email: 'tomtito@gmail.com',
    gender: Gender.Male,
    createdBy: 2,
  },
  {
    id: 5,
    name: 'Song Kheang',
    email: 'songkheang@gmail.com',
    gender: Gender.Male,
    createdBy: 2,
  },
];
