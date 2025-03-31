const { PrismaClient } = require('@prisma/client');
const { faker } = require('@faker-js/faker/locale/fr');

const prisma = new PrismaClient();

async function main() {
  // Supprimer les données existantes
  await prisma.user.deleteMany({});
  console.log('Données utilisateurs supprimées');
  
  await prisma.product.deleteMany({});
  console.log('Données produits supprimées');

  // Créer des utilisateurs
  const admin = await prisma.user.create({
    data: {
      name: 'Admin',
      email: 'admin@example.com',
      role: 'admin',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
    },
  });

  const users = [];
  for (let i = 0; i < 10; i++) {
    users.push(await prisma.user.create({
      data: {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        role: 'user',
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`,
      },
    }));
  }

  console.log(`${users.length + 1} utilisateurs créés, dont l'admin: ${admin.name}`);

  // Créer des produits
  const categories = ['électronique', 'vêtements', 'alimentation', 'maison', 'loisirs'];
  
  const products = [];
  for (let i = 0; i < 20; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)];
    
    products.push(await prisma.product.create({
      data: {
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: parseFloat(faker.commerce.price({ min: 10, max: 1000 })),
        category,
        stock: faker.number.int({ min: 0, max: 100 }),
        imageUrl: `https://picsum.photos/seed/${i}/400/300`,
      }
    }));
  }

  console.log(`${products.length} produits créés`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  }); 