import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { conversations, users, messages } from '@/db/schema';
import { eq, and, or, desc } from 'drizzle-orm';

// Get all conversations for a user
export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID required' },
        { status: 400 }
      );
    }

    const userConversations = await db
      .select({
        id: conversations.id,
        topics: conversations.topics,
        status: conversations.status,
        createdAt: conversations.createdAt,
        updatedAt: conversations.updatedAt,
        counselor: {
          id: users.id,
          username: users.username,
          avatar: users.avatar,
        },
        lastMessage: messages,
      })
      .from(conversations)
      .leftJoin(users, eq(conversations.counselorId, users.id))
      .leftJoin(
        messages,
        and(
          eq(messages.conversationId, conversations.id),
          // Get the latest message
        )
      )
      .where(eq(conversations.userId, userId))
      .orderBy(desc(conversations.updatedAt));

    return NextResponse.json({ conversations: userConversations });
  } catch (error) {
    console.error('Error fetching conversations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch conversations' },
      { status: 500 }
    );
  }
}

// Create a new conversation
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, topics, requestCounselor } = body;

    if (!userId || !topics || topics.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Auto-assign a counselor (find active counselor with matching specialty)
    let counselorId = null;
    if (!requestCounselor) {
      const availableCounselors = await db
        .select()
        .from(users)
        .where(
          and(
            eq(users.role, 'counselor'),
            eq(users.isActive, true)
          )
        )
        .limit(1);

      if (availableCounselors.length > 0) {
        counselorId = availableCounselors[0].id;
      }
    }

    // Create conversation
    const [conversation] = await db.insert(conversations).values({
      userId,
      counselorId,
      topics,
      status: counselorId ? 'active' : 'waiting',
      assignmentRequested: !!requestCounselor,
    }).returning();

    // Create initial welcome message from counselor
    if (counselorId) {
      await db.insert(messages).values({
        conversationId: conversation.id,
        senderId: counselorId,
        senderType: 'counselor',
        contentType: 'text',
        content: "Hello! I'm here to support you. This is a safe, anonymous space. What would you like to talk about today? 💚",
      });
    }

    return NextResponse.json({ conversation });
  } catch (error) {
    console.error('Error creating conversation:', error);
    return NextResponse.json(
      { error: 'Failed to create conversation' },
      { status: 500 }
    );
  }
}
