# AHA System Architecture Diagrams

## 1. High-Level System Overview

```mermaid
graph TB
    subgraph "Target System (Multi-Agent Research Team)"
        PA[PlannerAgent]
        RA1[ResearcherAgent 1]
        RA2[ResearcherAgent 2]
        SA[SynthesizerAgent]
        
        PA --> RA1
        PA --> RA2
        RA1 --> SA
        RA2 --> SA
    end
    
    subgraph "Observability Layer"
        LS[LangSmith]
    end
    
    subgraph "AHA System"
        subgraph "Backend (FastAPI)"
            WH[Webhook Endpoint]
            DS[Diagnosis Service]
            GS[GitHub Service]
            LSS[LangSmith Service]
            MS[Memory Store]
        end
        
        subgraph "Frontend (React)"
            DASH[Dashboard UI]
            API_CLIENT[API Client]
        end
    end
    
    subgraph "External Services"
        LLM[OpenAI/Claude LLM]
        GH[GitHub API]
    end
    
    %% Data Flow
    PA -.->|traces| LS
    RA1 -.->|traces| LS
    RA2 -.->|traces| LS
    SA -.->|traces| LS
    
    LS -->|webhook on error| WH
    WH --> LSS
    LSS -->|fetch trace| LS
    LSS --> DS
    DS -->|analyze| LLM
    DS --> GS
    GS -->|create issue| GH
    DS --> MS
    
    %% Frontend/Backend Interface
    DASH --> API_CLIENT
    API_CLIENT -->|HTTP requests| WH
    WH -->|incident data| API_CLIENT
    API_CLIENT --> DASH
```

## 2. Detailed Backend Architecture

```mermaid
graph TB
    subgraph "FastAPI Backend"
        subgraph "API Layer"
            WH[webhooks.py<br/>POST /webhook/langsmith]
            INC[incidents.py<br/>GET /api/incidents]
        end
        
        subgraph "Core Services"
            DS[diagnosis_service.py<br/>LLM Analysis]
            GS[github_service.py<br/>Issue Creation]
            LSS[langsmith_service.py<br/>Trace Retrieval]
        end
        
        subgraph "Data Layer"
            MS[memory_store.py<br/>In-Memory Storage]
            CONFIG[config.py<br/>Pydantic Settings]
        end
        
        subgraph "Models"
            IM[incident.py<br/>Data Schemas]
        end
    end
    
    subgraph "External APIs"
        LS_API[LangSmith API]
        LLM_API[OpenAI/Claude API]
        GH_API[GitHub API]
    end
    
    %% Internal connections
    WH --> LSS
    WH --> DS
    WH --> GS
    WH --> MS
    
    INC --> MS
    
    DS --> LLM_API
    GS --> GH_API
    LSS --> LS_API
    
    DS --> IM
    GS --> IM
    MS --> IM
    
    CONFIG -.->|configures| WH
    CONFIG -.->|configures| DS
    CONFIG -.->|configures| GS
    CONFIG -.->|configures| LSS
```

## 3. Frontend/Backend Interface Details

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend (React)
    participant B as Backend (FastAPI)
    participant LS as LangSmith
    participant LLM as OpenAI/Claude
    participant GH as GitHub
    
    Note over U,GH: Normal Operation Flow
    
    U->>F: Opens Dashboard
    F->>B: GET /api/incidents
    B->>F: Returns incident list
    F->>U: Displays incidents
    
    Note over U,GH: Failure Detection & Response
    
    LS->>B: POST /webhook/langsmith (error detected)
    B->>LS: GET /traces/{trace_id}
    LS->>B: Returns trace data
    B->>LLM: POST /chat/completions (analyze trace)
    LLM->>B: Returns diagnosis
    B->>GH: POST /repos/{owner}/{repo}/issues
    GH->>B: Returns issue URL
    B->>B: Store incident in memory
    B->>LS: 200 OK (webhook response)
    
    Note over U,GH: Real-time Updates
    
    U->>F: Refreshes dashboard
    F->>B: GET /api/incidents
    B->>F: Returns updated incident list
    F->>U: Shows new incident
```

## 4. Data Flow Architecture

```mermaid
flowchart TD
    subgraph "Input Sources"
        TARGET[Target System Agents]
        LS_WEBHOOK[LangSmith Webhook]
    end
    
    subgraph "AHA Backend Processing"
        WH_RECEIVE[Webhook Receiver]
        TRACE_FETCH[Trace Fetcher]
        LLM_ANALYZE[LLM Analyzer]
        ISSUE_CREATE[Issue Creator]
        STORE[Memory Store]
    end
    
    subgraph "Output Destinations"
        GH_ISSUE[GitHub Issue]
        DASHBOARD[Dashboard UI]
        BROWSER[Browser Storage]
    end
    
    subgraph "Frontend Components"
        API_CALLS[API Service Layer]
        INCIDENT_LIST[Incident List Component]
        INCIDENT_CARD[Incident Card Component]
    end
    
    %% Data Flow
    TARGET -->|traces| LS_WEBHOOK
    LS_WEBHOOK -->|error notification| WH_RECEIVE
    WH_RECEIVE --> TRACE_FETCH
    TRACE_FETCH --> LLM_ANALYZE
    LLM_ANALYZE --> ISSUE_CREATE
    LLM_ANALYZE --> STORE
    ISSUE_CREATE --> GH_ISSUE
    
    %% Frontend Data Flow
    STORE -->|via API| API_CALLS
    API_CALLS --> INCIDENT_LIST
    INCIDENT_LIST --> INCIDENT_CARD
    INCIDENT_CARD --> DASHBOARD
    DASHBOARD --> BROWSER
```

## 5. Component Interaction Map

```mermaid
graph LR
    subgraph "Frontend Layer"
        DASH[Dashboard]
        LIST[Incident List]
        CARD[Incident Card]
        API[API Client]
    end
    
    subgraph "Backend API Layer"
        WH[Webhook Handler]
        INC[Incidents API]
    end
    
    subgraph "Backend Service Layer"
        DS[Diagnosis Service]
        GS[GitHub Service]
        LSS[LangSmith Service]
    end
    
    subgraph "Backend Data Layer"
        MS[Memory Store]
        CONFIG[Configuration]
    end
    
    subgraph "External Systems"
        LS[LangSmith]
        LLM[LLM Provider]
        GH[GitHub]
    end
    
    %% Frontend to Backend
    DASH --> LIST
    LIST --> CARD
    LIST --> API
    API -->|HTTP GET| INC
    API -->|HTTP POST| WH
    
    %% Backend Internal
    WH --> DS
    WH --> GS
    WH --> LSS
    WH --> MS
    INC --> MS
    
    %% Backend to External
    DS --> LLM
    GS --> GH
    LSS --> LS
    
    %% Configuration
    CONFIG -.->|configures| WH
    CONFIG -.->|configures| DS
    CONFIG -.->|configures| GS
    CONFIG -.->|configures| LSS
```

## 6. Demo Flow Architecture

```mermaid
sequenceDiagram
    participant D as Demo Presenter
    participant T as Target System
    participant LS as LangSmith
    participant AHA as AHA Backend
    participant LLM as LLM Service
    participant GH as GitHub
    participant UI as Dashboard UI
    
    Note over D,UI: Demo Setup Phase
    
    D->>T: Start research system
    T->>LS: Send traces (normal operation)
    D->>UI: Show dashboard (empty)
    
    Note over D,UI: Failure Injection Phase
    
    D->>T: Inject JSON parsing error
    T->>LS: Send error trace
    LS->>AHA: Webhook notification
    AHA->>LS: Fetch full trace
    AHA->>LLM: Analyze trace
    LLM->>AHA: Return diagnosis
    AHA->>GH: Create GitHub issue
    AHA->>AHA: Store incident
    
    Note over D,UI: Resolution Phase
    
    D->>UI: Refresh dashboard
    UI->>AHA: GET /api/incidents
    AHA->>UI: Return incident data
    D->>GH: Show created issue
    D->>T: Apply suggested fix
    T->>LS: Send success traces
```

## 7. File Structure & Dependencies

```mermaid
graph TD
    subgraph "Project Root"
        ENV[.env]
        README[README.md]
    end
    
    subgraph "Backend Structure"
        MAIN[app/main.py]
        WH_FILE[app/api/webhooks.py]
        INC_FILE[app/api/incidents.py]
        DS_FILE[app/services/diagnosis_service.py]
        GS_FILE[app/services/github_service.py]
        LSS_FILE[app/services/langsmith_service.py]
        MS_FILE[app/storage/memory_store.py]
        CONFIG_FILE[app/core/config.py]
        MODEL_FILE[app/models/incident.py]
    end
    
    subgraph "Frontend Structure"
        APP[src/App.jsx]
        DASH_PAGE[src/pages/DashboardPage.jsx]
        INC_CARD[src/components/IncidentCard.jsx]
        API_SERVICE[src/services/api.js]
    end
    
    subgraph "Target System"
        RUN_SCRIPT[run_research_team.py]
        DEMO_SCENARIOS[demo_scenarios/]
    end
    
    %% Dependencies
    MAIN --> WH_FILE
    MAIN --> INC_FILE
    WH_FILE --> DS_FILE
    WH_FILE --> GS_FILE
    WH_FILE --> LSS_FILE
    WH_FILE --> MS_FILE
    INC_FILE --> MS_FILE
    
    DS_FILE --> MODEL_FILE
    GS_FILE --> MODEL_FILE
    MS_FILE --> MODEL_FILE
    
    WH_FILE --> CONFIG_FILE
    DS_FILE --> CONFIG_FILE
    GS_FILE --> CONFIG_FILE
    LSS_FILE --> CONFIG_FILE
    
    APP --> DASH_PAGE
    DASH_PAGE --> INC_CARD
    DASH_PAGE --> API_SERVICE
    
    ENV -.->|configures| CONFIG_FILE
```

## Key Interface Points

### Frontend ↔ Backend Interfaces:
1. **GET /api/incidents** - Frontend fetches incident list
2. **POST /webhook/langsmith** - LangSmith sends error notifications
3. **HTTP REST API** - Standard JSON over HTTP

### Backend ↔ External Services:
1. **LangSmith API** - Fetch trace data
2. **OpenAI/Claude API** - LLM analysis
3. **GitHub API** - Create issues

### Data Storage:
1. **In-Memory Store** - Fast demo storage
2. **Browser localStorage** - Frontend persistence fallback
