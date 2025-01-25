import { Anthropic } from '@anthropic-ai/sdk';
import { NextResponse } from 'next/server';
import { extractXML, buildPrompt } from '../../../lib/utils';
import { BusinessContext, GenerationResponse } from '../../../lib/types';

export const runtime = 'edge'; // Add edge runtime
export const maxDuration = 300; // 5 minute timeout

// Debug the API key early
const apiKey = process.env.ANTHROPIC_API_KEY;
if (!apiKey) {
  console.error('API key not found in environment');
}

const anthropic = new Anthropic({
  apiKey,
  maxRetries: 3,
  timeout: 180_000 // 3 minute timeout
});

export async function POST(req: Request) {
  console.log('API route started');
  
  if (!apiKey) {
    console.error('No API key available');
    return NextResponse.json(
      { error: 'API configuration error - No API key' },
      { status: 500 }
    );
  }

  try {
    const { context, feedback } = await req.json();
    console.log('Processing request for:', context?.industry);

    const prompt = `Generate compelling strategy statements based on the business context provided.
    Guidelines:
    - Vision: Should be aspirational, future-focused, and memorable
    - Mission: Should be clear, actionable, and focused on current purpose
    - Objectives: Should be SMART (Specific, Measurable, Achievable, Relevant, Time-bound)

    Format your response as:
    <thoughts>Your reasoning about the strategy</thoughts>
    <statements>
        <vision>The vision statement</vision>
        <mission>The mission statement</mission>
        <objectives>
        1. First objective
        2. Second objective
        3. Third objective
        </objectives>
    </statements>`;

    const response = await anthropic.messages.create({
      model: 'claude-3-opus-20240229',
      max_tokens: 1000,
      messages: [{
        role: 'user',
        content: buildPrompt(prompt, context, feedback)
      }],
      temperature: 0.7
    });

    console.log('Anthropic response received');

    if (!response.content[0]?.text) {
      throw new Error('Invalid response format from Claude');
    }

    const content = response.content[0].text;
    console.log('Claude response length:', content.length);

    const thoughts = extractXML(content, 'thoughts');
    const statements = extractXML(content, 'statements');
    
    console.log('Extracted XML:', { thoughts, statements });
    
    const result: GenerationResponse = {
      thoughts,
      statements: {
        vision: extractXML(statements, 'vision'),
        mission: extractXML(statements, 'mission'),
        objectives: extractXML(statements, 'objectives').split('\n')
      }
    };

    console.log('Sending response:', result);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Detailed API error:', {
      name: error.name,
      message: error.message,
      stack: error.stack,
      cause: error.cause
    });
    
    return NextResponse.json({ 
      error: 'Generation failed', 
      details: error.message,
      name: error.name
    }, { 
      status: error.status || 500 
    });
  }
}
