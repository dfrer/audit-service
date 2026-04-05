# Local / Self-Hosted AI -- Practical Patterns and Pitfalls
## Patterns That Work, Patterns That Fail, How to Choose

### Stack Patterns That Work

#### Minimal Local Stack
- **Components:** Ollama + 2-3 models + simple CLI
- **Good for:** Developers who want private AI assistance, casual local usage
- **Maintenance:** Low -- just `ollama pull` and update once in a while
- **Hardware:** CPU-only works for small models, GPU recommended for 7B+

#### Local Web Interface Stack
- **Components:** Ollama + Open WebUI + 3 models
- **Good for:** Non-technical users who want a ChatGPT-like experience locally
- **Maintenance:** Medium -- web UI updates, model management
- **Hardware:** GPU recommended for anything beyond 3B parameter models

#### Local Development Stack
- **Components:** Cursor with local model provider + Ollama
- **Good for:** Developers who want private code assistance
- **Maintenance:** Low-medium
- **Hardware:** GPU recommended for coding models (CodeLlama, Qwen Coder)

#### Local RAG Stack
- **Components:** Ollama + embeddings model + vector DB + application layer
- **Good for:** Document search, knowledge base querying
- **Maintenance:** High -- vector DB management, embedding updates, application code
- **Hardware:** Significant RAM + GPU recommended

### Common Pitfalls

1. **The Download Spiral:** Downloading every new model that gets announced. Using none of them.
2. **The GPU Delusion:** Running a 70B model on 8GB RAM and blaming the model instead of the hardware.
3. **The Setup Graveyard:** Three different model runners installed, each from a different time you were going to "get serious about local AI."
4. **The Maintenance Gap:** It worked when you set it up. A driver update broke it. You have not fixed it in 3 weeks.
5. **The Privacy Fallacy:** Running local but also using cloud tools for the same tasks with no clear security boundary.
6. **The Benchmark Trap:** Choosing models based on benchmark scores instead of actual task performance.

### Decision Guide

**Start with Ollama if:** You want something that just works for local models.

**Add Open WebUI if:** You or your team wants a chat interface, not a CLI.

**Only consider vLLM if:** You need production-scale serving with high throughput.

**Do NOT try all at once:** Pick one runner. Get it working. Add complexity only when needed.

### Maintenance Checklist

- Weekly: Test that your models still load and respond
- Monthly: Update models if newer versions exist, note any behavior changes
- Quarterly: Review which models you actually use vs have downloaded
- Before driver/OS updates: Document your working config, be ready to reinstall
- Always: Keep a document with setup steps that worked
