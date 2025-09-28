import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';

export async function POST(request: NextRequest) {
  console.log('🔵 [API] POST /api/join-round - Request received');
  try {
    console.log('🔵 [API] Checking user authentication...');
    const session = await auth();
    
    if (!session?.user) {
      console.log('❌ [API] User not authenticated');
      return NextResponse.json(
        { error: 'User not authenticated' },
        { status: 401 }
      );
    }
    console.log('✅ [API] User authenticated:', session.user.id);

    const { roundId } = await request.json();
    console.log('🔵 [API] Received roundId:', roundId);
    
    if (!roundId) {
      console.log('❌ [API] Round ID is missing');
      return NextResponse.json(
        { error: 'Round ID is required' },
        { status: 400 }
      );
    }
    console.log('✅ [API] Round ID validation passed');

    // Simulate API call delay
    console.log('🔵 [API] Processing join request (simulating 1s delay)...');
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Here you would implement the actual logic to join a round
    // For now, we'll just return a success response
    console.log(`✅ [API] User ${session.user.id} successfully joined round ${roundId}`);

    const response = {
      success: true,
      message: 'Successfully joined the round',
      roundId,
      userId: session.user.id
    };
    
    console.log('🔵 [API] Sending response:', response);
    return NextResponse.json(response);

  } catch (error) {
    console.error('❌ [API] Error joining round:', error);
    console.error('❌ [API] Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}