//::================================>>Core library<<================================::
//::================================================================================::

//::================================>>Third party<<=================================::
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
//::================================================================================::

//::===============================>>Custom library<<===============================::
import { roles } from './role.seed';
import { users } from './user.seed';
import { customers } from './customer.seed';
import { categories } from './category.seed';
import { products } from './product.seed';
import { dashboards } from './dashboard.seed';
//::================================================================================::

// initialize Prisma Client

const prisma = new PrismaClient();

async function main() {
  //::================================>>Delete data<<=================================::
  await prisma.product.deleteMany();
  await prisma.order.deleteMany();
  await prisma.category.deleteMany();
  await prisma.orderDetail.deleteMany();
  await prisma.log.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.userSession.deleteMany();
  await prisma.user.deleteMany();
  await prisma.role.deleteMany();
  await prisma.dashboard.deleteMany();
  //::================================================================================::

  //::================================>>Start seed<<==================================::
  for (const role of roles) {
    const newRole = await prisma.role.create({ data: role });
    console.log(newRole);
  }

  for (const user of users) {
    const { password, ...userData } = user;
    const newUser = await prisma.user.create({
      data: {
        ...userData,
        password: await bcrypt.hash(password, 10),
      },
    });
    console.log(newUser);
  }

  for (const customer of customers) {
    const newCustomer = await prisma.customer.create({ data: customer });
    console.log(newCustomer);
  }

  for (const category of categories) {
    const newCategory = await prisma.category.create({ data: category });
    console.log(newCategory);
  }

  for (const product of products) {
    const newProduct = await prisma.product.create({ data: product });
    console.log(newProduct);
  }

  for (const dashboard of dashboards) {
    const newDashboard = await prisma.dashboard.create({ data: dashboard });
    console.log(newDashboard);
  }
  //::================================================================================::

  console.log('===============================');
  console.log('|| 🚀  seed succesfully  🚀 ||');
  console.log('===============================');
}

// execute the main function

main()
  .catch((e) => {
    console.error(e);

    process.exit(1);
  })

  .finally(async () => {
    // close Prisma Client at the end

    await prisma.$disconnect();
  });
