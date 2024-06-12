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
    name: 'Suos Phearith',
    email: 'suosphearith@gmail.com',
    gender: Gender.Male,
    createdBy: 1,
  },
  {
    name: 'Vann Chansethy',
    email: 'vannchansethy@gmail.com',
    gender: Gender.Male,
    createdBy: 2,
  },
  {
    name: 'Tom Tito',
    email: 'tomtito@gmail.com',
    gender: Gender.Male,
    createdBy: 2,
  },
  {
    name: 'Song Kheang',
    email: 'songkheang@gmail.com',
    gender: Gender.Male,
    createdBy: 2,
  },
];
