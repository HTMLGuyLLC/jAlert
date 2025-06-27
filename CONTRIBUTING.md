# Contributing to jAlert

Thank you for your interest in contributing to jAlert! This guide will help you get started with contributing to the project.

## 🎯 Ways to Contribute

- **🐛 Bug Reports** - Help us identify and fix issues
- **💡 Feature Requests** - Suggest new functionality
- **📝 Documentation** - Improve docs, examples, and guides
- **🔧 Code Contributions** - Fix bugs, add features, improve performance
- **🧪 Testing** - Help improve test coverage and reliability
- **🎨 Design** - Improve UI/UX, themes, and visual elements

## 🚀 Getting Started

### Prerequisites

- **Node.js 14+** and **npm 6+**
- **Git** for version control
- **Modern browser** for testing
- Basic knowledge of **JavaScript**, **jQuery**, and **CSS**

### Setup Development Environment

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/jAlert.git
   cd jAlert
   ```

3. **Add upstream remote**:
   ```bash
   git remote add upstream https://github.com/HTMLGuyLLC/jAlert.git
   ```

4. **Install dependencies**:
   ```bash
   npm install
   ```

5. **Start development**:
   ```bash
   npm run dev  # Starts webpack in watch mode
   ```

6. **Open the demo** in your browser:
   ```bash
   open index.html  # macOS
   # or just open index.html in your browser
   ```

## 🔧 Development Workflow

### Project Structure

```
jAlert/
├── src/                    # Source files
│   ├── jAlert.js          # Main plugin file
│   ├── jAlert.css         # Styles
│   └── jAlert-functions.js # Utility functions
├── dist/                   # Built files (auto-generated)
├── tests/                  # Test files
│   ├── unit/              # Unit tests
│   ├── e2e/               # End-to-end tests
│   └── visual/            # Visual regression tests
├── index.html             # Demo and documentation
├── CHANGELOG.md           # Version history
└── README.md              # Project overview
```

### Development Commands

```bash
# Development
npm run dev          # Watch mode with auto-rebuild
npm run build        # Production build

# Testing
npm test             # Run unit tests
npm run test:e2e     # Run end-to-end tests
npm run test:all     # Run all tests

# Linting & Formatting
npm run lint         # Check code style (if configured)
npm run format       # Format code (if configured)
```

### Making Changes

1. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/bug-description
   ```

2. **Make your changes** following the coding standards below

3. **Test your changes**:
   ```bash
   npm test
   npm run build
   # Test manually in the browser using index.html
   ```

4. **Commit your changes**:
   ```bash
   git add .
   git commit -m "feat: add new resize functionality"
   # or
   git commit -m "fix: resolve blurBackground error in async scenarios"
   ```

## 📝 Coding Standards

### JavaScript Style

- **ES5 Compatible** - Code must work in IE11+
- **jQuery Patterns** - Follow jQuery plugin conventions
- **Defensive Programming** - Always check for null/undefined
- **Method Chaining** - Return `this` for chainable methods
- **Consistent Naming** - Use camelCase for variables and methods

#### Example:
```javascript
// Good
myMethod(param) {
    if (!this.instance || !param) return this;
    
    // Do something
    this.instance.addClass('my-class');
    
    return this; // Enable chaining
}

// Bad
myMethod(param) {
    this.instance.addClass('my-class'); // No safety checks
    // No return statement
}
```

### CSS Style

- **BEM-like Naming** - Use `.ja_` prefix for all classes
- **Mobile-First** - Use min-width media queries
- **Modular Approach** - Group related styles together
- **Cross-Browser** - Test in all supported browsers

#### Example:
```css
/* Good */
.ja_modal {
    /* Base styles */
}

.ja_modal__header {
    /* Header styles */
}

.ja_modal--large {
    /* Modifier styles */
}

/* Bad */
.modal { /* Too generic */
    /* styles */
}
```

### Documentation

- **JSDoc Comments** - Document all public methods
- **Inline Comments** - Explain complex logic
- **README Updates** - Update docs for new features
- **Examples** - Provide working code examples

#### Example:
```javascript
/**
 * Resize the modal to fit content
 * @param {number|string} [height] - Specific height or auto-fit if not provided
 * @returns {Object} - Returns this for chaining
 */
resizeModal(height) {
    // Implementation
}
```

## 🧪 Testing Guidelines

### Writing Tests

- **Unit Tests** - Test individual functions and methods
- **Integration Tests** - Test component interactions
- **E2E Tests** - Test complete user workflows
- **Visual Tests** - Ensure UI consistency

### Test Structure

```javascript
describe('Feature Name', () => {
    test('should do something specific', async () => {
        // Arrange
        const options = { title: 'Test' };
        
        // Act
        $.jAlert(options);
        const alert = await testUtils.waitForElement('.jAlert');
        
        // Assert
        expect(alert.find('.ja_title').text()).toBe('Test');
    });
});
```

### Test Requirements

- **All new features** must have tests
- **Bug fixes** must include regression tests
- **Tests must pass** before submitting PR
- **JSDOM compatibility** - Tests run in Node.js environment

## 📋 Pull Request Process

### Before Submitting

1. **Sync with upstream**:
   ```bash
   git fetch upstream
   git rebase upstream/master
   ```

2. **Run all tests**:
   ```bash
   npm test
   npm run test:all
   ```

3. **Build and verify**:
   ```bash
   npm run build
   # Test the built files manually
   ```

4. **Update documentation** if needed:
   - Update README.md for new features
   - Add examples to index.html
   - Update CHANGELOG.md

### Submitting Your PR

1. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

2. **Create Pull Request** on GitHub with:
   - **Clear title** describing the change
   - **Detailed description** of what was changed and why
   - **Screenshots** for UI changes
   - **Breaking changes** clearly marked
   - **Testing instructions** for reviewers

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests pass
- [ ] E2E tests pass
- [ ] Manual testing completed
- [ ] Browser compatibility verified

## Screenshots (if applicable)
Add screenshots for UI changes

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] Tests added/updated
```

## 🐛 Bug Reports

### Before Reporting

1. **Search existing issues** to avoid duplicates
2. **Test with latest version**
3. **Reproduce in minimal example**
4. **Check browser compatibility**

### Bug Report Template

```markdown
**Bug Description**
Clear description of the bug

**Steps to Reproduce**
1. Step one
2. Step two
3. Step three

**Expected Behavior**
What should happen

**Actual Behavior**
What actually happens

**Environment**
- jAlert version: 
- jQuery version:
- Browser: 
- OS:

**Code Example**
```javascript
// Minimal code to reproduce
$.jAlert({
    // options
});
```

**Additional Context**
Any other relevant information
```

## 💡 Feature Requests

### Before Requesting

1. **Check existing issues** and discussions
2. **Consider if it fits** the project scope
3. **Think about backward compatibility**
4. **Consider implementation complexity**

### Feature Request Template

```markdown
**Feature Description**
Clear description of the proposed feature

**Use Case**
Why is this feature needed? What problem does it solve?

**Proposed Solution**
How should this feature work?

**Alternative Solutions**
Any alternative approaches considered?

**Additional Context**
Mockups, examples, or related issues
```

## 🎨 Design Contributions

### UI/UX Improvements

- **Maintain consistency** with existing design
- **Consider accessibility** (contrast, focus states)
- **Test on multiple devices** and screen sizes
- **Provide mockups** or prototypes when possible

### Theme Contributions

- **Follow existing pattern** for theme structure
- **Ensure readability** and accessibility
- **Test with all modal types** (alerts, images, slideshows)
- **Provide both light and dark variants** if applicable

## 📚 Documentation Contributions

### Types of Documentation

- **API Documentation** - Method signatures and parameters
- **Usage Examples** - Real-world code examples
- **Tutorials** - Step-by-step guides
- **Migration Guides** - Help users upgrade versions

### Documentation Standards

- **Clear and concise** language
- **Working code examples** that can be copy-pasted
- **Screenshots** for visual features
- **Cross-references** to related features

## 🤝 Community Guidelines

### Code of Conduct

- **Be respectful** and inclusive
- **Provide constructive feedback**
- **Help newcomers** get started
- **Focus on the code**, not the person

### Communication

- **Use GitHub Issues** for bugs and feature requests
- **Use GitHub Discussions** for questions and ideas
- **Use Gitter** for real-time chat
- **Be patient** with response times

## 🏆 Recognition

Contributors are recognized in several ways:

- **GitHub Contributors** page
- **CHANGELOG.md** mentions for significant contributions
- **Special thanks** in release notes
- **Maintainer status** for consistent, quality contributions

## 📞 Questions?

- **GitHub Discussions** - For general questions
- **GitHub Issues** - For specific bugs or features
- **Gitter Chat** - For real-time help

Thank you for contributing to jAlert! 🎉 