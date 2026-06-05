# Project Roadmap

This roadmap separates what is **implemented today** (algorithm prototype) from the **future vision** (full operational system).

---

## Implemented (Current Scope)

- [x] N-ary tree for administrative hierarchy
- [x] Adjacency-list graph for road networks
- [x] Dijkstra shortest-path routing
- [x] Greedy multi-shelter capacity allocation
- [x] Interactive CLI engine
- [x] JSON stream mode for web integration
- [x] Sample Maharashtra scenario dataset
- [x] ReliefRoute prototype dashboard (visual layer)

---

## Prototype / Partial

- [ ] Production authentication (current: development-only login)
- [ ] Persistent database for state and activity logs
- [ ] Automated test suite for engine scenarios
- [ ] CI pipeline (compile + sample scenario run)
- [ ] GIS map integration (network view uses static layout)

---

## Planned (Full-System Vision)

- [ ] Real-time disaster feed ingestion
- [ ] Dynamic road closure / capacity updates
- [ ] Multi-zone concurrent evacuation
- [ ] Role-based access (coordinator, field operator, viewer)
- [ ] Cloud deployment with horizontal scaling
- [ ] Mobile-friendly field operator interface
- [ ] Integration with external emergency management APIs

---

## Version Milestones

| Version | Target | Focus |
|---------|--------|-------|
| `v0.1` | Current | Algorithm engine + academic documentation |
| `v0.2` | Next | Tests, Makefile/CI, deduplicated codebase |
| `v0.5` | Future | Auth, persistence, deployment |
| `v1.0` | Vision | Production-ready emergency coordination platform |
