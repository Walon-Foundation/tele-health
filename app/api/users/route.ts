import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { users } from '@/db/schema';
import { sanitizeInput, isValidUsername, secureJSONResponse, secureErrorResponse } from '@/utils/security';
import { z } from 'zod';

// Input validation schema
const createUserSchema = z.object({
  username: z.string().min(3).max(20).regex(/^[a-zA-Z0-9_-]+$/),
  avatar: z.number().int().min(1).max(8),
  ageRange: z.string().optional(),
  gender: z.string().optional(),
  topics: z.array(z.string()).min(1).max(10),
});

export async function POST(req: NextRequest) {
  try {
    // Parse and validate request body
    const body = await req.json();
    
    // Validate input schema
    const validationResult = createUserSchema.safeParse(body);
    if (!validationResult.success) {
      return secureErrorResponse('Invalid input data', 400);
    }
    
    const { username, avatar, ageRange, gender, topics } = validationResult.data;
    
    // Sanitize username
    const sanitizedUsername = sanitizeInput(username);
    
    // Additional username validation
    if (!isValidUsername(sanitizedUsername)) {
      return secureErrorResponse('Invalid username format', 400);
    }
    
    // Check for profanity or inappropriate content (basic check)
    const inappropriateWords = ['test', 'admin', 'root']; // Add more as needed
    if (inappropriateWords.some(word => sanitizedUsername.toLowerCase().includes(word))) {
      return secureErrorResponse('Username contains inappropriate content', 400);
    }
    
    // Create anonymous user
    const [newUser] = await db.insert(users).values({
      username: sanitizedUsername,
      avatar,
      ageRange: ageRange ? sanitizeInput(ageRange) : undefined,
      gender: gender ? sanitizeInput(gender) : undefined,
      topics,
      role: 'user',
    }).returning();

    // Return only necessary data (don't leak internal IDs if not needed)
    return secureJSONResponse({
      user: {
        id: newUser.id,
        username: newUser.username,
        avatar: newUser.avatar,
        topics: newUser.topics,
      }
    });
  } catch (error) {
    console.error('Error creating user:', error);
    return secureErrorResponse('Failed to create user', 500);
  }
}
