# Contributing to Public Works Blockchain Registry

First off, thank you for considering contributing to this project! It's people like you that make this tool better for everyone.

## Code of Conduct

This project and everyone participating in it is governed by our commitment to fostering an open and welcoming environment. By participating, you are expected to uphold this commitment.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues to avoid duplicates. When you create a bug report, include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples**
- **Describe the behavior you observed and what you expected**
- **Include screenshots if applicable**
- **Note your environment**: OS, Node.js version, Docker version

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, include:

- **Use a clear and descriptive title**
- **Provide a detailed description of the suggested enhancement**
- **Explain why this enhancement would be useful**
- **List any alternative solutions you've considered**

### Pull Requests

1. **Fork the repository** and create your branch from `main`
2. **Make your changes** following our coding standards
3. **Test your changes** thoroughly
4. **Update documentation** if needed
5. **Commit your changes** using descriptive commit messages
6. **Push to your fork** and submit a pull request

## Development Process

### Setting Up Your Development Environment

```bash
# Fork and clone the repository
git clone https://github.com/YOUR-USERNAME/obra-publica-blockchain.git
cd obra-publica-blockchain

# Install dependencies
cd scripts && npm install
cd ../api && npm install
cd ../frontend && npm install

# Start local blockchain
cd ~/besu-networks/docker/compose/local
docker-compose up -d

# Deploy contract
cd ~/obra-publica-blockchain/scripts
node deploy-contract.js
```

### Coding Standards

#### JavaScript/Node.js
- Use ES6+ syntax
- Follow consistent indentation (2 spaces)
- Use meaningful variable and function names
- Add comments for complex logic
- Handle errors appropriately

#### Solidity
- Follow [Solidity Style Guide](https://docs.soliditylang.org/en/latest/style-guide.html)
- Use NatSpec comments for functions
- Implement proper access control
- Include require() statements for validations

#### Frontend
- Write semantic HTML5
- Use CSS best practices
- Ensure responsive design
- Test in multiple browsers

### Commit Message Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types**:
- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Code style changes (formatting, etc)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples**:
```
feat(contract): add function to batch register projects
fix(api): resolve CORS issue with POST requests
docs(readme): update installation instructions
```

### Testing

Before submitting a pull request:

1. **Test smart contract functions**:
```bash
cd scripts
node test-contract.js
```

2. **Test API endpoints**:
```bash
# Start API
cd api && npm start

# In another terminal, test endpoints
curl http://localhost:3000/api/stats
curl http://localhost:3000/api/obras
```

3. **Test frontend**:
- Open http://localhost:8080
- Verify map loads correctly
- Test all interactive elements
- Check console for errors

### Documentation

- Update README.md if you change functionality
- Add JSDoc comments to new functions
- Update API documentation for new endpoints
- Include code examples where helpful

## Project Structure

```
obra-publica-blockchain/
├── api/              # REST API - Express server
├── contracts/        # Smart contracts - Solidity
├── frontend/         # Web interface - HTML/JS
├── scripts/          # Deployment and interaction scripts
├── data/             # Sample data and templates
└── docs/             # Additional documentation
```

## Branching Strategy

- `main`: Production-ready code
- `develop`: Integration branch for features
- `feature/*`: New features
- `fix/*`: Bug fixes
- `docs/*`: Documentation updates

### Creating a Feature Branch

```bash
git checkout -b feature/your-feature-name main
```

### Keeping Your Branch Updated

```bash
git checkout main
git pull upstream main
git checkout feature/your-feature-name
git rebase main
```

## Review Process

1. **Automated checks** must pass (if CI/CD is configured)
2. **Code review** by at least one maintainer
3. **Testing** on local environment
4. **Approval** before merging

## Areas for Contribution

### High Priority
- [ ] Implement IPFS integration for large data storage
- [ ] Add comprehensive test suite
- [ ] Improve error handling and user feedback
- [ ] Implement authentication system

### Medium Priority
- [ ] Create admin dashboard
- [ ] Add export to PDF functionality
- [ ] Implement real-time notifications
- [ ] Multi-language support (i18n)

### Good First Issues
- [ ] Improve UI/UX design
- [ ] Add more example projects
- [ ] Write tutorials and guides
- [ ] Fix typos in documentation

## Questions?

Don't hesitate to ask questions by:
- Opening an issue with the `question` label
- Reaching out to maintainers
- Checking existing documentation

## Recognition

Contributors will be recognized in:
- README.md acknowledgments
- Release notes
- Project documentation

Thank you for contributing to transparent and climate-resilient infrastructure! 🌍
