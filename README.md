# Beacon IAS - Career & Education Operating System

A modern Career & Education Operating System built for Civil Services (UPSC IAS/IPS) aspirants and institutions, featuring Student, Mentor, and Admin dashboards, AI Assistant, assessment tools, and personalized career roadmaps.

## 🚀 Features

- **Student Dashboard**: Personalized readiness index, daily study plan, milestone tracking, and analytics.
- **Diagnostic Assessment**: 5-factor psychological & analytical profiling to uncover student archetypes.
- **Career Roadmaps**: Step-by-step milestones, optional subject selectors, and strategic preparation phases.
- **Mentor & Institutional Dashboards**: Student batch management, task assignment, and institutional analytics.
- **AI Assistant**: Intelligent study advisor for syllabus guidance, answer evaluation, and query resolution.
- **Cross-Platform**: Web & Mobile (Capacitor Android) support.

## 🛠️ Tech Stack

- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS v4 + Motion
- **Icons**: Lucide React
- **Mobile**: Capacitor Android

## 📦 Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm / yarn / pnpm

### Installation

```bash
npm install
```

### Environment Setup

Create a `.env` or `.env.local` file from the `.env.example` template if using AI features:

```bash
cp .env.example .env.local
```

### Local Development

```bash
npm run dev
```

### Production Build

```bash
npm run build
```

## 🌐 Deploy to Vercel

This repository is pre-configured for one-click deployment on [Vercel](https://vercel.com).

1. Import the repository on Vercel.
2. Framework Preset: **Vite**
3. Build Command: `npm run build`
4. Output Directory: `dist`
5. Click **Deploy**.
