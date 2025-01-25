import { Anthropic } from '@anthropic-ai/sdk';
import { NextResponse } from 'next/server';
import { extractXML, buildPrompt } from '../../../lib/utils';
import { BusinessContext, GenerationResponse } from '../../../lib/types';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log('API received:', body);

    const { context, feedback } = body;

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
      }]
    });

    const content = response.content[0].text;
    console.log('Claude response:', content);

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
    console.error('API error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json({ error: 'Generation failed', details: errorMessage }, { status: 500 });
  }
}
