# Contributing to FixMate AI

Thank you for choosing to contribute to **FixMate AI**! We welcome bug fixes, documentation, feature additions, and user suggestions.

## Getting Started

1. **Fork the Repository**: Create a personal copy of the repository.
2. **Clone the Forked Repo**:
   ```bash
   git clone https://github.com/Muddassirsayyed/Open-Source-Hackathon-Elite-Coders-.git
   ```
3. **Set Up Environments**: Follow the setup instructions in [DEPLOYMENT.md](file:///d:/open%20source%20hackathon/DEPLOYMENT.md).

## Development Workflow

1. Create a descriptive feature branch:
   ```bash
   git checkout -b feature/your-awesome-feature
   ```
2. Write clean code conforming to the repository layout:
   * Maintain ESLint and TypeScript rules in `client/`.
   * Keep ESM import declarations clean in `server/`.
3. Verify changes build successfully before pushing:
   ```bash
   # Inside client/
   npm run build
   ```

## Creating Pull Requests

* Provide a concise, clear description of what the PR resolves.
* Reference related issue tickets if applicable.
* Maintain commits with clear messages (e.g. `feat: add booking notifications`, `fix: resolving map layout alignment`).
* Ensure all workflow checks pass before request reviews.
