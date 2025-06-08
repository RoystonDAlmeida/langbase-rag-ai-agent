import { runMemoryAgent, runAiSupportAgent } from './agents';

async function main() {
    const query = 'What is agent parallelization?';
    
    // Two agents involved
    
    // 1. Retrieve chunks
    const chunks = await runMemoryAgent(query);
    
    // 2. Generate final responses using those chunks
    const completion = await runAiSupportAgent({
        chunks,
        query,
    });

    console.log('Completion:', completion);
}

main();

