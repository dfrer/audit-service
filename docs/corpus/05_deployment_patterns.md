# Deployment Patterns
## Hosted vs Local vs Hybrid -- When Each Makes Sense

### Hosted (API / Cloud Services)

**Use when:**
- Rapid experimentation is priority
- No engineering resources for infrastructure
- Models change frequently
- Cost per token is acceptable
- Data is not sensitive
- You need the latest models immediately
- Variable usage patterns (spiky demand)

**Typical tools:** OpenAI API, Anthropic API, Google Gemini API, Groq, Together AI

**Cost model:** Pay per token / pay per request / monthly subscription
**Maintenance:** Near zero
**Privacy risk:** Higher -- your prompts go to someone else
**Performance:** Usually best latency due to optimized infrastructure

**Red flags for hosted:**
- You are processing sensitive data through cloud APIs
- Monthly API bill exceeds $500 and is growing without clear ROI
- You are rate-limited and cannot get higher tiers
- Your business logic is entirely dependent on one provider

### Local (Self-Hosted)

**Use when:**
- Data privacy is non-negotiable
- You have dedicated hardware (GPU)
- Usage is consistent and predictable
- You need full control over the model
- Cost at scale favors local (heavy usage)
- Regulatory requirements forbid cloud AI

**Typical tools:** Ollama, Open WebUI, LM Studio, vLLM, text-generation-webui

**Cost model:** Hardware investment + electricity + maintenance time
**Maintenance:** Medium to high
**Privacy risk:** Lowest -- data never leaves your machine
**Performance:** Depends on hardware, often slower but predictable

**Red flags for local:**
- You do not have a GPU or have an inadequate one
- You cannot afford downtime for maintenance
- Nobody on your team can manage the setup
- Your only use case is occasional casual usage

### Hybrid

**Use when:**
- Sensitive tasks need local, casual tasks can use cloud
- You want cost optimization (cheap queries local, complex queries hosted)
- You need fallback (if cloud is down, local still works or vice versa)
- Different team members need different tool tiers

**Typical patterns:**
- Local Ollama for coding + cloud Claude for writing
- Local embeddings + cloud LLM for RAG
- Cloud for production, local for experimentation
- Local for sensitive data processing, cloud for everything else

**Red flags for hybrid:**
- You cannot clearly define which tasks go where
- The routing logic between local and cloud is more complex than the benefit
- You are paying for both infrastructure and API bills with no clear division

### Decision Matrix

| Factor | Hosted | Local | Hybrid |
|--------|--------|-------|--------|
| Privacy | Low | High | Medium |
| Setup complexity | Low | High | Medium |
| Ongoing maintenance | Low | High | Medium |
| Upfront cost | Low | High | Medium |
| Per-unit cost | Medium | Low | Low |
| Model freshness | Latest | Delayed | Best of both |
| Reliability | Provider-dependent | Self-dependent | Redundant |

### Recommendation Approach

1. Classify the data sensitivity first -- if sensitive, local is default
2. Calculate current monthly hosted cost -- if > $200/month with consistent usage, evaluate local
3. Check team capability -- if nobody can manage local infrastructure, hosted or hybrid
4. Determine model requirements -- if you need the latest GPT/Claude, local cannot match
5. Start simple: hosted first, move to local or hybrid when justified by cost/privacy needs
