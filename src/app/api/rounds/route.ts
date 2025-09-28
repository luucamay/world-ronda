import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';

export async function POST(request: NextRequest) {
  console.log('🔵 [API] POST /api/rounds - Join round request received');
  console.log('🔵 [API] Simulating PasaCoin API call: joinPublicRound(userId, roundId)');
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

    // Simulate PasaCoin API response structure
    // This simulates the actual API call: apiService.joinPublicRound(userId, roundId)
    console.log(`✅ [API] User ${session.user.id} successfully joined round ${roundId}`);
    console.log('🔵 [API] Simulating PasaCoin API response structure...');

    // Mock response matching CreateRoundResponse interface from PasaCoin API
    const pasaCoinResponse = {
      code: 200,
      message: 'User successfully joined the public round',
      success: true
    };
    
    // Add additional metadata for frontend use
    const response = {
      ...pasaCoinResponse,
      roundId,
      userId: session.user.id,
      timestamp: new Date().toISOString(),
      // Simulate additional round info that might be returned
      roundInfo: {
        id: parseInt(roundId) || 1,
        name: `Round ${roundId}`,
        numberOfParticipants: Math.floor(Math.random() * 50) + 1,
        numberActualOfParticipants: Math.floor(Math.random() * 45) + 1,
        payOfRounds: 100,
        status: 'ACTIVE'
      }
    };
    
    console.log('🔵 [API] Sending PasaCoin-compatible response:', response);
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