# Agentic RAG with Langbase

This project demonstrates how to build a Retrieval Augmented Generation (RAG) system using [Langbase](https://langbase.com/). It sets up an AI memory, populates it with documents, and then uses an AI agent (Langbase Pipe) to answer questions based on the retrieved context from the memory.

## Table of Contents

- [Agentic RAG with Langbase](#agentic-rag-with-langbase)
  - [Table of Contents](#table-of-contents)
  - [Prerequisites](#prerequisites)
  - [Setup](#setup)
  - [Workflow \& Usage](#workflow--usage)
    - [1. Initialize Langbase Components](#1-initialize-langbase-components)
    - [2. Query the RAG System](#2-query-the-rag-system)
  - [How it Works Internally](#how-it-works-internally)
  - [Key Technologies](#key-technologies)

## Prerequisites

*   Node.js (e.g., v18 or later)
*   npm or yarn
*   A Langbase account and API key.

## Setup

1.  **Clone the repository (if applicable):**
    ```bash
    git clone git@github.com:RoystonDAlmeida/langbase-rag-ai-agent.git
    cd langbase-rag-ai-agent/
    ```

2.  **Install dependencies:**
    Navigate to the project root directory (`langbase-rag-ai-agent/`) and run:
    ```bash
    npm install
    ```
    or
    ```bash
    yarn install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the project root (`langbase-rag-ai-agent/`) with your Langbase API key:
    ```env
    LANGBASE_API_KEY=<your_langbase_api_key_here>
    ```

4.  **Prepare documents:**
    Ensure you have a `docs` directory in the project root (`langbase-rag-ai-agent/docs/`). You will need to create two text files in this directory with content from the Langbase documentation:

    *   **`agent-architectures.txt`**:
        1.  Go to https://langbase.com/docs/examples/agent-architectures.
        2.  Copy the textual content from the page.
        3.  Create a file named `agent-architectures.txt` in your `docs` directory.
        4.  Paste the copied content into this file and save it.

    *   **`langbase-faq.txt`**:
        1.  Go to http://langbase.com/docs.
        2.  Copy the relevant textual content (e.g., FAQ section or general documentation that would serve as a knowledge base for your RAG system).
        3.  Create a file named `langbase-faq.txt` in your `docs` directory.
        4.  Paste the copied content into this file and save it.

## Workflow & Usage

The project consists of several TypeScript scripts to set up and run the RAG system. You'll typically run these from the project's root directory.

### 1. Initialize Langbase Components

These scripts need to be run once (or whenever you want to re-initialize) to set up the necessary Langbase resources.

*   **Create AI Memory:**
    This script creates a memory store in Langbase to hold your knowledge base. The memory will be named `knowledge-base`.
    ```bash
    npx tsx create-memory.ts
    ```

*   **Upload Documents to Memory:**
    This script uploads documents from the `langbase-rag-ai-agent/docs/` directory into the `knowledge-base` memory.
    ```bash
    npx tsx upload-docs.ts
    ```

*   **Create AI Pipe (Agent):**
    This script creates a Langbase Pipe, which acts as the AI agent responsible for generating answers. The pipe will be named `ai-support-agent`.
    ```bash
    npx tsx create-pipe.ts
    ```

### 2. Query the RAG System

Once the setup is complete, you can ask questions. The `index.ts` script demonstrates this.

*   **Modify the Query (Optional):**
    Open `/index.ts` and change the `query` variable to your desired question:

    ```typescript
    // In langbase-rag-ai-agent/index.ts
    async function main() {
        const query = 'Your new question here?'; // <--- Modify this line
        // ... rest of the code
    }
    ```

*   **Run the Query:**
    ```bash
    npx tsx index.ts
    ```

    This script will:
    1.  Take the defined query.
    2.  Use `runMemoryAgent` (from `agents.ts`) to retrieve relevant document chunks from the `knowledge-base` memory.
    3.  Use `runAiSupportAgent` (from `agents.ts`) to pass these chunks along with the original query to the `ai-support-agent` pipe. The pipe then generates a final, context-aware answer.
    4.  Print the generated `Completion` to the console.

## How it Works Internally

*   **`create-memory.ts`**:
    *   Initializes a Langbase client.
    *   Calls `langbase.memories.create()` to create a new AI memory named `knowledge-base`. This memory uses `google:text-embedding-004` for embeddings.

*   **`upload-docs.ts`**:
    *   Reads specified text files (e.g., `agent-architectures.txt`, `langbase-faq.txt`) from the local `docs` directory.
    *   Uses `langbase.memories.documents.upload()` to upload the content of these files to the `knowledge-base` memory.
    *   Includes metadata (category, topic) with each document.
  
*   **`create-pipe.ts`**:
    *   Initializes a Langbase client.
    *   Calls `langbase.pipes.create()` to create a new pipe agent named `ai-support-agent`.
    *   Defines an initial system message for the agent, instructing it to be helpful and provide accurate information.

*   **`agents.ts`**:
    *   `runMemoryAgent(query: string)`:
        *   Takes a user query.
        *   Calls `langbase.memories.retrieve()` to fetch the `topK` (e.g., 4) most relevant document chunks from the `knowledge-base` memory based on the query.
    *   `getSystemPrompt(chunks: MemoryRetrieveResponse[])`:
        *   Constructs a dynamic system prompt for the LLM.
        *   This prompt includes base instructions for the AI assistant and then injects the text from the `chunks` retrieved by `runMemoryAgent` as context.
        *   Crucially, it instructs the AI to ONLY answer from the provided CONTEXT and to cite sources from the chunks.
    *   `runAiSupportAgent({ chunks, query })`:
        *   Takes the retrieved `chunks` and the original `query`.
        *   Calls `langbase.pipes.run()` to execute the `ai-support-agent` pipe.
        *   Sends the dynamically generated system prompt (containing the context chunks) and the user query to the pipe.
        *   Returns the LLM's completion.

*   **`index.ts`**:
    *   The main entry point that orchestrates the RAG flow:
        1.  Defines a sample query.
        2.  Calls `runMemoryAgent` to retrieve relevant context.
        3.  Calls `runAiSupportAgent` with the context and query to generate the final answer.
        4.  Logs the answer to the console.

## Key Technologies

*   **Langbase**: Platform for building AI applications, used here for:
    *   **Memory**: Vector store for document chunks and semantic retrieval.
    *   **Pipes**: Configurable LLM chains acting as AI agents.
*   **TypeScript**: For type-safe JavaScript development.
*   **Node.js**: JavaScript runtime environment.
*   **dotenv**: For managing environment variables from a `.env` file.