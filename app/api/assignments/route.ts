import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { assignmentRequests, conversations, users } from '@/db/schema';
import { eq } from 'drizzle-orm';

// Create assignment request
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { conversationId, requestedCounselorId, message } = body;

    if (!conversationId) {
      return NextResponse.json(
        { error: 'Conversation ID required' },
        { status: 400 }
      );
    }

    // Create assignment request
    const [request] = await db.insert(assignmentRequests).values({
      conversationId,
      requestedCounselorId,
      message,
      status: 'pending',
    }).returning();

    // Update conversation status
    await db
      .update(conversations)
      .set({ assignmentRequested: true })
      .where(eq(conversations.id, conversationId));

    return NextResponse.json({ request });
  } catch (error) {
    console.error('Error creating assignment request:', error);
    return NextResponse.json(
      { error: 'Failed to create assignment request' },
      { status: 500 }
    );
  }
}

// Get pending assignment requests (for counselors)
export async function GET(req: NextRequest) {
  try {
    const counselorId = req.nextUrl.searchParams.get('counselorId');

    let whereClause = eq(assignmentRequests.status, 'pending');
    if (counselorId) {
      whereClause = eq(assignmentRequests.requestedCounselorId, counselorId);
    }

    const requestsData = await db
      .select({
        requestId: assignmentRequests.id,
        requestMessage: assignmentRequests.message,
        requestStatus: assignmentRequests.status,
        requestCreatedAt: assignmentRequests.createdAt,
        conversationId: conversations.id,
        conversationTopics: conversations.topics,
        userUsername: users.username,
        userAvatar: users.avatar,
      })
      .from(assignmentRequests)
      .leftJoin(conversations, eq(assignmentRequests.conversationId, conversations.id))
      .leftJoin(users, eq(conversations.userId, users.id))
      .where(whereClause);

    // Format the response
    const requests = requestsData.map(r => ({
      id: r.requestId,
      message: r.requestMessage,
      status: r.requestStatus,
      createdAt: r.requestCreatedAt,
      conversation: {
        id: r.conversationId,
        topics: r.conversationTopics,
        user: {
          username: r.userUsername,
          avatar: r.userAvatar,
        },
      },
    }));

    return NextResponse.json({ requests });
  } catch (error) {
    console.error('Error fetching assignment requests:', error);
    return NextResponse.json(
      { error: 'Failed to fetch requests' },
      { status: 500 }
    );
  }
}
