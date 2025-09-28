import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'User not authenticated' },
        { status: 401 }
      );
    }

    const { roundId } = await request.json();
    
    if (!roundId) {
      return NextResponse.json(
        { error: 'Round ID is required' },
        { status: 400 }
      );
    }

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Here you would implement the actual logic to join a round
    // For now, we'll just return a success response
    console.log(`User ${session.user.id} joining round ${roundId}`);

    return NextResponse.json({
      success: true,
      message: 'Successfully joined the round',
      roundId,
      userId: session.user.id
    });

  } catch (error) {
    console.error('Error joining round:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}