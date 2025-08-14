<p align="center">
  <img src="https://res.cloudinary.com/dxurnpbrc/image/upload/v1755193688/810dec08-559e-435c-8c5b-3de1ca035492.png" alt="Jeda Pomodoro Timer" width="100%" />
</p>

# Jeda - Pomodoro Timer

Jeda is a feature-rich Pomodoro timer application designed to help you stay focused and productive. Built with Next.js and TypeScript, it offers a modern, customizable interface with advanced features like statistics tracking, ambient sounds, and user authentication.

## Features

- **Pomodoro Timer**: Classic 25-minute focus sessions with customizable break times
- **Multiple Timer Modes**: Pomodoro, Short Break, and Long Break modes
- **Customizable Settings**: Adjust timer durations, colors, sounds, and more
- **Background Customization**: Choose between color themes or beautiful preset images
- **Ambient Sound Support**: Play relaxing background sounds during focus sessions
- **Statistics Tracking**: Track your focus time and productivity streaks
- **Keyboard Shortcuts**: Quick access to all features with keyboard commands
- **User Authentication**: Sign in to save your preferences and track progress
- **Responsive Design**: Works beautifully on all device sizes

## Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/jeda-web.git
cd jeda-web
```

2. Install dependencies:
```bash
bun install
```

3. Copy the environment template:
```bash
cp env.template .env
```

4. Set up your database and environment variables

5. Run the development server:
```bash
bun dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Core Features

### Pomodoro Timer
- 25-minute focus sessions by default
- 5-minute short breaks and 15-minute long breaks
- Automatic switching between modes
- Start/Pause and Skip functionality
- Visual progress indicator

### Settings & Customization
- Adjustable timer durations for each mode
- Color themes for each timer mode
- Background customization (color or image)
- Volume control for alarms and backsounds
- Alarm sound selection
- Auto-start settings for breaks and pomodoros
- Long break interval configuration

### Ambient Sounds
- Play relaxing background sounds during focus sessions
- Multiple ambient sound options (rain, ocean, etc.)
- Individual volume control for each sound
- Play/pause and reset all sounds functionality

### Statistics & Tracking
- Track your focus time and productivity
- View your current streak and days accessed
- Leaderboard rankings for users
- Daily statistics tracking
- Session history

### Keyboard Shortcuts
- **Space**: Start/Pause timer
- **1**: Switch to Pomodoro mode
- **2**: Switch to Short Break mode
- **3**: Switch to Long Break mode
- **R**: Open/Close Stats
- **S**: Open/Close Settings
- **K**: Open/Close Keyboard Shortcuts
- **A**: Open/Close Ambient Sounds

## Authentication

Jeda uses Better Auth for user authentication with support for:
- Email/password login
- Social login (GitHub, Google, Discord)
- Session management
- User preference persistence
- Statistics tracking per user

## Project Structure

```
jeda-web/
├── app/                    # Next.js app directory
│   ├── api/                # API routes
│   ├── login/              # Login page
│   └── page.tsx            # Main page
├── components/             # React components
│   ├── feature/            # Feature components
│   ├── layout/             # Layout components
│   └── ui/                 # UI primitives
├── lib/                    # Utility functions and hooks
│   ├── store/              # Zustand store for timer state
│   ├── auth/               # Authentication logic
│   └── utils/              # Utility functions
├── db/                     # Database schema and queries
├── public/                 # Static assets
│   ├── sounds/             # Audio files
│   └── images/             # Image assets
└── README.md               # This file
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, issues, or feature requests, please open an issue on the GitHub repository.