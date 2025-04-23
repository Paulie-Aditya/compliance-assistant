# Compliance Assistant

A simple compliance assistant that leverages AI to help users search and filter supplier risk information through a chat interface.

## Overview

This application provides a chat interface powered by the Vercel AI SDK that allows users to query a database of supplier risk information. Users can ask questions about suppliers based on risk scores, industries, locations, and risk categories, and the assistant will retrieve and present the relevant information.

## Live Demo

[Link to deployed application](https://compliance-assistant-gemini.vercel.app/)

## Features

- AI-powered chat interface for natural language queries
- Tool calling implementation for supplier risk database searches
- Responsive design that works across devices
- Real-time feedback during AI processing and tool execution
- Ability to handle complex queries about supplier risk data

## Technology Stack

- **Frontend**: Next.js 14 with App Router
- **AI Integration**: Vercel AI SDK
- **Styling**: TailwindCSS
- **Deployment**: Vercel
- **LLM**: Gemini API

## Setup Instructions

### Prerequisites

- Node.js (v18.0.0 or higher)
- npm or yarn
- Gemini API key

### Local Development

1. Clone this repository:

   ```bash
   git clone https://github.com/your-username/compliance-assistant.git
   cd compliance-assistant
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env.local` file in the root directory with the following variables:

   ```
   GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key
   ```

4. Start the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

### Deployment

1. Fork this repository to your GitHub account.
2. Create a new project on Vercel and link it to your GitHub repository.
3. Configure the environment variables in the Vercel dashboard:
   - `GOOGLE_GENERATIVE_AI_API_KEY`: Your Gemini API key
4. Deploy the application.

## Architecture and Design Decisions

### Overall Architecture

The application follows a modern Next.js architecture with the following key components:

1. **Frontend**: React components organized in a modular fashion to handle the chat interface, message display, and user input.
2. **API Layer**: Next.js API routes that handle communication with the LLM and process tool calls.
3. **Tools Layer**: Custom-built tool implementations that connect to the mock database.
4. **Data Layer**: Mock supplier database with query functionality.

```
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.tsx               # API endpoint for chat interactions
│   ├── page.tsx                        # Main page with chat interface
│   └── layout.tsx                      # Application layout
├── components/
│   ├── chat.tsx                        # Chat container component
│   ├── chat-message.tsx                # Message display component
│   └── supplier-card.tsx               # Supplier information display component
├── lib/
│   ├── tools/
│   │   └── supplier-search-tool.tsx    # Tool implementation
│   └── data/
│   │    ├── suppliers.tsx              # Mock supplier data
│   │    └── supplier-queries.tsx       # Query functions for supplier data
│   ├── types.ts                        # Definition of all types
│   ├── utils.ts                        # Utility functions

```

### Design Decisions

1. **Vercel AI SDK**: Chosen for its streamlined approach to building AI applications and native support for streaming responses and tool calling.

2. **Mock Database**: Instead of using an actual database, I implemented a mock in-memory database using TypeScript. This approach provides a clean way to demonstrate the functionality without the overhead of setting up and managing a real database service.

3. **Tool Calling Implementation**: Defined a clear schema for the supplier search tool that allows the AI to understand what data it can query and how. The implementation focuses on parsing natural language queries and converting them into structured data queries.

4. **Error Handling**: Implemented comprehensive error handling at various levels:

   - Input validation to prevent injection attacks
   - Query validation to ensure valid operations
   - Result validation to provide meaningful feedback

5. **UI/UX Considerations**:
   - Clear visual distinction between user messages, AI responses, and tool outputs
   - Loading indicators during AI processing and tool execution
   - Responsive design that works well on mobile and desktop

## Tool Implementation: Supplier Risk Search

The Supplier Risk Search tool allows users to query a database of fictional suppliers based on various attributes including risk scores, industries, locations, and risk categories.

### Tool Features

- **Search by Risk Score**: Find suppliers with specific risk scores or ranges
- **Filter by Industry**: Query suppliers in specific industries
- **Filter by Location**: Search suppliers by geographical location
- **Risk Category Analysis**: Identify suppliers with specific risk categories
- **Sorting and Ranking**: Sort suppliers by risk score or other attributes

### Implementation Details

The tool is implemented as a function that takes a structured query object and returns matching supplier data. The function:

1. Parses the natural language query using the LLM's capability
2. Converts the parsed query into filter operations on the mock database
3. Executes the query against the mock supplier data
4. Formats the results for display in the chat interface

### Security Considerations

- All user inputs are validated before processing
- Query parameters are strictly typed to prevent injection
- Only read operations are permitted on the database
- Error handling is implemented to prevent exposing sensitive information

## Limitations and Future Improvements

- **Query Complexity**: The current implementation handles basic queries well but could be enhanced to support more complex filtering and sorting
- **Persistent Storage**: Replace the mock database with a real database for production use
- **User Authentication**: Add user authentication for access control
- **Export Functionality**: Allow users to export query results
- **Visualization**: Add charts and graphs to visualize supplier risk data

## License

MIT
