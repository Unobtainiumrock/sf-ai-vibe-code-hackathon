# 🚀 AHA Development Roadmap (Simplified)

## ✅ **COMPLETED: Environment Setup**
- ✅ Project structure created
- ✅ Backend dependencies installed (Poetry)
- ✅ Frontend dependencies installed (npm)
- ✅ Zypher Agent setup complete (Deno) - **SIMPLIFIED (no Firecrawl)**
- ✅ All prerequisite tools ready

## 🎯 **NEXT: Immediate Action Items**

### **Step 1: Configure API Keys (CRITICAL - 5 minutes)**
Edit your `.env` file with real API keys:

```bash
# Edit this file NOW:
nano .env

# You need these keys (Firecrawl removed):
LANGSMITH_API_KEY=ls_...     # Get from https://smith.langchain.com/
OPENAI_API_KEY=sk-...        # Get from https://platform.openai.com/api-keys
GITHUB_TOKEN=ghp_...         # Get from https://github.com/settings/tokens
ANTHROPIC_API_KEY=sk-ant-... # Get from https://console.anthropic.com/ (for Zypher)
```

### **Step 2: Start Development Servers (5 minutes)**

**Terminal 1 - Backend:**
```bash
./run_backend.sh
# Should start on http://localhost:8000
```

**Terminal 2 - Frontend:**
```bash
./run_frontend.sh  
# Should start on http://localhost:3000
```

**Terminal 3 - Test Zypher Target (Optional):**
```bash
cd target_system
export ANTHROPIC_API_KEY=your_key_here
deno task dev
# Should run the multi-agent research team
```

### **Step 3: Test the Full Demo Flow (10 minutes)**

**3.1 Verify Dashboard:**
- Open http://localhost:3000
- Should see empty AHA dashboard

**3.2 Inject Test Failure:**
```bash
# In Terminal 4:
cd backend
python demo/inject_failure.py
```

**3.3 Watch AHA in Action:**
- AHA should detect the failure
- Analyze with LLM
- Create GitHub issue
- Update dashboard
- Refresh http://localhost:3000 to see incident

## 🛠 **Development Priorities**

### **Phase 1: Core Demo (Next 2-4 hours)**
1. **Fix any startup issues**
   - Debug API key configurations
   - Resolve import/dependency errors
   - Test webhook connectivity

2. **Enhance the demo narrative**
   - Improve failure scenarios (JSON parsing errors)
   - Polish the dashboard UI
   - Add real-time updates

3. **Test end-to-end flow**
   - Mock Zypher → LangSmith → AHA → GitHub → Dashboard
   - Ensure reliable demo experience

### **Phase 2: CoreSpeed Integration (Next 4-6 hours)**
1. **Create CoreSpeed UI mockups**
   - Design "Agent Health" dashboard
   - Show AHA toggle in workflow builder
   - Create integrated incident views

2. **Build CoreSpeed API integration**
   - Mock CoreSpeed workspace context
   - Simulate workflow deployment
   - Add CoreSpeed-themed components

3. **Enhanced demo story**
   - Show workflow creation in "CoreSpeed"
   - Demonstrate native integration
   - Highlight enterprise value

### **Phase 3: Hackathon Presentation (Final 2 hours)**
1. **Polish the demo**
   - Rehearse the 3-minute flow
   - Prepare backup scenarios
   - Test on presentation setup

2. **Create presentation materials**
   - Slides showing strategic value
   - Architecture diagrams
   - Business impact metrics

## 🚨 **Potential Issues & Solutions**

### **Common Startup Problems:**
- **"Module not found"**: Run `poetry install` in backend/
- **"Command not found: deno"**: Add to PATH: `export PATH="$HOME/.deno/bin:$PATH"`
- **API errors**: Check .env file has real API keys
- **Port conflicts**: Kill existing processes on 8000/3000

### **Demo Day Risks:**
- **API rate limits**: Have backup recorded demo
- **Network issues**: Test offline fallbacks
- **Timing issues**: Practice the flow multiple times

## 🎯 **Success Metrics**

**Technical Demo:**
- [ ] Backend starts without errors
- [ ] Frontend displays dashboard
- [ ] AHA detects and analyzes failures
- [ ] GitHub issues created automatically
- [ ] Dashboard updates in real-time

**Strategic Demo:**
- [ ] Clear CoreSpeed integration story
- [ ] Compelling business value narrative
- [ ] Smooth 3-minute presentation flow
- [ ] Audience understands enterprise impact

## 🚀 **Ready to Start!**

Your next command should be:
```bash
# Start with API key setup:
nano .env
```

Then launch the servers and test the demo flow!

## 📝 **Simplified Architecture Benefits**

**Removed Firecrawl dependencies for:**
- ✅ Faster setup and fewer API keys needed
- ✅ More reliable demo (no external web crawling)
- ✅ Clearer failure scenarios (JSON parsing errors)
- ✅ Focused on core AHA intelligence
- ✅ Better hackathon presentation reliability
