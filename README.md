# n8n-nodes-learningsuite

![n8n](https://img.shields.io/badge/n8n-1.107.3+-brightgreen)
![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

A n8n node that integrates with the **LearningSuite API**, enabling seamless automation workflows with your LearningSuite instance.

## What is n8n?

n8n is an easy-to-use workflow automation tool that lets you connect different web applications like LearningSuite. By creating workflows between apps, you can automate many manual tasks, saving you and your team significant time and effort.

## ⚖️ Legal Notice

This node uses the public LearningSuite API and is not affiliated with, endorsed by, or sponsored by LearningSuite. All trademarks belong to their respective owners.

**Note**: This is a community-developed node for the LearningSuite API. For official support, please contact LearningSuite directly.

## 🚀 Features

- **11 Resources** fully supported (Member, Course, Group, Bundle, Hub, Module, Community, Popup, Webhook, Role, API Call)
- **57+ Operations** for maximum flexibility
- **Webhook Trigger** with 11 event types for real-time automation
- **TypeScript** implementation for best developer experience
- **Flexible API Call** resource for custom endpoints

## 📋 Supported Operations

### 👤 **Member** (15 Operations)
- Get by Email, Get by ID, Get All, Create, Update, Delete
- Activate/Deactivate, Add/Remove Courses, Add/Remove Bundles
- Get Courses, Get Course Info, Get Bundles, Find or Create

### 📚 **Course** (7 Operations)
- Get Published, Get Modules, Get Modules for Member
- Get Members, Get Access Requests, Get Submissions, Create Lesson

### 👥 **Group** (11 Operations)
- Get All, Create, Delete, Find by Name, Find or Create
- Add/Remove Members, Get/Add/Remove Courses, Add Bundles

### 📦 **Bundle** (2 Operations)
- Get All, Get Members

### 🏠 **Hub** (5 Operations)
- Get All, Get Templates, Create, Add/Remove Access

### 📖 **Module** (3 Operations)
- Get Lessons, Get Sections, Create Unlock Override

### 💬 **Community** (2 Operations)
- Get Areas, Get Forums

### 🎯 **Popup** (4 Operations)
- Get All, Get, Trigger for Member, Remove Trigger for Member

### 🔗 **Webhook** (6 Operations)
- Get/Create/Update/Delete Subscriptions, Get Sample Data

### 🛠️ **API Call** (1 Operation)
- Make Request (for any custom API calls)

## 🎣 Webhook Trigger Events

The LearningSuite Trigger supports the following events:

- ✅ **Lesson Completed** - When a lesson is completed
- ✅ **Progress Changed** - On progress updates
- ✅ **Feedback Created** - New feedback received
- ✅ **New Login** - New user login
- ✅ **Exam Completed** - Exam completion
- ✅ **Exam Graded** - Exam graded
- ✅ **Custom Popup Interaction** - Popup interaction
- ✅ **Community Post Created** - New community post
- ✅ **Community Post Moderated** - Community post moderated
- ✅ **Group User Access Changed** - Group access changed
- ✅ **Member Not Logged In for X Days** - User inactivity

## 💡 Use Case Examples

### Automated Member Management
Automatically create new members from a list in Google Sheets, eliminating the need to manually create users in LearningSuite.

### E-Commerce Integration  
Connect tools like Copecart via webhooks through n8n and sell your LearningSuite courses in your own online shop.

### Lead Generation
Connect website forms and automatically grant users who fill out the form access to info products in LearningSuite.

### Progress Monitoring
Automatically monitor your participants' learning progress and send personalized reminders or congratulations.

## 🛠️ Installation

### Option 1: n8n Nodes (Recommended)

1. Open your n8n instance
2. Go to **Settings** → **Nodes**
3. Install: `n8n-nodes-learningsuite`
4. Restart n8n

### Option 2: Manual Installation

```bash
# In your n8n project directory
npm install n8n-nodes-learningsuite

# Restart n8n
npm start
```

### Option 3: Docker

```bash
# With Docker Environment Variable
docker run -it --rm \
  --name n8n \
  -p 5678:5678 \
  -e N8N_CUSTOM_EXTENSIONS="/data/custom" \
  -v ~/.n8n:/data \
  docker.n8n.io/n8nio/n8n
```

## 🔐 Authentication Setup

### Generate API Key

1. Log into your **LearningSuite instance**
2. Go to **Settings** → **Integrations**
3. Click **"Generate API Key"**
4. Copy the generated API key

### Configure Credentials in n8n

1. Open n8n and go to **Credentials**
2. Click **"New Credential"**
3. Search for **"LearningSuite API"**
4. Fill in the following fields:
   - **API Key**: Your generated API key
   - **Base URL**: `https://api.learningsuite.io/api/v1` (default)
5. Test the connection and save

## 📖 Usage

### Basic Member Operation

```
1. Add a "LearningSuite" node
2. Select Resource: "Member"
3. Select Operation: "Get by Email" 
4. Enter the email address
5. Execute the workflow
```

### Webhook Trigger Setup

```
1. Add a "LearningSuite Trigger" node
2. Select the desired event (e.g., "Lesson Completed")
3. Configure optional filters
4. Activate the workflow
5. The webhook will be automatically registered with LearningSuite
```

## 🔧 API Reference

This node is based on **LearningSuite API v1.9.0** and supports all publicly available endpoints.

**Base URL**: `https://api.learningsuite.io/api/v1`

**Authentication**: API Key via `x-api-key` header

Full API documentation available at: [LearningSuite API Docs](https://api.learningsuite.io/api/v1/docs/)

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

### Development Setup

```bash
# Clone the repository
git clone https://github.com/redhat030/n8n-nodes-learningsuite.git
cd n8n-nodes-learningsuite

# Install dependencies
npm install

# Compile TypeScript
npm run build

# Run tests
npm test
```

### Pull Request Guidelines

1. **Fork** the repository
2. Create a **Feature Branch** (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. Open a **Pull Request**

### Code Style

- TypeScript for all new features
- Follow ESLint configuration
- Add tests for new functionality
- Update documentation

## 📝 Changelog

### Version 1.0.0 (2025-08-23)

#### 🎉 Initial Release
- ✅ Complete LearningSuite API integration
- ✅ 11 resources with 57+ operations
- ✅ Webhook trigger with 11 event types
- ✅ TypeScript implementation
- ✅ Comprehensive error handling
- ✅ "Find or Create" logic for Members and Groups
- ✅ Flexible parameter configuration
- ✅ API Call resource for custom endpoints

## 🛠️ Compatibility

- **n8n Version**: 1.107.3+ (tested with latest)
- **Node Version**: 14+ 
- **TypeScript**: 4.0+

## 📄 License

This project is licensed under the [MIT License](LICENSE).

## ❓ Support

### Report Issues
For bugs or feature requests, please create a [GitHub Issue](https://github.com/redhat030/n8n-nodes-learningsuite/issues).

### FAQ

**Q: Can I use multiple LearningSuite instances?**  
A: Yes, simply create multiple credentials with different API keys and base URLs.

**Q: Are all API endpoints supported?**  
A: The node covers all public API v1.9.0 endpoints. For special endpoints, use the "API Call" resource.

**Q: How do I find my LearningSuite API base URL?**  
A: The default URL is `https://api.learningsuite.io/api/v1`. For custom domains, contact your LearningSuite administrator.

**Q: What authentication method is used?**  
A: The node uses API key authentication via the `x-api-key` header. Generate your key in LearningSuite Settings → Integrations.

**Q: Can I filter webhook events?**  
A: Yes, most webhook events support filtering by various parameters like course ID, group ID, etc.

---

⭐ **Like this node?** Give us a star on GitHub!

💡 **Feature request?** Open an issue - we're always open to improvements!

## 📋 Disclaimer

This unofficial node is not affiliated with, endorsed by, or sponsored by LearningSuite. It uses only the publicly available LearningSuite API in accordance with their terms of service.

**Important Notes:**
- This node is developed and maintained independently
- For LearningSuite API issues, contact official LearningSuite support
- All LearningSuite trademarks and logos belong to LearningSuite
- This node merely provides an interface to the public API