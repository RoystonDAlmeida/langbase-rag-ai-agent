// Memory agents combine vector storage, RAG and internet access to create a powerful managed context search API
// Memory-when connected directly to a langbase pipe agent becomes a memory agent

import 'dotenv/config';
import { Langbase } from 'langbase';

const langbase = new Langbase({
	apiKey: process.env.LANGBASE_API_KEY!,
});

async function main() {

	// Use memories.create() to create a new AI memory
	const memory = await langbase.memories.create({ 
		name: 'knowledge-base',
		description: 'An AI memory for agentic memory work',
		embedding_model: 'google:text-embedding-004'
	});
	
	console.log('AI Memory:', memory);
}

main();
