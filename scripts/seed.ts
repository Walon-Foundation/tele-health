import { db } from '../db/index.js';
import { users } from '../db/schema.js';

async function seed() {
  console.log('🌱 Seeding database...');

  try {
    // Create counselors
    const counselors = await db.insert(users).values([
      {
        username: 'Counselor Hope',
        avatar: 3,
        topics: ['trauma', 'anxiety', 'depression'],
        role: 'counselor',
        specialties: ['PTSD', 'Trauma Recovery', 'Anxiety Management'],
        isActive: true,
      },
      {
        username: 'Dr. Sarah',
        avatar: 4,
        topics: ['addiction', 'family', 'relationships'],
        role: 'counselor',
        specialties: ['Addiction Recovery', 'Family Therapy'],
        isActive: true,
      },
      {
        username: 'Counselor James',
        avatar: 5,
        topics: ['work', 'depression', 'anxiety'],
        role: 'counselor',
        specialties: ['Work Stress', 'Burnout Prevention'],
        isActive: true,
      },
      {
        username: 'Dr. Amina',
        avatar: 6,
        topics: ['trauma', 'grief', 'crisis'],
        role: 'doctor',
        specialties: ['Crisis Intervention', 'Grief Counseling', 'Emergency Care'],
        isActive: true,
      },
    ]).returning();

    console.log(`✅ Created ${counselors.length} counselors:`);
    counselors.forEach((c) => {
      console.log(`   - ${c.username} (${c.role})`);
    });

    console.log('\n🎉 Seeding complete!');
    console.log('\nYou can now:');
    console.log('  1. Sign up as a user at http://localhost:3000/signup');
    console.log('  2. Access counselor dashboard at http://localhost:3000/counselor/dashboard');
    console.log('  3. View database in Drizzle Studio: pnpm db:studio');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }

  process.exit(0);
}

seed();
