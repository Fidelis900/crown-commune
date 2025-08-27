# 🏰 Royal Kingdom Chat

A medieval-themed real-time chat application built with React, TypeScript, and Supabase.

## ✨ Features

### 🎭 **Royal Hierarchy System**
- **9 Rank Tiers**: From Peasant to King, each with unique privileges
- **XP Progression**: Gain experience and advance through the ranks
- **VIP Status**: Earl+ ranks unlock exclusive features

### 💬 **Real-time Chat**
- **Live Messaging**: Powered by Supabase real-time subscriptions
- **Channel Types**: Public, VIP, and Exclusive channels
- **Royal Decrees**: VIP members can send highlighted decree messages
- **Rank-based Access**: Higher ranks unlock exclusive channels

### 🎨 **Medieval Design**
- **Royal Theme**: Gold, purple, and deep blue color palette
- **Custom Fonts**: Cinzel display font and Crimson Text serif
- **Visual Effects**: Glowing animations, gradients, and royal shadows
- **Responsive**: Mobile-friendly medieval interface

### 🔐 **Authentication & Security**
- **Secure Auth**: Email/password authentication via Supabase
- **Row Level Security**: Database policies protect user data
- **Real-time Profiles**: User profiles with ranks, XP, and VIP status

## 🚀 Quick Start

1. **Sign Up**: Create your royal account at `/auth`
2. **Choose Your Name**: Pick a username worthy of the kingdom
3. **Join Channels**: Start chatting in public realms
4. **Gain XP**: Participate to advance your rank
5. **Unlock VIP**: Reach Earl rank for exclusive privileges

## 🎯 User Ranks

| Rank | Level | XP Required | VIP Status | Special Privileges |
|------|-------|-------------|------------|-------------------|
| Peasant | 1 | 0+ | ❌ | Basic Chat |
| Citizen | 2 | 2,001+ | ❌ | Join Factions |
| Knight | 3 | 4,801+ | ❌ | Create Petitions |
| Baron | 4 | 10,001+ | ❌ | Message Intermediary |
| Earl | 5 | 18,001+ | ✅ | VIP Access, 3 Decrees/month |
| Marquis | 6 | 32,001+ | ✅ | Host Events, 5 Decrees/month |
| Duke | 7 | 60,001+ | ✅ | Royal Chambers, 7 Decrees/month |
| Prince | 8 | 100,001+ | ✅ | Kingdom Influence, 10 Decrees/month |
| King | 9 | 200,001+ | ✅ | Ultimate Authority, Unlimited Decrees |

## 🛠 Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Supabase (Database, Auth, Real-time)
- **Build Tool**: Vite
- **UI Components**: Radix UI + Custom Components
- **Routing**: React Router v6
- **State Management**: React Hooks

## 📱 Features Overview

### Authentication
- Email/password login and signup
- Automatic profile creation with trigger functions
- Secure session management

### Real-time Chat
- Live message updates across all clients
- Channel-based conversations
- User presence and typing indicators

### VIP System
- Royal decree highlighting and pinning
- Exclusive channel access
- Enhanced visual effects for VIP users

## 🎨 Design System

The app uses a comprehensive medieval design system with:
- **Colors**: Royal gold primary, noble purple accents
- **Typography**: Medieval serif fonts (Cinzel + Crimson Text)
- **Components**: Custom button variants, badges, and effects
- **Animations**: Subtle glows, shimmers, and transitions

## 🗄 Database Schema

- **profiles**: User data with ranks, XP, VIP status
- **channels**: Chat rooms with rank restrictions
- **messages**: Chat messages with decree support
- **RLS Policies**: Secure data access controls

---

## Project info

**URL**: https://lovable.dev/projects/df2fbc06-31fb-464f-81c5-11e7d3378f4b

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/df2fbc06-31fb-464f-81c5-11e7d3378f4b) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## Can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/df2fbc06-31fb-464f-81c5-11e7d3378f4b) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)

---

*Enter the kingdom, claim your throne, and chat like royalty!* 👑

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
